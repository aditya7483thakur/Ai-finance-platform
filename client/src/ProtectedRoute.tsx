import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <div>Loading...</div>; // Prevents flickering

  return isSignedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
