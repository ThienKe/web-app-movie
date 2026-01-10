import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Nếu đang loading thì hiện màn hình đen hoặc trống, không được Navigate ngay
  if (loading) return <div className="bg-black min-h-screen"></div>;

  if (!user) return <Navigate to="/dang-nhap" />;

  if (role === "admin" && user.role !== "admin") return <Navigate to="/" />;

  return children;
};