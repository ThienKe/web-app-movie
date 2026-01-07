import { useEffect, useRef, useState } from "react";
import { getListMovies } from "../../services/api";
import MovieCard from "../movie/MovieCard";

export default function UpcomingMovieSlider() {
  const [movies, setMovies] = useState([]);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getListMovies("phim-sap-chieu", 1);
        setMovies(items.slice(0, 20));
      } catch (e) {
        console.error("Lỗi fetch phim sắp chiếu:", e);
      }
    };
    fetchData();
  }, []);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.offsetWidth * 0.9; // Cuộn 90% chiều rộng
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <section 
      className="mb-16 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-5 text-white">
        Phim sắp chiếu
      </h2>

      {/* Nút trái */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ❮
      </button>

      {/* Nút phải */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ❯
      </button>

      {/* Slider - KHÔNG TỰ CUỘN, chỉ cuộn khi ấn nút */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {movies.map((movie) => (
          <div key={movie.slug} className="flex-none w-64">
            <MovieCard movie={movie} horizontal />
          </div>
        ))}
      </div>
    </section>
  );
}