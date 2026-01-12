import { useState, useEffect } from "react";
import { ref, onValue, set, remove, get } from "firebase/database";
import { rtdb } from "../firebase"; // Đảm bảo đường dẫn này đúng với file config của bạn
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // 1. Lắng nghe dữ liệu từ Firebase
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const favRef = ref(rtdb, `users/${user.uid}/favorites`);
    const unsubscribe = onValue(favRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển Object thành Array để hiển thị
        setFavorites(Object.values(data));
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Hàm Toggle (Thêm/Xóa) trực tiếp trên Database
  const toggleFavorite = async (movie) => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu phim yêu thích!");
      return;
    }

    const movieKey = movie._id || movie.slug;
    const favRef = ref(rtdb, `users/${user.uid}/favorites/${movieKey}`);

    try {
      const snapshot = await get(favRef);
      if (snapshot.exists()) {
        // Nếu đã có thì xóa
        await remove(favRef);
      } else {
        // Nếu chưa có thì thêm mới (Firebase sẽ tự tạo key 'favorites' nếu chưa có)
        await set(favRef, {
          _id: movie._id || "",
          name: movie.name,
          poster_url: movie.poster_url,
          slug: movie.slug,
          origin_name: movie.origin_name || "",
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error("Lỗi cập nhật ", error);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some((m) => m._id === movieId);
  };

  return { favorites, toggleFavorite, isFavorite };
};