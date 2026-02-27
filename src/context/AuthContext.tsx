import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type UserRole = "admin" | "member";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  attempts: number;
  isLocked: boolean;
  sessionExpiresAt: number | null;
  extendSession: () => void;
  /** DEV ONLY — skips all auth, logs in instantly */
  devLogin: (email?: string) => void;
}

// ─── Weekly Code System ──────────────────────────────────────────────────────

const PRIVATE_SALT = "SGR-SYRUP-PRIVATE-VAULT-2025";

/** Admin master key — never rotates. Change this to something secret before going live. */
export const ADMIN_MASTER_KEY = "SGR-VAULT-ADMIN-7X4K-2025";

/** djb2 hash — deterministic 32-bit integer from a string */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash | 0;
  }
  return Math.abs(hash);
}

/** Week number since Unix epoch (increments every 7 days) */
function getCurrentWeekNumber(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

/**
 * Generates a deterministic weekly access code for a member email.
 * Format: XXXX-XXXX (8 safe alphanumeric chars, no I/O/0/1 for clarity).
 * Rotates automatically every 7 days. weekOffset previews next/prev week.
 */
export function generateWeeklyCode(email: string, weekOffset = 0): string {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 safe chars
  const weekNum = getCurrentWeekNumber() + weekOffset;
  const input = `${email.toLowerCase()}|${weekNum}|${PRIVATE_SALT}`;
  const h1 = djb2Hash(input);
  const h2 = djb2Hash(input + "|b");
  const part1 = Array.from({ length: 4 }, (_, i) => CHARS[(h1 >> (i * 5)) & 31]).join("");
  const part2 = Array.from({ length: 4 }, (_, i) => CHARS[(h2 >> (i * 5)) & 31]).join("");
  return `${part1}-${part2}`;
}

/** Returns hours until the current weekly code resets (max 168h) */
export function getHoursUntilReset(): number {
  const week = getCurrentWeekNumber();
  const nextWeekMs = (week + 1) * 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((nextWeekMs - Date.now()) / (60 * 60 * 1000));
}

// ─── Mock Users ──────────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, { role: UserRole; name: string }> = {
  "admin@sipsgettinreal.test": { role: "admin", name: "Admin" },
  "member@sipsgettinreal.test": { role: "member", name: "Member" },
  "cardinal.hunain@gmail.com": { role: "admin", name: "Cardinal" },
  "vip@example.com": { role: "member", name: "VIP Customer" },
  "inactive@example.com": { role: "member", name: "Inactive User" },
};

// ─── Session ─────────────────────────────────────────────────────────────────

const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);

  const isLocked = lockUntil !== null && Date.now() < lockUntil;

  // Restore existing session on mount
  useEffect(() => {
    const saved = localStorage.getItem("authSession");
    if (saved) {
      try {
        const { user: savedUser, expiresAt } = JSON.parse(saved);
        if (expiresAt > Date.now()) {
          setUser(savedUser);
          setSessionExpiresAt(expiresAt);
        } else {
          localStorage.removeItem("authSession");
        }
      } catch {
        localStorage.removeItem("authSession");
      }
    }
  }, []);

  // Persist session when user logs in
  useEffect(() => {
    if (user) {
      const expiresAt = Date.now() + SESSION_DURATION;
      setSessionExpiresAt(expiresAt);
      localStorage.setItem("authSession", JSON.stringify({ user, expiresAt }));
    } else {
      localStorage.removeItem("authSession");
      setSessionExpiresAt(null);
    }
  }, [user]);

  // Auto-logout when session expires
  useEffect(() => {
    if (!sessionExpiresAt) return;
    const interval = setInterval(() => {
      if (Date.now() >= sessionExpiresAt) logout();
    }, 10_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpiresAt]);

  const extendSession = useCallback(() => {
    if (user) {
      const expiresAt = Date.now() + SESSION_DURATION;
      setSessionExpiresAt(expiresAt);
      localStorage.setItem("authSession", JSON.stringify({ user, expiresAt }));
    }
  }, [user]);

  /**
   * Unified login for members and admins.
   * - Admins: code must equal ADMIN_MASTER_KEY
   * - Members: code must equal generateWeeklyCode(email) for this week
   */
  const login = useCallback(
    async (email: string, code: string): Promise<boolean> => {
      if (isLocked) return false;
      await new Promise((r) => setTimeout(r, 700));
      const emailLower = email.toLowerCase().trim();
      const u = MOCK_USERS[emailLower];

      if (u) {
        const isAdmin = u.role === "admin";
        const expected = isAdmin ? ADMIN_MASTER_KEY : generateWeeklyCode(emailLower);
        if (code.trim().toUpperCase() === expected.toUpperCase()) {
          setUser({
            id: `${u.role}-${emailLower.replace(/[^a-z0-9]/g, "-")}`,
            email: emailLower,
            role: u.role,
            name: u.name,
          });
          setAttempts(0);
          return true;
        }
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) setLockUntil(Date.now() + 15 * 60 * 1000);
      return false;
    },
    [isLocked, attempts]
  );

  /** DEV ONLY — bypasses all auth checks */
  const devLogin = useCallback((email = "cardinal.hunain@gmail.com") => {
    const emailLower = email.toLowerCase();
    const u = MOCK_USERS[emailLower];
    if (!u) return;
    setUser({ id: "dev-bypass-001", email: emailLower, role: u.role, name: u.name });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAttempts(0);
    setLockUntil(null);
    setSessionExpiresAt(null);
    localStorage.removeItem("authSession");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        attempts,
        isLocked,
        sessionExpiresAt,
        extendSession,
        devLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
