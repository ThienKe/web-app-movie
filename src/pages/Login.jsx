// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // gọi API backend ở đây
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

      // Lưu token vào localStorage
      localStorage.setItem("token", data.token);

      // Redirect về trang home
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full  backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Đăng Nhập
        </h1>

        {error && (
          <div className="bg-red-600/80 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-3 rounded-xl bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-3 rounded-xl bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="mt-5 text-center text-gray-400">
          Chưa có tài khoản?{" "}
          <a href="/dang-ky" className="text-white font-medium hover:underline">
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
}
