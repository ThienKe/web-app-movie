// src/components/movie/MovieSection.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";
import MovieCard from "./MovieCard";

export default function MovieSection({ title, movies, viewAllLink, variant = "default" }) {
  const sectionRef = useRef(null);

  // Kiểm tra an toàn để tránh lỗi slice
  const isCinema = variant === "cinema";
  const isChildhood = variant === "childhood";
  const isHighlight = variant === "highlight";
  const displayMovies = movies ? (isCinema ? movies.slice(0, 6) : movies.slice(0, 12)) : [];
  const isRoundedFull = variant === "rounded-full-card";
  if (!displayMovies.length) return null;

  return (
    <section ref={sectionRef} className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 mb-20">
      <div className={`
        ${variant === 'frame' ? 'p-8 md:p-12 border-[3px] border-red-600 bg-red-800/10 rounded-[50px] ' : ''}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className={`font-semibold ${
             variant === 'frame' ? 'text-2xl md:text-5xl ' : 'text-xl md:text-3xl text-white  pl-4'
          }`}>
            {title}
          </h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 group">
              Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Grid System */}
        <div className={`
          grid gap-8 md:gap-12
          ${isCinema ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}
        `}>
          {displayMovies.map((movie, index) => {
            const imageUrl = getImageUrl(movie);

            // 1. BIẾN THỂ PHIM BỘ & PHIM LẺ (HIGHLIGHT)
            if (isHighlight) {
              return (
                <Link 
                  to={`/xem/${movie.slug}`} 
                  key={movie._id}
                  className="group relative block w-full transition-all duration-500"
                >
                  {/* Card Image: Bo 2 góc chéo (Top-Left & Bottom-Right) */}
                  <div className="relative aspect-[2/3] rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg overflow-hidden border-2 border-red-900 group-hover:border-red-800 transition-all duration-500 shadow-lg group-hover:shadow-red-800/50">
                    <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={movie.name} />
                    
                    {/* Hover Overlay: Hiển thị thông tin Lang, Quality, Year */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center">
                      <div className="bg-red-500 p-3 rounded-full text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Play size={20} fill="currentColor" />
                      </div>
                      
                      <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                        <p className="text-white font-bold text-xs uppercase tracking-widest">{movie.quality || 'HD'}</p>
                        <p className="text-red-400 font-medium text-[10px] uppercase">{movie.lang || 'Vietsub'}</p>
                        <p className="text-gray-300 text-[10px]">{movie.year}</p>
                      </div>
                    </div>

                    {/* Badge mặc định góc trên (nếu có) */}
                    <div className="absolute top-3 right-3 bg-red-600 text-[10px] text-white px-2 py-1 rounded-md font-bold group-hover:opacity-0 transition-opacity">
                      {movie.episode_current || movie.quality}
                    </div>
                  </div>
                  
                  <h3 className="text-white mt-3 text-center font-medium text-sm group-hover:text-red-400 transition-colors truncate">
                    {movie.name}
                  </h3>
                </Link>
              );
            }

           if (isRoundedFull) {
              return (
                <Link 
                  to={`/xem/${movie.slug}`} 
                  key={movie._id}
                  className="group relative block w-full transition-all duration-300"
                >
                  <div className="relative aspect-[2/3] rounded-[30px] overflow-hidden border-2 border-red-900 group-hover:border-red-800 transition-all duration-300 shadow-lg">
                    {/* Hiệu ứng nảy lên (Bounce/Translate Y) */}
                    <img 
                      src={imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-110" 
                      alt={movie.name} 
                    />
                    
                    {/* Overlay thông tin (giữ style đồng nhất) */}
                     <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center">
                      <div className="bg-red-500 p-3 rounded-full text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Play size={20} fill="currentColor" />
                      </div>
                      
                      <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                        <p className="text-white font-bold text-xs uppercase tracking-widest">{movie.quality || 'HD'}</p>
                        <p className="text-red-400 font-medium text-[10px] uppercase">{movie.lang || 'Vietsub'}</p>
                        <p className="text-gray-300 text-[10px]">{movie.year}</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-red-600 text-[10px] text-white px-2 py-1 rounded-md font-bold group-hover:opacity-0 transition-opacity">
                      {movie.episode_current || movie.quality}
                    </div>
                  </div>
                  <h3 className="text-white mt-3 text-center font-medium text-sm group-hover:text-red-500 transition-colors truncate">
                    {movie.name}
                  </h3>
                </Link>
              );
            }

            // 3. CÁC TRƯỜNG HỢP CÒN LẠI (Cinema, Zigzag, Default)
            return (
              <div 
                key={`${title}-${movie._id}-${index}`}
                className={`${variant === 'zigzag' ? (index % 2 === 0 ? 'md:-translate-y-10' : 'md:translate-y-10') : ''}`}
              >
                {isCinema ? (
                   <Link to={`/xem/${movie.slug}`} className="group relative block aspect-video rounded-3xl overflow-hidden">
                     <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={movie.name} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                     <h3 className="absolute bottom-4 left-4 text-white font-bold">{movie.name}</h3>
                   </Link>
                ) : (
                  <MovieCard movie={movie} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}