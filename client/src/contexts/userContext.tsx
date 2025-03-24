import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";

// Define context type
interface UserContextType {
  userId: string | null;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // const { userId } = useAuth();
  const userId = "59da1140-6735-45c7-8f9d-65dca84e5072";
  return (
    <UserContext.Provider value={{ userId: userId ?? null }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
