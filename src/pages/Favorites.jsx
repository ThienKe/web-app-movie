import { useState, useEffect } from "react";
import MovieCard from "../components/movie/MovieCard";
import { useAuth } from "../hooks/useAuth";
import { ref, onValue } from "firebase/database";
import {rtdb } from "../firebase";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Trỏ vào đúng node favorites của user trên Firebase
    const favRef = ref(rtdb, `users/${user.uid}/favorites`);

    const unsubscribe = onValue(favRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển Object thành Array để hiển thị
        setFavorites(Object.values(data));
      } else {
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="pt-20 text-center text-white">Đang tải...</div>;

  return (
    <div className="pt-20 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <h1 className="text-3xl font-semibold mb-8">Phim Yêu Thích</h1>
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-2xl text-gray-400">Chưa có phim yêu thích nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {favorites.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}