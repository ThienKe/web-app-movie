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
        console.log(`Đang tìm kiếm với keyword: ${keyword}, trang: ${page}`);
        const items = await searchMovies(keyword, page);
        
        console.log("Kết quả nhận được từ hàm searchMovies:", items);

        if (!items || items.length === 0) {
          setHasMore(false);
          // Không return ở đây để setLoading(false) chạy được
        } else {
          setMovies(prev => (page === 1 ? items : [...prev, ...items]));
          // Nếu số lượng trả về ít hơn 20 thì là trang cuối
          setHasMore(items.length >= 20);
        }
      } catch (err) {
        console.error("Lỗi tại SearchPage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [keyword, page]);

  return (
    <div className="pt-24 min-h-screen text-white px-4 md:px-8 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-semibold mb-8 uppercase tracking-wider border-l-4 border-red-600 pl-4">
        Kết quả cho: <span className="text-red-500">"{keyword}"</span>
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

      {/* Pagination */}
      {movies.length > 0 && (
        <div className="mt-12 flex justify-center gap-4 pb-10">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
            disabled={page === 1}
            className="px-6 py-2 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-red-600 transition"
          >
            Trang trước
          </button>
          <span className="flex items-center font-bold px-4 bg-red-600/20 rounded-lg text-red-500 border border-red-600/30">
            {page}
          </span>
          <button
            onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
            disabled={!hasMore}
            className="px-6 py-2 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-red-600 transition"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}

//