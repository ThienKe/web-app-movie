import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import MovieCard from "../components/movie/MovieCard";
import MovieCardSkeleton from "../components/movie/MovieCardSkeleton";
import { searchMovies } from "../services/api";
import SEO from '../components/SEO';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  // Ép kiểu page từ URL về Number
  const page = parseInt(searchParams.get("page")) || 1;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const seoData = useMemo(() => ({
    title: keyword ? `Tìm kiếm: ${keyword}` : "Tìm kiếm phim",
    description: `Kết quả tìm kiếm phim cho từ khóa: ${keyword}`
  }), [keyword]);

  // Hàm đổi trang đồng bộ với URL
  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchParams({ keyword, page: newPage });
  };

  // Gọi API khi keyword hoặc page thay đổi
  useEffect(() => {
    if (!keyword) return;

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const response = await searchMovies(keyword, page);
        // Lưu ý: API search thường trả về mảng items trực tiếp hoặc lồng trong data
        // Giả sử searchMovies trả về items từ response.data.data.items
        const items = response?.items || response || [];

        // Cập nhật đè (xóa cũ lấy mới) để tránh lag và giống trang List
        setMovies(items);
        
        // Kiểm tra còn trang sau không (OPhim search thường limit 20)
        setHasMore(items.length >= 24);

      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        setMovies([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [keyword, page]);

  return (
    <>
      <SEO title={seoData.title} description={seoData.description} />
      
      <div className="pt-24 min-h-screen text-white px-4 md:px-16 lg:px-24 max-w-400 mx-auto">
        <h1 className="text-2xl font-semibold mb-10 flex items-baseline gap-2">
          <span className="text-gray-400 font-normal">Kết quả cho:</span>
          <span className="text-white">"{keyword}"</span>
        </h1>

      
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 transition-opacity duration-300">
            {movies.map((movie) => (
              <div key={movie._id || movie.slug} className="animate-fadeIn">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-xl italic">Rất tiếc, không tìm thấy phim phù hợp...</p>
          </div>
        )}

        {/* ===== PAGINATION BOX (Góc phải giống trang List) ===== */}
        {!loading && movies.length > 0 && (
          <div className="mt-16 flex justify-end items-center gap-4 pb-20 border-t border-white/5 pt-10">
            <div className="text-xs text-gray-500 font-medium mr-2">
              Trang <span className="text-white">{page}</span>
            </div>

            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-2xl">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-white/10 text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Trước
              </button>

              <div className="w-px h-8 bg-white/10 self-center"></div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasMore}
                className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Sau
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}