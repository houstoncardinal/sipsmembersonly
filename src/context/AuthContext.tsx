import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type UserRole = "admin" | "member";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface RegisteredMember {
  email: string;
  name: string;
  registeredAt: string;
}

/** Per-member single-use code entry stored in localStorage */
export interface MemberCodeEntry {
  currentCode: string;
  generatedAt: string;
  lastUsedAt?: string;   // set when they log in (code was consumed)
  pendingNotify: boolean; // true after login — new code not yet sent to member
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
  /** Register a new member email into the auth system */
  registerMember: (email: string, name: string) => void;
  registeredMembers: RegisteredMember[];
  /** All stored per-member code entries */
  memberCodes: Record<string, MemberCodeEntry>;
  /** Create an initial code for a member (called when invite is sent). Returns the code. */
  initMemberCode: (email: string) => string;
  /** Mark a member's pending notify as cleared (after admin sends new code) */
  clearNotify: (email: string) => void;
  /** DEV ONLY — skips all auth, logs in instantly */
  devLogin: (email?: string) => void;
}

// ─── Code Generation ──────────────────────────────────────────────────────────

/** Admin master key — fixed, never rotates */
export const ADMIN_MASTER_KEY = "iDOwh4t1w4nt";

/** Generate a cryptographically random XXXX-XXXX access code */
export function generateRandomCode(): string {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 safe chars — no I/O/0/1
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const part1 = Array.from(bytes.slice(0, 4), (b) => CHARS[b % CHARS.length]).join("");
  const part2 = Array.from(bytes.slice(4, 8), (b) => CHARS[b % CHARS.length]).join("");
  return `${part1}-${part2}`;
}

// ─── Built-in Users ───────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, { role: UserRole; name: string }> = {
  "sipsgettingr@gmail.com": { role: "admin", name: "Sips Admin" },
  "cardinal.hunain@gmail.com": { role: "admin", name: "Cardinal" },
  "member@sipsgettinreal.test": { role: "member", name: "Member" },
  "vip@example.com": { role: "member", name: "VIP Customer" },
  "inactive@example.com": { role: "member", name: "Inactive User" },
};

// ─── Session ──────────────────────────────────────────────────────────────────

const SESSION_DURATION = 20 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);

  // Dynamic member registry
  const [registeredMembers, setRegisteredMembers] = useState<RegisteredMember[]>(() => {
    try { return JSON.parse(localStorage.getItem("memberRegistry") || "[]"); }
    catch { return []; }
  });

  // Per-member single-use code store
  const [memberCodes, setMemberCodes] = useState<Record<string, MemberCodeEntry>>(() => {
    try { return JSON.parse(localStorage.getItem("memberCodes") || "{}"); }
    catch { return {}; }
  });

  const isLocked = lockUntil !== null && Date.now() < lockUntil;

  // Persist registry
  useEffect(() => {
    localStorage.setItem("memberRegistry", JSON.stringify(registeredMembers));
  }, [registeredMembers]);

  // Persist code store
  useEffect(() => {
    localStorage.setItem("memberCodes", JSON.stringify(memberCodes));
  }, [memberCodes]);

  // Restore session
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

  // Persist session
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

  // Auto-logout on expiry
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

  /** Add a new member to the auth registry so they can log in */
  const registerMember = useCallback((email: string, name: string) => {
    const emailLower = email.toLowerCase().trim();
    setRegisteredMembers((prev) => {
      if (prev.find((m) => m.email === emailLower)) return prev;
      return [...prev, { email: emailLower, name: name || emailLower, registeredAt: new Date().toISOString() }];
    });
  }, []);

  /**
   * Generate and store an initial access code for a member.
   * If one already exists, returns the current one unchanged.
   * Call this when sending an invite — returns the code to include in the email.
   */
  const initMemberCode = useCallback(
    (email: string): string => {
      const emailLower = email.toLowerCase().trim();
      const existing = memberCodes[emailLower];
      if (existing) return existing.currentCode;
      const code = generateRandomCode();
      setMemberCodes((prev) => ({
        ...prev,
        [emailLower]: { currentCode: code, generatedAt: new Date().toISOString(), pendingNotify: false },
      }));
      return code;
    },
    [memberCodes]
  );

  /** Clear the pending-notify flag after admin sends the new code to the member */
  const clearNotify = useCallback((email: string) => {
    const emailLower = email.toLowerCase().trim();
    setMemberCodes((prev) => {
      if (!prev[emailLower]) return prev;
      return { ...prev, [emailLower]: { ...prev[emailLower], pendingNotify: false } };
    });
  }, []);

  /**
   * Unified login.
   * - Admin emails: verify against ADMIN_MASTER_KEY (never rotates).
   * - Member emails: verify against their stored single-use code,
   *   then immediately rotate to a fresh code and flag pendingNotify.
   */
  const login = useCallback(
    async (email: string, code: string): Promise<boolean> => {
      if (isLocked) return false;
      await new Promise((r) => setTimeout(r, 700));
      const emailLower = email.toLowerCase().trim();

      const builtIn = MOCK_USERS[emailLower];
      const registered = registeredMembers.find((m) => m.email === emailLower);
      const u: { role: UserRole; name: string } | null =
        builtIn ?? (registered ? { role: "member", name: registered.name } : null);

      if (u) {
        const isAdmin = u.role === "admin";
        const storedEntry = memberCodes[emailLower];
        const expected = isAdmin ? ADMIN_MASTER_KEY : storedEntry?.currentCode ?? "";

        if (expected && code.trim().toUpperCase() === expected.toUpperCase()) {
          setUser({
            id: `${u.role}-${emailLower.replace(/[^a-z0-9]/g, "-")}`,
            email: emailLower,
            role: u.role,
            name: u.name,
          });
          setAttempts(0);

          // Rotate code immediately after successful member login
          if (!isAdmin) {
            const newCode = generateRandomCode();
            setMemberCodes((prev) => ({
              ...prev,
              [emailLower]: {
                currentCode: newCode,
                generatedAt: new Date().toISOString(),
                lastUsedAt: new Date().toISOString(),
                pendingNotify: true, // admin needs to send this to member
              },
            }));
          }
          return true;
        }
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) setLockUntil(Date.now() + 15 * 60 * 1000);
      return false;
    },
    [isLocked, attempts, registeredMembers, memberCodes]
  );

  /** DEV ONLY */
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
        registerMember,
        registeredMembers,
        memberCodes,
        initMemberCode,
        clearNotify,
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
