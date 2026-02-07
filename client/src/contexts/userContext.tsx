import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { getMe } from "@/services/auth/api";
import { setTokenGetter } from "@/axios-instance";

// Define user type
interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Define context type
interface UserContextType {
  userId: string | null;
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set up the token getter function
  useEffect(() => {
    const tokenGetterFn = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      return token;
    };

    setTokenGetter(tokenGetterFn);
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching user data
          const response = await getMe();
          setUser(response.user);
        } catch {
          // Token is invalid, clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      }
      setIsLoaded(true);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Show a loader while initializing
  if (!isLoaded) {
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
    <UserContext.Provider
      value={{
        userId: user?.id ?? null,
        user,
        isLoaded,
        isSignedIn: !!user,
        login,
        logout,
      }}
    >
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
