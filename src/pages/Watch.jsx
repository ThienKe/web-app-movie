import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import HlsPlayer from "../components/player/HlsPlayer";
import { useHistory } from "../hooks/useHistory";
import Comments from '../components/common/Comments';
import ReactSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getMovieDetail, getMoviePeoples, getMovieImages, getCastFromTMDB } from "../services/api";
import RelatedMovies from '../components/movie/RelatedMovies';

const Slider = ReactSlider.default ? ReactSlider.default : ReactSlider;
const USER_PLACEHOLDER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe357375ec6d53937133c9099a1f51.svg";
const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w185";

export default function Watch() {
  const { slug, episodeSlug } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentServer, setCurrentServer] = useState(0);
  const navigate = useNavigate();
  const [peoples, setPeoples] = useState([]);
  const { addToHistory } = useHistory();
  const [images, setImages] = useState([]);

  // --- 1. FETCH DỮ LIỆU PHIM ---

useEffect(() => {
  let mounted = true;
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Lấy dữ liệu chi tiết phim trước để lấy TMDB ID
      const detailData = await getMovieDetail(slug);
      if (!mounted) return;
      setMovie(detailData);

      const tmdbId = detailData?.tmdb?.id;
      const movieType = detailData?.type;

      // 2. Gọi song song: Diễn viên (từ TMDB) và Hình ảnh (từ API riêng)
      const [castData, imageData] = await Promise.all([
        tmdbId ? getCastFromTMDB(tmdbId, movieType).catch(() => ({ cast: [] })) : null,
        getMovieImages(slug).catch(() => ({ images: [] }))
      ]);

      if (!mounted) return;

      // 3. SET HÌNH ẢNH (Giống hệt MovieDetail)
      setImages(imageData?.images || []);

      // 4. SET DIỄN VIÊN (Logic giống hệt MovieDetail)
      let finalCast = [];
      if (castData?.cast?.length > 0) {
        finalCast = castData.cast.slice(0, 15).map(p => ({
          name: p.name,
          character: p.character || "Diễn viên",
          image: p.profile_path ? `https://image.tmdb.org/t/p/w185${p.profile_path}` : USER_PLACEHOLDER
        }));
      } else if (detailData?.actor) {
        finalCast = detailData.actor.map(name => ({
          name: name,
          character: "Diễn viên",
          image: USER_PLACEHOLDER
        }));
      }
      setPeoples(finalCast);

    } catch (err) {
      console.error("Lỗi fetch trang Watch:", err);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchAllData();
  return () => { mounted = false; };
}, [slug]);
const backdropImages = images?.filter(img => img.type === 'backdrop') || [];
  const sliderSettings = {
  dots: false,
  infinite: backdropImages.length > 3,
  speed: 500,
  // Đảm bảo slidesToShow không bao giờ bằng 0
  slidesToShow: Math.max(1, Math.min(3, backdropImages.length)),
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } }
  ]
};

const castSettings = {
  dots: false,
  infinite: (peoples?.length || 0) > 5,
  speed: 500,
  slidesToShow: Math.max(1, Math.min(6, peoples?.length || 1)),
  slidesToScroll: 2,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 600, settings: { slidesToShow: 3 } }
  ]
};
  // --- 2. TÍNH TOÁN SERVER VÀ TẬP PHIM (Đặt ở ngoài useEffect để tránh lỗi null) ---
  const servers = (movie?.episodes || []).filter(
    (sv) => sv.server_data?.some((ep) => ep.link_m3u8 || ep.link_embed)
  );
  const server = servers[currentServer] || {};
  const episodes = server.server_data || [];
  const currentEpisode =
    episodes.find((ep) => ep.slug === episodeSlug && (ep.link_m3u8 || ep.link_embed)) ||
    episodes.find((ep) => ep.link_m3u8 || ep.link_embed) ||
    null;

  // --- 3. GỌI HÀM LƯU LỊCH SỬ (Đúng vị trí) ---
  useEffect(() => {
    // Chỉ lưu khi ĐÃ tải xong phim và ĐÃ tìm thấy tập phim
    if (!loading && movie && currentEpisode) {
      const historyData = {
        _id: movie._id,
        name: movie.name,
        origin_name: movie.origin_name,
        poster_url: movie.poster_url,
        slug: slug,
        episode_name: currentEpisode.name,
        episode_slug: episodeSlug || currentEpisode.slug,
      };

      // Sử dụng setTimeout để đảm bảo việc lưu không chặn tiến trình render trang
      const timer = setTimeout(() => {
        addToHistory(historyData);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, movie, currentEpisode, slug, episodeSlug]); // Chỉ chạy khi các biến này thay đổi

  // --- 4. KIỂM TRA TRẠNG THÁI LOADING/NULL ---
  if (loading) return <div className="pt-20 min-h-screen  text-white flex items-center justify-center">
                <div className="loader"></div>

      </div>
  if (!movie) return <div className="pt-20 text-center text-white">Không tìm thấy phim</div>;

  // --- 5. LOGIC PLAYER ---
  const playerUrl = currentEpisode?.link_embed || currentEpisode?.link_m3u8;

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.slug === currentEpisode?.slug);
    const nextEp = episodes[currentIndex + 1];
    if (nextEp) navigate(`/xem/${slug}/${nextEp.slug}`);
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
            className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${isFavorite(movie._id)
              ? "bg-red-500/20 hover:bg-red-900/30 border border-red-500 text-red-500"
              : "bg-white/10 hover:bg-red-900 border border-white text-white"
              }`}
          >
            <span className="text-xl">{isFavorite(movie._id) ? "" : ""}</span>
            {isFavorite(movie._id) ? "Đã thích" : "Yêu thích"}
          </button>

          <Link
            to={`/phim/${slug}`}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-red-900 border border-stalete-700"
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
                ? "bg-red-950 text-white"
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
                  ? "bg-red-800"
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


        
          {/* --- PHẦN DIỄN VIÊN --- */}
{peoples && peoples.length > 0 && (
  <section className="cast-slider mt-10">
    <h3 className="text-lg font-bold mb-6 pl-3 uppercase">Diễn viên</h3>
    <div className="px-2">
      <Slider {...castSettings}>
        {peoples.map((p, i) => (
          <div key={i} className="text-center px-2 outline-none">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-800 bg-gray-900 shadow-lg group">
              <img
                src={p.image}
                alt={p.name}
                className={`w-full h-full ${p.image.includes('glyphicons') ? 'object-contain p-4' : 'object-cover'} group-hover:scale-110 transition duration-300`}
                onError={(e) => { e.target.src = USER_PLACEHOLDER; }}
              />
            </div>
            <p className="text-[11px] font-bold line-clamp-1 text-gray-200">{p.name}</p>
            <p className="text-[9px] text-gray-500 line-clamp-1">{p.character}</p>
          </div>
        ))}
      </Slider>
    </div>
  </section>
)}

{/* --- SLIDER HÌNH ẢNH PHIM --- */}
{backdropImages.length > 0 && (
  <section className="movie-image-slider mt-12">
    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
      <span className="w-1.5 h-6 rounded-full"></span> HÌNH ẢNH PHIM
    </h3>
    <div className="px-4">
      <Slider {...sliderSettings}>
        {backdropImages.map((img, i) => (
          <div key={i} className="px-2 outline-none">
            <div className="rounded-xl overflow-hidden aspect-video border border-white/10 group bg-gray-900 shadow-lg">
              <img
                src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                alt="Scene"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </section>
)}

<Comments movieId={movie.slug} movieName={movie.name} />
<RelatedMovies currentMovie={movie} />
      </div>
    </div>
  );
}
