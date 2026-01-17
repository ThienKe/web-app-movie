import React, { useState, useEffect, useRef } from "react"; // Đã thêm useEffect vào đây
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { User as UserIcon, Lock, Loader2 } from "lucide-react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { rtdb } from "../firebase"; 
import SEO from '../components/SEO';
import { useMemo } from "react";
export default function Login() {
    const { loginWithGoogle, loginWithEmail } = useAuthContext();
    const navigate = useNavigate();
    
    const identifierRef = useRef();
    const passwordRef = useRef();
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    

    const onLoginClick = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const identifier = identifierRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        try {
            let emailToLogin = "";

            if (identifier.includes("@")) {
                emailToLogin = identifier;
            } else {
                const usersRef = ref(rtdb, "users");
                const userQuery = query(usersRef, orderByChild("username"), equalTo(identifier));
                const snapshot = await get(userQuery);

                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const userKey = Object.keys(usersData)[0];
                    emailToLogin = usersData[userKey].email;
                } else {
                    setLoading(false);
                    return setError("Tên đăng nhập không tồn tại!");
                }
            }

            if (!emailToLogin || !emailToLogin.includes("@")) {
                setLoading(false);
                return setError("Không thể xác định email của tài khoản này!");
            }

            await loginWithEmail(emailToLogin, password);
            navigate("/");

        } catch (err) {
            console.error("Lỗi đăng nhập:", err.code);
            if (err.code === "auth/invalid-email") setError("Email không đúng định dạng!");
            else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") 
                setError("Mật khẩu không chính xác!");
            else if (err.code === "auth/user-not-found") setError("Tài khoản không tồn tại!");
            else setError("Lỗi: " + (err.message || "Không thể đăng nhập"));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/");
        } catch (err) {
            setError("Không thể đăng nhập bằng Google");
        }
    };

    return (
        <>
<SEO title="Đăng Nhập" description="Đăng nhập tài khoản Phim Cú Đêm." />
        <div className="min-h-screen flex items-center justify-center bg-opacity-90 bg-[url('/bg-home.jpg')] bg-cover bg-center px-4">
      <div className=" p-8 rounded-2xl w-full max-w-md text-white shadow-2xl backdrop-blur-md border border-white/10">
                <h1 className="text-2xl font-semibold mb-8 text-center text-white tracking-widest uppercase">
                    Đăng nhập
                </h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={onLoginClick} className="flex flex-col gap-6">
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                        <input
                            ref={identifierRef}
                            type="text"
                            name="username"
                            placeholder="Username hoặc Email"
                            className="p-3 pl-10 w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-white focus:outline-none transition text-white"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                        <input
                            ref={passwordRef}
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            required
                            className="p-3 pl-10 w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-white focus:outline-none transition text-white"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-800 p-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "ĐĂNG NHẬP"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Chưa có tài khoản?{" "}
                        <Link to="/dang-ky" className="text-red-500 font-bold hover:text-red-600 transition-colors underline-offset-4 hover:underline">
                            Tạo tài khoản mới
                        </Link>
                    </p>
                </div>

                <div className="my-8 text-center text-gray-400 relative">
                    <span className="bg-[#0f172a] px-4 relative z-10 text-xs uppercase font-semibold">Hoặc tiếp tục với</span>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black p-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                >
                    {/* Google SVG Icon giữ nguyên */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Account
                </button>
            </div>
        </div>
        </>
    );
}