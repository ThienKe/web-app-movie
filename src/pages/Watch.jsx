import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetail } from "../services/api";
import { useFavorites } from "../hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import HlsPlayer from "../components/player/HlsPlayer";
import { getMoviePeoples } from "../services/api";

export default function Watch() {
  const { slug, episodeSlug } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentServer, setCurrentServer] = useState(0);
  const navigate = useNavigate();
  const [peoples, setPeoples] = useState(null);
  

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      try {
        const [movieData, peoplesData] = await Promise.all([
          getMovieDetail(slug),
          getMoviePeoples(slug),
        ]);

        if (!mounted) return;

        setMovie(movieData);
        setPeoples(peoplesData?.data?.peoples || []);

      } catch (err) {
        console.error("Fetch movie error:", err);
        setMovie(null);
        setPeoples(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    return () => (mounted = false);
  }, [slug]);


  if (loading) {
    return <div className="pt-20 text-center text-2xl text-white">Đang tải phim...</div>;
  }

  if (!movie) {
    return <div className="pt-20 text-center text-2xl text-white">Không tìm thấy phim</div>;
  }

  // ===== XỬ LÝ SERVER + EPISODE =====
  const servers = (movie.episodes || []).filter(
    (sv) =>
      sv.server_data?.some(
        (ep) => ep.link_m3u8 || ep.link_embed
      )
  );

  const server = servers[currentServer] || {};
  const episodes = server.server_data || [];

  const currentEpisode =
    episodes.find(
      (ep) =>
        ep.slug === episodeSlug &&
        (ep.link_m3u8 || ep.link_embed)
    ) ||
    episodes.find((ep) => ep.link_m3u8 || ep.link_embed) ||
    null;

  console.log("EP:", currentEpisode);

  const playerUrl =
    currentEpisode?.link_embed || currentEpisode?.link_m3u8;

    const handleNextEpisode = () => {
  const currentIndex = episodes.findIndex(
    ep => ep.slug === currentEpisode?.slug
  );

  const nextEp = episodes[currentIndex + 1];
  if (nextEp) {
    navigate(`/xem/${slug}/${nextEp.slug}`);
  }
};


  return (
    <div className="pt-20 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">

        {/* ===== TIÊU ĐỀ ===== */}
        <h1 className="text-3xl font-bold mb-2">
          {movie.name} {currentEpisode?.name && `- ${currentEpisode.name}`}
        </h1>

        <p className="text-gray-400 mb-4">
          {movie.origin_name} • {movie.year} • {movie.time}
        </p>

        {/* ===== PLAYER ===== */}
        <div className="aspect-video  rounded-xl overflow-hidden mb-6">
          {currentEpisode?.link_embed &&
            currentEpisode.link_embed.startsWith("http") ? (
            <iframe
              src={currentEpisode.link_embed}
              className="w-full h-full"
              allowFullScreen
              frameBorder="0"
              title="Embed Player"
            />
          ) : currentEpisode?.link_m3u8 &&
            currentEpisode.link_m3u8.startsWith("http") ? (
            <HlsPlayer
              src={currentEpisode.link_m3u8}
              movieId={movie._id}
              episodeSlug={currentEpisode.slug}
              onEnded={handleNextEpisode}
            />

          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
              Phim đang được cập nhật, vui lòng quay lại sau.
            </div>
          )}
        </div>


        {/* ===== ACTION ===== */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => toggleFavorite(movie)}
            className={`px-6 py-3 rounded-xl font-medium transition ${isFavorite(movie._id)
              ? "bg-stalete-500 hover:bg-stalete-600 border border-stalete-700"
              : "bg-white/10 hover:bg-white/20 border border-white"
              }`}
          >
            {isFavorite(movie._id) ? "❤️" : "🤍"}
          </button>

          <Link
            to={`/phim/${slug}`}
            className="px-6 py-3 rounded-xl bg-stalete-500 hover:bg-stalete-600 border border-stalete-700"
          >
            Chi tiết phim
          </Link>
        </div>

        {/* ===== CHỌN SERVER ===== */}
        <div className="flex flex-wrap gap-3">
          {servers.map((sv, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentServer(index);
                navigate(`/xem/${slug}`);
              }}
              className={`px-5 py-2 rounded-lg transition font-medium ${index === currentServer
                ? "bg-blue-950 text-white"
                : "bg-white/10 hover:bg-white/20"
                }`}
            >
              {sv.server_name}
            </button>
          ))}
        </div>

        {/* ===== DANH SÁCH TẬP ===== */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Danh sách tập</h2>
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
            {episodes.map((ep) => (
              <Link
                key={ep.slug}
                to={`/xem/${slug}/${ep.slug}`}
                className={`py-2 text-center rounded-lg font-medium ${ep.slug === currentEpisode?.slug
                  ? "bg-blue-800"
                  : "bg-white/10 hover:bg-white/20"
                  }`}
              >
                {ep.name}
              </Link>
            ))}
          </div>
        </div>
        {/* ===== THÔNG TIN CHI TIẾT ===== */}
        <div className="border-t border-white/10 pt-8 space-y-3 text-gray-300">
          <p><b>Nội dung:</b> {movie.content}</p>
          <p><b>Thể loại:</b> {movie.category?.map(c => c.name).join(", ")}</p>
          <p><b>Quốc gia:</b> {movie.country?.map(c => c.name).join(", ")}</p>
          <p><b>Năm:</b> {movie.year}</p>
          <p><b>Thời lượng:</b> {movie.time}</p>
          <p><b>Đạo diễn:</b> {movie.director?.join(", ")}</p>
          <p><b>Diễn viên:</b> {movie.actor?.join(", ")}</p>
          <p><b>Chất lượng:</b> {movie.quality} • {movie.lang}</p>
        </div>

        {peoples.length > 0 && (
  <div className="mt-16 border-t border-white/10 pt-10">
    <h2 className="text-xl font-semibold mb-4">Diễn viên</h2>

    <div className="flex gap-6 overflow-x-auto">
      {peoples.slice(0, 10).map(p => (
        <div key={p.tmdb_people_id} className="min-w-[100px] text-center">
          <img
            src={
              p.profile_path
                ? `https://image.tmdb.org/t/p/w185${p.profile_path}`
                : noImage
            }
            className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
          />
          <p className="text-xs">{p.name}</p>
        </div>
      ))}
    </div>
  </div>
)}


        


      </div>
    </div>
  );
}
