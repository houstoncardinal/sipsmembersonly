import React, { createContext, useContext, useState, useCallback } from "react";

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
  authStep: number; // 0=none, 1=credentials done, 2=phrase done, 3=2fa done, 4=complete
  setAuthStep: (step: number) => void;
  login: (email: string, password: string) => Promise<boolean>;
  verifyPhrase: (phrase: string) => Promise<boolean>;
  verify2FA: (code: string) => Promise<boolean>;
  logout: () => void;
  attempts: number;
  isLocked: boolean;
}

const MOCK_USERS: Record<string, { password: string; role: UserRole; name: string; phrase: string }> = {
  "admin@sipsgettinreal.test": {
    password: "Password123!",
    role: "admin",
    name: "Admin",
    phrase: "inner-circle",
  },
  "member@sipsgettinreal.test": {
    password: "Password123!",
    role: "member",
    name: "Member",
    phrase: "inner-circle",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const isLocked = lockUntil !== null && Date.now() < lockUntil;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800)); // simulate
    const u = MOCK_USERS[email.toLowerCase()];
    if (u && u.password === password) {
      setPendingEmail(email.toLowerCase());
      setAuthStep(1);
      setAttempts(0);
      return true;
    }
    return false;
  }, []);

  const verifyPhrase = useCallback(async (phrase: string): Promise<boolean> => {
    if (isLocked) return false;
    await new Promise((r) => setTimeout(r, 600));
    if (!pendingEmail) return false;
    const u = MOCK_USERS[pendingEmail];
    if (u && u.phrase === phrase.toLowerCase().trim()) {
      setAuthStep(2);
      setAttempts(0);
      return true;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 5) {
      setLockUntil(Date.now() + 15 * 60 * 1000);
    }
    return false;
  }, [pendingEmail, attempts, isLocked]);

  const verify2FA = useCallback(async (_code: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 400));
    // Mock: any 6-digit code works
    if (!pendingEmail) return false;
    const u = MOCK_USERS[pendingEmail];
    if (u) {
      setUser({
        id: pendingEmail === "admin@sipsgettinreal.test" ? "admin-001" : "member-001",
        email: pendingEmail,
        role: u.role,
        name: u.name,
      });
      setAuthStep(4);
      return true;
    }
    return false;
  }, [pendingEmail]);

  const logout = useCallback(() => {
    setUser(null);
    setAuthStep(0);
    setPendingEmail(null);
    setAttempts(0);
    setLockUntil(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user && authStep === 4, authStep, setAuthStep, login, verifyPhrase, verify2FA, logout, attempts, isLocked }}
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
