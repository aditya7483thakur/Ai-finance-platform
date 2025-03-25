import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useGetUserId } from "@/services/users/query";

// Define context type
interface UserContextType {
  userId: string | null;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const { data } = useGetUserId(userId ?? "");

  return (
    <UserContext.Provider value={{ userId: data?.data ?? null }}>
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
