// src/pages/History.jsx
import { useState, useEffect } from "react";
import MovieCard from "../components/movie/MovieCard";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Tạm localStorage (sau backend)
    const saved = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(saved);
  }, []);

  if (!history.length) {
    return <div className="pt-20 text-center py-20 text-2xl text-white">Chưa có lịch sử xem phim!</div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Lịch Sử Xem Phim</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {history.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}