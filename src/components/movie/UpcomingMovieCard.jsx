import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

export default function UpcomingMovieCard({ movie }) {
  return (
    <Link to={`/phim/${movie.slug}`} className="flex-shrink-0 w-[340px]">
      <div
        className="
          relative h-[190px]
          rounded-xl overflow-hidden
          bg-slate-900
          transition-all duration-500
          hover:scale-[1.04]
          hover:shadow-2xl
        "
      >
        <img
          src={getImageUrl(movie)}
          alt={movie.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-sm font-semibold line-clamp-2">
            {movie.name}
          </h3>
        </div>

        {/* Badge */}
        <span className="absolute top-3 left-3 bg-emerald-400 text-black text-xs font-bold px-2 py-1 rounded">
          Sắp chiếu
        </span>
      </div>
    </Link>
  );
}
