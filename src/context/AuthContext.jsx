import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, rtdb } from "../firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup ,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theo dõi trạng thái đăng nhập thực tế từ Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Lấy thêm thông tin role từ Database nếu cần
        const userRef = ref(rtdb, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.exists() ? snapshot.val() : {};

        const fullUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userData.username,
          role: userData.role || "user",
        };
        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Hàm Đăng nhập Google
  const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  
  // Kiểm tra xem có phải mobile không
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  try {
    if (isMobile) {
      // TRÊN MOBILE: Dùng Redirect để tránh lỗi COOP
      console.log("Đang dùng Redirect cho Mobile...");
      await signInWithRedirect(auth, provider);
    } else {
      // TRÊN DESKTOP: Vẫn dùng Popup cho mượt
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    console.error("Lỗi Google Login:", error);
    throw error;
  }
};
useEffect(() => {
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        // Đây là nơi xử lý sau khi user đăng nhập xong và quay lại web
        console.log("Đăng nhập thành công từ Redirect:", result.user);
        // Bạn có thể thực hiện navigate("/") ở đây nếu cần
      }
    } catch (error) {
      console.error("Lỗi xử lý Redirect:", error);
    }
  };

  handleRedirectResult();
}, []);

  // Hàm Đăng nhập Email/Username
  const loginWithEmail = async (identifier, password) => {
    try {
      let emailToLogin = identifier;

      // Nếu identifier không phải email, đi tìm email theo username
      if (!identifier.includes("@")) {
        const userQuery = query(ref(rtdb, "users"), orderByChild("username"), equalTo(identifier));
        const snapshot = await get(userQuery);
        if (!snapshot.exists()) throw new Error("Tên người dùng không tồn tại");
        
        const data = snapshot.val();
        const userId = Object.keys(data)[0];
        emailToLogin = data[userId].email;
      }

      const result = await signInWithEmailAndPassword(auth, emailToLogin, password);
      return result.user;
    } catch (error) {
      console.error("Lỗi Login Email:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};