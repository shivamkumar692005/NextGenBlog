import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Auth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please sign in to access this page");
        navigate("/signin", { replace: true });
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <>loading....</>;
  }

  if (!isAuthenticated) {
    return null; 
  }

  return <Outlet />;
}