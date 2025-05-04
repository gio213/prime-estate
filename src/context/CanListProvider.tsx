"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getUserCredit } from "@/hooks/can-list-property";

// Define the interface for the context value
interface CanListContextType {
  canList: boolean;
  checkUserCredit: () => Promise<void>;
}

// Create context with a default value that matches the interface
const CanListContext = createContext<CanListContextType | undefined>(undefined);

interface CanListProviderProps {
  children: React.ReactNode;
}

export const CanListProvider = ({ children }: CanListProviderProps) => {
  const [canList, setCanList] = useState<boolean>(false);

  const checkUserCredit = async () => {
    try {
      const hasCredit = await getUserCredit();
      setCanList(hasCredit);
    } catch (error) {
      console.error("Error checking user credit:", error);
    }
  };

  // Optional: Check user credit on initial load
  useEffect(() => {
    checkUserCredit();
  }, []);

  return (
    <CanListContext.Provider value={{ canList, checkUserCredit }}>
      {children}
    </CanListContext.Provider>
  );
};

export const useCanList = () => {
  const context = useContext(CanListContext);
  if (!context) {
    throw new Error("useCanList must be used within a CanListProvider");
  }
  return context;
};
