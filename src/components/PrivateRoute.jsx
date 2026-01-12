import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuthContext();

  // QUAN TRỌNG: Phải đợi xác thực xong mới quyết định có chuyển hướng hay không
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Đang xác thực...</div>;
  }

  if (!user) {
    return <Navigate to="/dang-nhap" />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};