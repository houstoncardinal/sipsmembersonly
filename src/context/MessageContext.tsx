import React, { createContext, useContext, useState, useCallback } from "react";

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystem?: boolean;
}

interface MessageContextType {
  messages: Message[];
  sendMessage: (to: string, subject: string, content: string) => void;
  markAsRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  getUserMessages: (userId: string) => Message[];
  deleteMessage: (id: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Mock initial messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    from: "admin@sipsgettinreal.test",
    to: "member@sipsgettinreal.test",
    subject: "Welcome to Sips Getting Real",
    content: "Welcome to our exclusive members-only platform! If you have any questions about your orders or our products, feel free to reach out.",
    timestamp: new Date().toISOString(),
    read: false,
    isSystem: true,
  },
];

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  React.useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback((to: string, subject: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      from: "current-user", // This would be the logged-in user's email
      to,
      subject,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  }, []);

  const getUnreadCount = useCallback(
    (userId: string) => {
      return messages.filter((msg) => msg.to === userId && !msg.read).length;
    },
    [messages]
  );

  const getUserMessages = useCallback(
    (userId: string) => {
      return messages
        .filter((msg) => msg.to === userId || msg.from === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    [messages]
  );

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
        markAsRead,
        getUnreadCount,
        getUserMessages,
        deleteMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessages must be used within MessageProvider");
  return ctx;
};
