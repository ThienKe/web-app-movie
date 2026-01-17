import { useEffect, useRef, useState } from "react";
import { getListMovies } from "../../services/api";
import MovieCard from "../movie/MovieCard";

export default function ExtraMovieSlider() {
  const [movies, setMovies] = useState([]);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const responseData = await getListMovies("phim-moi", 1);
      
      // Fix: responseData.items mới là mảng
      const items = responseData?.items || [];
      
      setMovies(items.slice(0, 24));
    } catch (e) {
      console.error("Lỗi fetch phim mới:", e);
    }
  };
  fetchData();
}, []);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.offsetWidth * 0.9;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <section 
      className="mt-16 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-5 text-white">
        Phim mới cập nhật
      </h2>

      <button
        onClick={() => scroll("left")}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ❮
      </button>

      <button
        onClick={() => scroll("right")}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ❯
      </button>

      <div
        ref={containerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {movies.map((movie) => (
          <div key={movie.slug} className="flex-none w-48">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}