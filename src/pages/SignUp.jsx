import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, rtdb } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useRef } from "react";
import PageMeta from "../components/PageMeta";

export default function SignUp() {
  //const { loginWithEmail, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Chỉ dùng Ref cho gọn và bảo mật
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    const username = usernameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) return setError("Mật khẩu không khớp!");
    if (password.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự!");

    setLoading(true);
    try {
      // 1. Tạo tài khoản Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Cập nhật Profile
      await updateProfile(user, { displayName: username });

      // 3. Lưu vào Database
      await set(ref(rtdb, `users/${user.uid}`), {
        uid: user.uid,
        username: username, // Lưu để sau này Login tìm kiếm
        email: email,
        role: "user",
        createdAt: Date.now(),
      });

      alert("Đăng ký thành công!");
      navigate("/dang-nhap");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("Email đã tồn tại!");
      else setError("Lỗi đăng ký, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-opacity-90 bg-[url('/bg-home.jpg')] bg-cover bg-center px-4">
      <PageMeta title="Đăng Ký Tài Khoản" />
      <div className=" p-8 rounded-2xl w-full max-w-md text-white shadow-2xl backdrop-blur-md border border-white/10">
        <h1 className="text-3xl font-semibold mb-8 text-center uppercase tracking-wider text-white">Đăng ký</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          {/* Ô USERNAME MỚI */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
            <input
              ref={usernameRef}
              type="text"
              name="username"
              placeholder="Tên người dùng (Username)"
              className="p-3 pl-10 w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-white focus:outline-none transition text-white"
              required
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Email"
              className="p-3 pl-10 w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-white focus:outline-none transition text-white"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
            <input
              ref={passwordRef}
              type="password"
              name="new-password"
              placeholder="Mật khẩu"
              className="p-3 pl-10 w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-white focus:outline-none transition text-white"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
            <input
              ref={confirmPasswordRef}
              type="password"
              name="confirm-password"
              placeholder="Xác nhận mật khẩu"
              className="p-3 pl-10 w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-white focus:outline-none transition text-white"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            disabled={loading}
            className="bg-red-600 hover:bg-red-800 p-3 rounded-xl font-bold transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "ĐĂNG KÝ NGAY"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="text-white font-bold hover:text-red-600 transition">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}