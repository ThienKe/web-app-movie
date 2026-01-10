// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { ref, get, set, query, orderByChild, equalTo} from "firebase/database";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  // THÊM DÒNG NÀY: Để kiểm soát trạng thái đang kiểm tra đăng nhập
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    // Đọc xong (dù có user hay không) thì tắt loading
    setLoading(false); 
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = result.user;

      const roleSnap = await get(ref(db, `users/${uid}/role`));
      const role = roleSnap.exists() ? roleSnap.val() : "user";

      const userData = { uid, email, displayName, role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Lỗi đăng nhập Google:", err);
      return null;
    }
  };

  // src/hooks/useAuth.js (Cập nhật hàm loginWithEmail)

const loginWithEmail = async (identifier, password) => {
  try {
    let emailToLogin = identifier;

    // 1. Kiểm tra nếu identifier không phải là email (tức là nhập username)
    if (!identifier.includes("@")) {
      const usersRef = ref(db, "users");
      // Tìm user có username khớp với identifier
      const userQuery = query(usersRef, orderByChild("username"), equalTo(identifier));
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        const userData = Object.values(snapshot.val())[0];
        emailToLogin = userData.email;
      } else {
        throw new Error("Tên người dùng không tồn tại!");
      }
    }

    // 2. Tiến hành đăng nhập bằng Firebase Auth chuẩn
    const result = await signInWithEmailAndPassword(auth, emailToLogin, password);
    const user = result.user;

    // 3. Lấy thêm thông tin role từ database
    const roleSnap = await get(ref(db, `users/${user.uid}/role`));
    const role = roleSnap.exists() ? roleSnap.val() : "user";

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || identifier,
      role: role
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return true;
  } catch (err) {
    console.error("Lỗi đăng nhập:", err.message);
    // Trả về thông báo lỗi thân thiện
    if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        throw new Error("Thông tin đăng nhập không chính xác!");
    }
    throw err;
  }
};

  const toggleFavorite = async (movie) => {
    if (!user) {
      alert("Vui lòng đăng nhập để dùng tính năng này!");
      return;
    }
    const favRef = ref(db, `users/${user.uid}/favorites/${movie.slug}`);
    const snap = await get(favRef);
    if (snap.exists()) {
      await set(favRef, null);
      return { action: "removed" };
    } else {
      await set(favRef, { ...movie, addedAt: Date.now() });
      return { action: "added" };
    }
  };

  const addToHistory = async (movie) => {
    if (!user) return;
    const historyRef = ref(db, `users/${user.uid}/history/${movie.slug}`);
    await set(historyRef, { ...movie, lastWatched: Date.now() });
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
  };

  // TRẢ VỀ THÊM BIẾN LOADING
  return { 
    user, 
    loading, 
    loginWithGoogle, 
    loginWithEmail, 
    logout, 
    toggleFavorite, 
    addToHistory 
  };
};