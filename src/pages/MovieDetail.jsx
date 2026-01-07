// src/pages/MovieDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetail } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import noImage from "../assets/no-image.jpg";
import { useFavorites } from "../hooks/useFavorites";
import { getMoviePeoples } from "../services/api";
import { getMovieImages } from "../services/api";


export default function MovieDetail() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [peoples, setPeoples] = useState([]);
  const [images, setImages] = useState({ posters: [], backdrops: [] });


  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      try {
        const [movieData, peoplesRes, imagesData] = await Promise.all([
          getMovieDetail(slug),
          getMoviePeoples(slug),
          getMovieImages(slug),
        ]);

        if (!mounted) return;

        setMovie(movieData);
        setPeoples(peoplesRes?.data?.data?.peoples || []);
        setImages(imagesData || { posters: [], backdrops: [] });

      } catch (err) {
        console.error("Fetch movie error:", err);
        setMovie(null);
        setPeoples([]);
        setImages({ posters: [], backdrops: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    return () => (mounted = false);
  }, [slug]);



  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl animate-pulse">Đang tải chi tiết phim...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="pt-20 min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl text-gray-400">Không tìm thấy phim!</p>
      </div>
    );
  }

  const posterUrl = getImageUrl(movie);
  const TMDB_PROFILE = "https://image.tmdb.org/t/p/w185";




  return (
    <div className="pt-20 min-h-screen  text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <img
              src={posterUrl}
              alt={movie.name}
              className="w-full rounded-2xl shadow-2xl border border-white/20"
            />

            {Array.isArray(peoples) && peoples.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Diễn viên</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {peoples.map((p) => (
                    <div key={p.tmdb_people_id} className="text-center">
                      <img
                        src={
                          p.profile_path
                            ? `${TMDB_PROFILE}${p.profile_path}`
                            : "/no-avatar.png"
                        }
                        alt={p.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg"
                      />
                      <p className="mt-2 text-sm font-medium">{p.name}</p>
                      {p.character && (
                        <p className="text-xs text-gray-400">{p.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Thông tin phụ dưới poster */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 space-y-3">
              <h2 className="text-xl font-bold">{movie.name}</h2>
            </div>
          </div>


          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">{movie.name}</h1>

            <div className="flex flex-wrap gap-3 text-sm">
              {movie.lang && <span className="bg-slate-800 px-4 py-2 rounded-full">{movie.lang}</span>}
              <span className="bg-slate-800 px-4 py-2 rounded-full">{movie.year}</span>
              {movie.quality && <span className="bg-slate-800 px-4 py-2 rounded-full">{movie.quality}</span>}
              <span className="bg-slate-800 px-4 py-2 rounded-full">{movie.episode_current || movie.episode_total || "Full"}</span>
            </div>

            <div className="space-y-2 text-gray-300">
              <p><strong>Thể loại:</strong> {movie.category?.map(c => c.name).join(", ") || "N/A"}</p>
              <p><strong>Quốc gia:</strong> {movie.country?.map(c => c.name).join(", ") || "N/A"}</p>
              <p><strong>Đạo diễn:</strong> {movie.director?.join(", ") || "N/A"}</p>
              <p><strong>Diễn viên:</strong> {movie.actor?.join(", ") || "N/A"}</p>
              <p><strong>Thời lượng:</strong> {movie.time || "N/A"}</p>
              <p><strong>Trạng thái:</strong> {movie.status || "N/A"}</p>
            </div>


            <div>
              <h2 className="text-2xl font-semibold mb-3">Nội dung phim</h2>
              <p className="text-gray-200 leading-relaxed">
                {movie.content?.replace(/<[^>]*>/g, "") || "Chưa có mô tả."}
              </p>
            </div>

            {(images?.backdrops?.length > 0 || images?.posters?.length > 0) && (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6">Hình ảnh phim</h2>

                <div className="flex gap-4 overflow-x-auto pb-4">
                  {[...(images.backdrops || []).slice(0, 6),
                  ...(images.posters || []).slice(0, 4)
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                      className="h-40 rounded-xl object-cover hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            )}






            {movie?.episodes?.[0]?.server_data?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Danh sách tập</h2>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {movie.episodes[0].server_data.map((ep, i) => (
                    <Link
                      key={i}
                      to={`/xem/${slug}/${ep.slug}`}
                      className="bg-white/10 hover:bg-white/20 py-3 text-center rounded-lg transition font-medium"
                    >
                      {ep.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-5 mt-6">
              <Link
                to={`/xem/${slug}`}
                className="bg-slate-700 text-white  px-10 py-5 rounded-xl text-xl font-semibold hover:scale-105 transition shadow-2xl"
              >
                Xem phim ngay
              </Link>
              <button
                onClick={() => toggleFavorite(movie)}
                className={`px-10 py-5 rounded-xl text-xl font-medium transition flex items-center gap-3 ${isFavorite(movie._id)
                  ? "bg-slate-700 text-white"
                  : "border-2 border-white hover:bg-white/10"
                  }`}
              >
                {isFavorite(movie._id) ? "Đã Yêu Thích" : "Yêu Thích"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}