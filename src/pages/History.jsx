// src/pages/History.jsx
import { useState, useEffect } from "react";
import MovieCard from "../components/movie/MovieCard";
import { useAuth } from "../hooks/useAuth";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const historyRef = ref(rtdb, `users/${user.uid}/history`);
    
    // Lắng nghe dữ liệu thời gian thực
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển object từ Firebase thành array và sắp xếp theo thời gian mới nhất
        const movieList = Object.values(data).sort((a, b) => b.lastWatched - a.lastWatched);
        setHistory(movieList);
      } else {
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="pt-20 text-center text-white">Đang tải...</div>;

  return (
    <div className="pt-20 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <h1 className="text-3xl font-semibold mb-8">Lịch Sử Xem Phim</h1>
        {history.length === 0 ? (
          <p className="text-gray-400">Bạn chưa xem phim nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {history.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}