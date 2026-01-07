// src/pages/Favorites.jsx
import { useFavorites } from "../hooks/useFavorites";
import MovieCard from "../components/movie/MovieCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="pt-20 min-h-screen text-white flex items-center justify-center">
        <p className="text-2xl text-gray-400">Chưa có phim yêu thích nào</p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-8">Phim Yêu Thích</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}