// src/components/movie/MovieSection.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play, ArrowRightCircle } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";
import MovieCard from "./MovieCard";

export default function MovieSection({ title, movies, viewAllLink, variant = "default" }) {
  const isCinema = variant === "cinema";
  const isHighlight = variant === "highlight";
  const isRoundedFull = variant === "rounded-full-card";
  const isFrame = variant === 'frame';
  const isZigzag = variant === 'zigzag';

  // Cinema lấy 6 card, các mục khác lấy 12
  const displayMovies = movies ? (isCinema ? movies.slice(0, 6) : movies.slice(0, 12)) : [];

  if (!displayMovies.length) return null;

  return (
    <section className="w-full max-w-400 mx-auto mb-12 md:mb-24">
      <div className={`
        relative px-4 md:px-16 lg:px-24
        ${isFrame ? 'py-8 md:p-12  ' : ''}
      `}>
        
        {/* Header: Căn chỉnh lại cho Mobile gọn hơn */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <h2 className={`font-semibold tracking-tight  pl-3 ${
            isFrame ? 'text-xl md:text-4xl ' : 'text-lg md:text-3xl text-white'
          }`}>
            {title}
          </h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-[10px] md:text-sm text-gray-400 hover:text-white flex items-center gap-1 group bg-white/5 md:bg-transparent px-3 py-1 rounded-full">
              Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Wrapper cho Slider */}
        <div className="relative group/slider">
          
          {/* Mũi tên gợi ý vuốt (Chỉ hiện Mobile) */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none md:hidden animate-bounce-horizontal text-white/40">
            <ArrowRightCircle size={20} />
          </div>

          {/* Hệ thống Grid/Slider */}
          <div className={`
            /* MOBILE: Slider mượt, ẩn scrollbar */
            flex overflow-x-auto pb-4 gap-4 snap-x scrollbar-hide
            /* DESKTOP: Grid tùy biến theo variant */
            md:grid md:overflow-visible md:pb-0 md:gap-8 lg:gap-10
            ${isCinema ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-4 lg:grid-cols-6'}
          `}>
            {displayMovies.map((movie, index) => {
              const imageUrl = getImageUrl(movie);

              return (
                <div 
                  key={`${movie._id}-${index}`}
                  className={`
                    /* Mobile: Luôn là 44% (hiện ~2.2 card) để đồng bộ 9 section */
                    min-w-[44%] w-[44%] snap-start
                    /* Desktop: Trả về grid item */
                    md:min-w-0 md:w-full
                    /* Ziczac chỉ áp dụng Desktop */
                    ${isZigzag ? 'md:even:translate-y-12 md:odd:-translate-y-2' : ''}
                  `}
                >
                  <Link to={`/phim/${movie.slug}`} className="block group">
                    <div className={`
                      relative overflow-hidden shadow-lg transition-all duration-500 rounded-xl
                      aspect-2/3
                      /* Desktop Cinema: Giữ tỉ lệ 16/9 ngang */
                      ${isCinema ? 'md:aspect-video md:rounded-2xl' : ''}
                      /* Desktop Highlight */
                      ${isHighlight ? 'md:rounded-tl-[40px] md:rounded-br-[40px] md:border-2 md:border-red-900' : ''}
                      ${isRoundedFull ? 'md:rounded-[40px]' : ''}
                      group-hover:scale-[1.03]
                    `}>
                      <img 
                        src={imageUrl} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={movie.name} 
                      />
                      
                      {/* Badge chất lượng (Chỉ hiện Desktop cho sạch mobile) */}
                      <div className="absolute top-2 left-2 bg-red-600 text-[9px] md:text-[11px] text-white px-1.5 py-0.5 rounded font-bold">
                        {movie.episode_current || movie.quality}
                      </div>

                      {/* Overlay Play (Chỉ Desktop) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-all hidden md:flex items-center justify-center">
                        <div className="bg-red-600 p-3 rounded-full text-white transform scale-50 group-hover:scale-100 transition-transform">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Thông tin phim dưới card */}
                    <div className="mt-3 px-1">
                      <h3 className="text-white text-xs md:text-base font-semibold line-clamp-1 group-hover:text-red-500 transition-colors">
                        {movie.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1 text-[10px] md:text-xs text-gray-500 font-medium">
                        <span>{movie.year}</span>
                        <span className="text-red-500/80">{movie.lang}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}