import React, { createContext, useContext, useState, useCallback } from "react";

export interface InviteCode {
  id: string;
  code: string;
  type: "single" | "multi";
  email?: string; // For single-use invites
  maxUses?: number; // For multi-use invites
  currentUses: number;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

interface InviteContextType {
  inviteCodes: InviteCode[];
  createInviteCode: (type: "single" | "multi", email?: string, maxUses?: number) => string;
  validateInviteCode: (code: string, email?: string) => boolean;
  deactivateInviteCode: (id: string) => void;
  deleteInviteCode: (id: string) => void;
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

// Generate random invite code
const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Format as XXXX-XXXX
  return `${result.slice(0, 4)}-${result.slice(4)}`;
};

// Mock initial data
const INITIAL_INVITES: InviteCode[] = [
  {
    id: "1",
    code: "VIP-FOUNDERS",
    type: "multi",
    maxUses: 100,
    currentUses: 12,
    createdBy: "admin@sipsgettinreal.test",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "2",
    code: "EARLY-ACCESS",
    type: "multi",
    maxUses: 50,
    currentUses: 23,
    createdBy: "admin@sipsgettinreal.test",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

export const InviteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>(() => {
    const saved = localStorage.getItem("inviteCodes");
    return saved ? JSON.parse(saved) : INITIAL_INVITES;
  });

  // Save to localStorage whenever inviteCodes changes
  React.useEffect(() => {
    localStorage.setItem("inviteCodes", JSON.stringify(inviteCodes));
  }, [inviteCodes]);

  const createInviteCode = useCallback((
    type: "single" | "multi",
    email?: string,
    maxUses?: number
  ) => {
    const code = generateCode();
    const newInvite: InviteCode = {
      id: Date.now().toString(),
      code,
      type,
      email: type === "single" ? email : undefined,
      maxUses: type === "multi" ? maxUses : 1,
      currentUses: 0,
      createdBy: "admin@sipsgettinreal.test",
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setInviteCodes((prev) => [...prev, newInvite]);
    return code;
  }, []);

  const validateInviteCode = useCallback((code: string, email?: string): boolean => {
    const invite = inviteCodes.find((i) => i.code.toUpperCase() === code.toUpperCase());
    
    if (!invite || !invite.isActive) return false;
    
    // Check if expired
    if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) return false;
    
    // Check max uses
    if (invite.maxUses && invite.currentUses >= invite.maxUses) return false;
    
    // For single-use, check email match
    if (invite.type === "single" && invite.email && email) {
      if (invite.email.toLowerCase() !== email.toLowerCase()) return false;
    }
    
    return true;
  }, [inviteCodes]);

  const deactivateInviteCode = useCallback((id: string) => {
    setInviteCodes((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, isActive: false } : invite
      )
    );
  }, []);

  const deleteInviteCode = useCallback((id: string) => {
    setInviteCodes((prev) => prev.filter((invite) => invite.id !== id));
  }, []);

  return (
    <InviteContext.Provider
      value={{
        inviteCodes,
        createInviteCode,
        validateInviteCode,
        deactivateInviteCode,
        deleteInviteCode,
      }}
    >
      {children}
    </InviteContext.Provider>
  );
};

export const useInvite = () => {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvite must be used within InviteProvider");
  return ctx;
};
