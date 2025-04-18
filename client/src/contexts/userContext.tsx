import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useGetUserId } from "@/services/users/query";
import { setTokenGetter } from "@/axios-instance";

// Define context type
interface UserContextType {
  userId: string | null;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { userId, isLoaded: isAuthLoaded, getToken } = useAuth();
  const { data, isLoading: isUserLoading } = useGetUserId(userId ?? "");

  // Set up the token getter function once
  useEffect(() => {
    const tokenGetterFn = async () => {
      if (isAuthLoaded && userId) {
        return await getToken();
      }
      return null;
    };

    setTokenGetter(tokenGetterFn);
  }, [isAuthLoaded, userId, getToken]);

  // Show a loader while waiting for Clerk or Backend
  if (!isAuthLoaded || isUserLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-700 animate-bounce"></div>
          <div className="w-5 h-5 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-5 h-5 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

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
