import { ref, set, onValue } from "firebase/database";
import { rtdb } from "../firebase";
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";

export const useHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  // Lấy dữ liệu lịch sử về để hiển thị ở trang History.jsx
  useEffect(() => {
    if (!user) return;
    const historyRef = ref(rtdb, `users/${user.uid}/history`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Sắp xếp phim mới xem lên đầu
        const list = Object.values(data).sort((a, b) => b.lastWatched - a.lastWatched);
        setHistory(list);
      } else {
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Hàm để lưu phim vào lịch sử
  const addToHistory = async (movie) => {
    if (!user || !movie) return;

    // Đường dẫn: users/[uid]/history/[movie_id]
    const historyRef = ref(rtdb, `users/${user.uid}/history/${movie._id || movie.slug}`);

    try {
      await set(historyRef, {
        _id: movie._id || "",
        name: movie.name,
        poster_url: movie.poster_url,
        slug: movie.slug,
        lastWatched: Date.now(), // Lưu thời gian hiện tại
      });
    } catch (error) {
      console.error("Lỗi lưu lịch sau:", error);
    }
  };

  return { history, addToHistory };
};