// src/components/hero/HeroSlider.jsx
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { getPhimChieuRap } from "../../services/api";
import noImage from "../../assets/no-image.jpg";
import { getImageUrl } from "../../utils/getImageUrl"; // ← Import từ util chung (path đúng từ hero đến utils)
import { useFavorites } from "../../hooks/useFavorites";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom"; // ← Thêm dòng này

export default function HeroSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPhimChieuRap(1);
        setMovies(data.items.slice(0, 6));
      } catch (err) {
        console.error("Lỗi fetch phim chiếu rạp:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useGSAP(
    () => {
      if (!loading && movies.length) {
        gsap.set(containerRef.current, { opacity: 1 });
        gsap.fromTo(
          containerRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.8, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-info > *",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.6, ease: "power3.out" }
        );
      }
    },
    { scope: containerRef, dependencies: [loading, movies] }
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-linear-to-b from-slate-900 to-black">
        <div className="text-2xl animate-pulse text-white">
          Đang tải phim chiếu rạp hot...
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-linear-to-b from-slate-900 to-black">
        <p className="text-xl text-gray-400">
          Không có dữ liệu phim chiếu rạp.
        </p>
      </div>
    );
  }

  return (
  <div
    ref={containerRef}
    className="relative w-full h-[95vh] -mt-20 overflow-hidden opacity-0"
  >
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      autoplay={{ delay: 7000, disableOnInteraction: false }}
      navigation
      pagination={{ clickable: true }}
      loop
      className="h-full"
    >
      {movies.map((movie) => {
        const imageUrl = getImageUrl(movie);

        return (
          <SwiperSlide key={movie._id}>
            {/* BACKGROUND */}
            <div className="absolute inset-0">
              <img
                src={imageUrl}
                alt={`Background ${movie.name}`}
                className="w-full h-full object-cover brightness-50 scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = noImage;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="relative h-full max-w-7xl mx-auto px-4 md:px-10 flex items-center">
              <div className="hero-info md:w-1/2 space-y-6 z-10">
                <h1 className="text-2xl md:text-2xl lg:text-2xl font-Regular text-white drop-shadow-2xl">
                  {movie.name}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm md:text-base">
                  <span className="bg-gray-700/80 backdrop-blur px-5 py-2 rounded-full font-medium">
                    {movie.lang || "Vietsub"}
                  </span>
                  <span className="bg-gray-700/80 backdrop-blur px-5 py-2 rounded-full">
                    {movie.year}
                  </span>
                  <span className="bg-gray-700/80 backdrop-blur px-5 py-2 rounded-full font-medium">
                    {movie.quality || "HD"}
                  </span>
                </div>

                <p className="text-gray-200 line-clamp-4 max-w-2xl text-lg">
                  {movie.content?.replace(/<[^>]*>/g, "").slice(0, 250) ||
                    "Xem phim hay online miễn phí chất lượng HD, không quảng cáo."}
                </p>

                <div className="flex gap-5">
                  <Link
                    to={`/xem/${movie.slug}`}
                    className="bg-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition shadow-xl"
                  >
                    Phát ngay
                  </Link>
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`px-6 py-3 rounded-xl font-medium text-lg transition flex items-center gap-2 ${
                      isFavorite(movie._id)
                        ? "bg-gray-500 text-white"
                        : "border-2 border-white hover:bg-white/10"
                    }`}
                  >
                    {isFavorite(movie._id) ? "❤️" : "❤️"}
                  </button>
                </div>
              </div>

              {/* POSTER PHẢI */}
              <div className="hidden lg:flex md:w-1/2 justify-end">
                <img
                  src={imageUrl}
                  alt={movie.name}
                  className="w-96 rounded-2xl shadow-2xl border border-white/20"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = noImage;
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  </div>
);
} 