import { ref, set, onValue, get } from "firebase/database";
import { rtdb } from "../firebase";
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";

export const useHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  // 1. Lấy dữ liệu (Từ Firebase hoặc LocalStorage)
  useEffect(() => {
    if (user) {
      const historyRef = ref(rtdb, `users/${user.uid}/history`);
      return onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data).sort((a, b) => b.lastWatched - a.lastWatched);
          setHistory(list);
        } else setHistory([]);
      });
    } else {
      const localData = JSON.parse(localStorage.getItem("guest_history") || "[]");
      setHistory(localData);
    }
  }, [user]);

  // 2. Hàm lưu lịch sử (Hỗ trợ lưu thời gian đang xem)
  const addToHistory = async (movie, currentTime = 0) => {
    const historyItem = {
      _id: movie._id || movie.slug,
      name: movie.name,
      poster_url: movie.poster_url,
      slug: movie.slug,
      episode_name: movie.episode_name || "",
      episode_slug: movie.episode_slug || "",
      lastWatched: Date.now(),
      currentTime: currentTime, // Lưu giây thứ bao nhiêu
    };

    if (user) {
      // Lưu vào Firebase
      const historyRef = ref(rtdb, `users/${user.uid}/history/${historyItem._id}`);
      await set(historyRef, historyItem);
    } else {
      // Lưu vào LocalStorage cho khách
      let localHistory = JSON.parse(localStorage.getItem("guest_history") || "[]");
      localHistory = localHistory.filter(item => item._id !== historyItem._id);
      localHistory.unshift(historyItem);
      localStorage.setItem("guest_history", JSON.stringify(localHistory.slice(0, 20)));
      setHistory(localHistory);
    }
  };

  // 3. Hàm lấy lại thời gian cũ để xem tiếp
  const getSavedTime = async (movieId) => {
    if (user) {
      const snapshot = await get(ref(rtdb, `users/${user.uid}/history/${movieId}/currentTime`));
      return snapshot.val() || 0;
    } else {
      const localData = JSON.parse(localStorage.getItem("guest_history") || "[]");
      const movie = localData.find(m => m._id === movieId);
      return movie ? movie.currentTime : 0;
    }
  };

  return { history, addToHistory, getSavedTime };
};