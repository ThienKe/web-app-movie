import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";
import { useState } from "react";

export default function MovieCard({ movie, large = false }) {
  const imageUrl = getImageUrl(movie);
  const [imgError, setImgError] = useState(false);

  
  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="group block transition-transform duration-300 ease-out will-change-transform"
    >
      <div
        className={`relative overflow-hidden rounded-xl mb-3 ${large ? "aspect-[9/12]" : "aspect-[2/3]"
          }`}
      >
       <img
  src={imageUrl}
  alt={movie.name || movie.origin_name}
  loading="lazy"
  decoding="async"
  className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06] will-change-transform ${
    imgError ? "opacity-0" : "opacity-100" // Ẩn ảnh nếu lỗi để lộ nền tối của div cha
  }`}
  // Khi lỗi, chỉ đơn giản là set state thành true
  onError={() => setImgError(true)}
/>

        {/* Overlay */}
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between text-xs font-semibold pointer-events-none">
          {movie.lang && (
            <span className="bg-red-700/80 backdrop-blur px-2 py-0.5 rounded-md text-white text-[10px] sm:text-xs">
              {movie.lang}
            </span>
          )}
          {movie.quality && (
            <span className="bg-red-800/80 backdrop-blur px-2 py-0.5 rounded-md text-white text-[10px] sm:text-xs">
              {movie.quality}
            </span>
          )}
        </div>

        {/* Year */}
        {movie.year && (
          <span className="absolute bottom-2 right-2 bg-red-900/80 backdrop-blur px-2 py-0.5 text-xs sm:text-[11px] font-semibold rounded-md text-white pointer-events-none">
            {movie.year}
          </span>
        )}
      </div>

      <h3 className="text-sm sm:text-base font-medium line-clamp-2 px-2 text-center leading-snug text-white/90 group-hover:text-white transition-colors">
        {movie.name || movie.origin_name}
      </h3>
    </Link>
  );
}
