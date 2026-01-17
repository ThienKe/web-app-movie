import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCard from "../components/movie/MovieCard";
import MovieCardSkeleton from "../components/movie/MovieCardSkeleton";
import { searchMovies } from "../services/api";
import PageMeta from "../components/PageMeta";

export default function SearchPage() {
  const [params] = useSearchParams();
  const keyword = params.get("keyword");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
const query = new URLSearchParams(window.location.search).get("q");
useEffect(() => {
    if (query) {
      document.title = `Kết quả tìm kiếm: ${query}`;
    } else {
      document.title = "Tìm kiếm phim";
    }
  }, [query]);
  // 1. Reset trạng thái khi từ khóa thay đổi
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [keyword]);

  // 2. Gọi API khi keyword hoặc page thay đổi
  useEffect(() => {
    if (!keyword) return;

    const fetchSearch = async () => {
      setLoading(true);
      try {
        
        const items = await searchMovies(keyword, page);
        
        

        if (!items || items.length === 0) {
          setHasMore(false);
          // Không return ở đây để setLoading(false) chạy được
        } else {
          setMovies(prev => (page === 1 ? items : [...prev, ...items]));
          // Nếu số lượng trả về ít hơn 20 thì là trang cuối
          setHasMore(items.length >= 20);
        }
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [keyword, page]);

  return (
    <div className="pt-24 min-h-screen text-white px-4 md:px-8 max-w-[1400px] mx-auto">
      <PageMeta title={query ? `Kết quả tìm kiếm: ${query}` : "Tìm kiếm phim"} />
      <h1 className="text-2xl font-semibold mb-8  pl-4">
        Kết quả cho: <span className="text-white font-semibold">"{keyword}"</span>
      </h1>

      {loading && movies.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id || movie.slug} movie={movie} />
          ))}
        </div>
      ) : !loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <p className="text-xl italic">Rất tiếc, không tìm thấy phim phù hợp...</p>
        </div>
      )}

      {/* ===== PAGINATION ===== */}
        <div className="mt-12 flex justify-end items-center space-x-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Trước
          </button>

          <span className="bg-white/10 px-5 py-3 rounded-xl">
            Trang {page}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            Sau
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
    </div>
  );
}

//