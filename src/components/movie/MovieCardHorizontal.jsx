import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

export default function MovieCardHorizontal({ movie }) {
  const imageUrl = getImageUrl(movie);

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="group block w-65"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

        {/* Year */}
        {movie.year && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-1 rounded">
            {movie.year}
          </span>
        )}
      </div>

      <h3 className="mt-2 text-sm line-clamp-2">
        {movie.name}
      </h3>
    </Link>
  );
}
