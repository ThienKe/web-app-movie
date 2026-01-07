import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCard from "../components/movie/MovieCard";
import MovieCardSkeleton from "../components/movie/MovieCardSkeleton";
import { searchMovies } from "../services/api";

export default function SearchPage() {
  const [params] = useSearchParams();
  const keyword = params.get("keyword");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Reset khi keyword đổi
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [keyword]);

  useEffect(() => {
    if (!keyword) return;

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const items = await searchMovies(keyword, page);

        if (items.length === 0) {
          setHasMore(false);
        } else {
          setMovies(prev =>
            page === 1 ? items : [...prev, ...items]
          );
        }
      } catch (err) {
        console.error("Search error:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [keyword, page]);

  return (

      
    <div className="pt-24 min-h-screen text-white px-4 md:px-8">
      <h1 className="text-2xl font-semibold mb-8">
        Kết quả tìm kiếm:{" "}
        <span className="text-slate-300">"{keyword}"</span>
      </h1>

      {loading ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
    {Array.from({ length: 24 }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
    {movies.map((movie) => (
      <MovieCard
        key={movie._id || movie.slug}
        movie={movie}
      />
    ))}
  </div>
)}



      {/* Pagination */}
      <div className="mt-12 flex justify-end items-center space-x-3">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl disabled:opacity-50"
        >
          Trước
        </button>

        <span className="bg-white/10 px-5 py-3 rounded-xl">
          Trang {page}
        </span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasMore}
          className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
