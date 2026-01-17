// src/components/hero/HeroSlider.jsx
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { getPhimChieuRap, getPhimMoi } from "../../services/api";
import noImage from "../../assets/no-image.jpg";
import { getImageUrl } from "../../utils/getImageUrl";
import { useFavorites } from "../../hooks/useFavorites";
import { Link } from "react-router-dom";
import { Play, Info, Heart } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
      const data = await getPhimMoi(1);
      const topMovies = data.items.slice(0, 10);

      // Gọi chi tiết từng phim để lấy trường 'content'
      const fullDataMovies = await Promise.all(
        topMovies.map(async (movie) => {
          try {
            const detail = await getMovieDetail(movie.slug);
            return { ...movie, content: detail.item.content };
          } catch {
            return movie; // Nếu lỗi thì trả về data cũ
          }
        })
      );

      setMovies(fullDataMovies);
    } catch (err) {
      console.error("Lỗi fetch HeroSlider:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  useGSAP(
    () => {
      if (!loading && movies.length) {
        gsap.fromTo(
          ".hero-content-animate",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5 }
        );
      }
    },
    { scope: containerRef, dependencies: [loading, movies] }
  );

  if (loading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <div className="loader"></div>
      <p className="mt-4 text-gray-400 text-sm tracking-widest uppercase">Phim Cú Đêm</p>
    </div>
  );
}

  return (
    <div ref={containerRef} className="relative w-full h-[95vh] -mt-20 overflow-hidden bg-black hero-slider-container">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        className="h-full hero-swiper"
      >
        {movies.map((movie) => {
          const imageUrl = getImageUrl(movie);
          const cleanDescription = movie.content
            ? movie.content.replace(/<[^>]*>/g, "")
            : "Thông tin về bộ phim đang được cập nhật...";

          return (
            <SwiperSlide key={movie._id} className="relative overflow-hidden">
              {/* BACKDROP IMAGE */}
              <div className="absolute inset-0">
                <img
                  src={imageUrl}
                  alt={movie.name}
                  className="w-full h-full object-cover brightness-[0.35]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* MAIN CONTENT */}
              <div className="relative h-full max-w-[1500px] mx-auto px-6 md:px-16 flex items-center">
                <div className="w-full lg:w-2/3 space-y-4 md:space-y-6">

                  {/* TITLE RESPONSIVE - Sửa tại đây */}
                  <h1 className="hero-content-animate text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] drop-shadow-2xl max-w-[90%]">
                    {movie.name}
                  </h1>

                  {/* Metadata */}
                  <div className="hero-content-animate flex flex-wrap gap-2 md:gap-3 items-center text-sm md:text-base">
                    <span className="bg-red-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded font-bold text-xs md:text-sm">
                      {movie.quality || "Full HD"}
                    </span>
                    <span className="text-gray-300 border-l border-gray-600 pl-3">
                      {movie.year}
                    </span>
                    <span className="text-gray-300 border-l border-gray-600 pl-3">
                      {movie.lang || "Vietsub"}
                    </span>
                  </div>

                  {/* MÔ TẢ - Giảm size một chút để cân đối */}
                  <div className="hero-content-animate max-w-2xl">
                    <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed line-clamp-4 md:line-clamp-5 font-light">
                      {cleanDescription}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="hero-content-animate flex flex-wrap gap-4 pt-2">
                    <Link
                      to={`/xem/${movie.slug}`}
                      className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl"
                    >
                      <Play size={18} fill="currentColor" /> Phát Ngay
                    </Link>

                    <button
                      onClick={() => toggleFavorite(movie)}
                      className={`px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg flex items-center gap-2 border-2 transition-all duration-300 ${isFavorite(movie._id)
                          ? "bg-red-600/20 border-red-600 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                          : "bg-black/40 border-gray-500 text-white hover:border-white hover:bg-black/60"
                        }`}
                    >
                      <Heart
                        size={20}
                        className={`transition-colors duration-300 ${isFavorite(movie._id) ? "fill-red-500 text-red-500" : "text-white"}`}
                      />
                      <span>{isFavorite(movie._id) ? "đã thêm vào yêu thích" : "Thêm vào yêu thích"}</span>
                    </button>
                  </div>
                </div>

                {/* POSTER (Ẩn trên màn hình nhỏ, thu nhỏ trên laptop) */}
                <div className="hero-content-animate hidden xl:flex w-1/3 justify-end">
                  <img
                    src={imageUrl}
                    alt="Poster"
                    className="w-[280px] 2xl:w-[350px] aspect-[2/3] object-cover rounded-2xl shadow-2xl border border-white/10"
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* CSS ĐỂ ĐỔI MÀU MŨI TÊN (Inject style trực tiếp) */}
      <style>{`
        .hero-slider-container .swiper-button-next,
        .hero-slider-container .swiper-button-prev {
          color: white !important;
          transform: scale(0.7); /* Thu nhỏ mũi tên cho tinh tế */
        }
        .hero-slider-container .swiper-pagination-bullet {
          background: white !important;
        }
        .hero-slider-container .swiper-pagination-bullet-active {
          background: #dc2626 !important; 
        }
        @media (max-width: 1024px) {
          .hero-slider-container .swiper-button-next,
          .hero-slider-container .swiper-button-prev {
            display: none; 
          }
        }
      `}</style>
    </div>
  );
}
