import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import MovieCard from "../components/movie/MovieCard";
import { getCountry, getListMovies, getCategori } from "../services/api";
import ExtraMovieSlider from "../components/section/ExtraMovieSlider.jsx";
import UpcomingMovieSlider from "../components/section/UpcomingMovieSlider";
import MovieCardSkeleton from "../components/movie/MovieCardSkeleton";
import { toTitleCase } from "../utils/formatTitle";


export default function List() {
  const { slug } = useParams();
  const location = useLocation();
  const type = location.pathname.split("/")[1];
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ===== RESET KHI ĐỔI ROUTE ===== */
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [slug, type]);

  /* ===== FETCH MOVIES ===== */
  useEffect(() => {
    let mounted = true;

   

const fetchMovies = async () => {
  setLoading(true);
  try {
    let items = [];

    if (type === "danh-sach") {
      items = await getListMovies(slug, page);
    } else if (type === "the-loai") {
      items = await getCategori(slug, page);
    } else if (type === "quoc-gia") {
      items = await getCountry(slug, page);
    }

    if (!Array.isArray(items)) items = []; // đảm bảo luôn là mảng

    if (items.length === 0) {
      setHasMore(false);
    } else {
      setMovies((prev) => (page === 1 ? items : [...prev, ...items]));
      setHasMore(true);
    }
  } catch (err) {
    console.error("Lỗi fetch danh sách phim:", err);
    setMovies([]);
    setHasMore(false);
  } finally {
    setLoading(false);
  }
};



    fetchMovies();
    return () => (mounted = false);
  }, [slug, page, type]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const title = `${toTitleCase(type)}: ${toTitleCase(slug)}`;

  if (loading && page === 1) {
    return (
      <div className="pt-20 min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl animate-pulse">Đang tải phim...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen text-white">
      <div className="w-full px-4 md:px-6 lg:px-10 py-10">
        <UpcomingMovieSlider />

        <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>

        {loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3 md:gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id || movie.slug} movie={movie} />
            ))}
          </div>
        )}

        <ExtraMovieSlider />

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
    </div>
  );
}