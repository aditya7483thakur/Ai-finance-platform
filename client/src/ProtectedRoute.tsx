import { useUserContext } from "./contexts/userContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUserContext();
  if (!isLoaded) return <div>Loading...</div>; // Prevents flickering

  return isSignedIn ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
