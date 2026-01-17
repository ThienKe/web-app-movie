import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useFavorites } from "../hooks/useFavorites";
import {
  getMovieDetail,
  getMoviePeoples,
  getMovieImages,
  getMovieKeywords,
  getCastFromTMDB,
  getTrailerFromTMDB
} from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import noImage from "../assets/no-image.jpg";
import Comments from '../components/common/Comments';
import RelatedMovies from '../components/movie/RelatedMovies';
import SEO from '../components/SEO';
const Slider = ReactSlider.default ? ReactSlider.default : ReactSlider;
const USER_PLACEHOLDER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe357375ec6d53937133c9099a1f51.svg";

export default function MovieDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { slug } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [images, setImages] = useState([]);
  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w185";
 
  useEffect(() => {
    let mounted = true;
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const detailData = await getMovieDetail(slug);
        if (!mounted) return;
        setMovie(detailData);

        const tmdbId = detailData?.tmdb?.id;
        const movieType = detailData?.type;

        const [castData, iData] = await Promise.all([
          tmdbId ? getCastFromTMDB(tmdbId, detailData?.type).catch(() => ({ cast: [] })) : null,
          getMovieImages(slug).catch(() => ({ images: [] }))
        ]);

        if (!mounted) return;
        setImages(iData?.images || []);

        if (tmdbId) {
          const trailerData = await getTrailerFromTMDB(tmdbId, movieType);
          if (mounted && trailerData) {
            setTrailer(trailerData.key);
          }
        }

        let finalCast = [];
        if (castData?.cast?.length > 0) {
          finalCast = castData.cast.slice(0, 15).map(p => ({
            name: p.name,
            character: p.character || "Diễn viên",
            image: p.profile_path ? `${TMDB_BASE_URL}${p.profile_path}` : USER_PLACEHOLDER
          }));
        } else if (detailData?.actor) {
          finalCast = detailData.actor.map(name => ({
            name: name,
            character: "Diễn viên",
            image: USER_PLACEHOLDER
          }));
        }
        if (mounted) setPeoples(finalCast);

      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => { mounted = false; };
  }, [slug]);

  const renderCleanContent = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (loading) return <div className="h-[50vh] flex flex-col items-center justify-center w-full">
              <div className="loader mb-4"></div>
              <p className="text-white animate-pulse text-sm font-medium">Đang tải thông tin phim...</p>
      </div>
  if (!movie) return (
  <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-white bg-black">
    <div className="text-red-600 mb-4 opacity-20">
       <X size={80} />
    </div>
    <h2 className="text-2xl font-bold mb-2">KHÔNG TÌM THẤY PHIM</h2>
    <p className="text-gray-400 mb-6 text-center px-4">Có vẻ đường dẫn đã bị lỗi hoặc phim đã bị gỡ bỏ.</p>
    <Link to="/" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full transition">Trở về trang chủ</Link>
  </div>
);

  const sliderSettings = {
    dots: false,
    infinite: images.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  const castSettings = {
    dots: false,
    infinite: peoples.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } }
    ]
  };

  return (
     <>
        <SEO 
          title={`${movie.name} (${movie.year})`} 
          description={movie.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
          movie={movie} 
        />
    <div className="pt-16 md:pt-24 min-h-screen text-white pb-10 ">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Container chính: Grid 1 cột trên mobile, 4 cột trên Desktop (1 trái - 3 phải) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* CỘT 1: POSTER & NÚT BẤM */}
          <div className="w-full flex flex-col items-center lg:items-start">
            <div className="lg:sticky lg:top-24 w-full max-w-65 md:max-w-75 lg:max-w-none">
              <img 
                src={getImageUrl(movie)} 
                alt={movie.name} 
                className="w-full rounded-2xl shadow-2xl border border-white/10 mx-auto" 
              />

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to={`/xem/${movie.slug}`}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Xem ngay
                </Link>

                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 border ${
                    isFavorite(movie._id)
                    ? "bg-red-500/20 border-red-500 text-red-500"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {isFavorite(movie._id) ? "❤️ Đã thích" : "🤍 Yêu thích"}
                </button>
              </div>

              {/* Trailer Desktop: Chỉ hiện ở cột trái khi màn hình lớn */}
              {trailer && (
                <div className="hidden lg:block mt-8">
                  <h3 className="text-xs font-bold mb-3 uppercase tracking-widest text-gray-500">Trailer phim</h3>
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-white/10"
                  >
                    <img src={`https://img.youtube.com/vi/${trailer}/0.jpg`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Trailer" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                       <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-xl"><svg fill="white" viewBox="0 0 24 24" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z" /></svg></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT 2-3-4: THÔNG TIN CHI TIẾT */}
          <div className="lg:col-span-3 space-y-8 md:space-y-12">
            
            {/* TIÊU ĐỀ & NĂM */}
            <section className="text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 uppercase leading-tight tracking-tight">
                {movie.name}
              </h1>
              <p className="text-lg md:text-2xl text-gray-500">
                {movie.origin_name} ({movie.year})
              </p>

              {/* BẢNG THÔNG SỐ (Grid nhỏ) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8">
                <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5 text-center lg:text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">TMDB</p>
                  <p className="text-yellow-500 font-black text-lg md:text-xl">{movie.tmdb?.vote_average || "N/A"}</p>
                </div>
                <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5 text-center lg:text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">IMDB</p>
                  <p className="text-yellow-500 font-black text-lg md:text-xl">{movie.imdb?.vote_average || "N/A"}</p>
                </div>
                <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5 text-center lg:text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Chất lượng</p>
                  <p className="text-white font-bold">{movie.quality}</p>
                </div>
                <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5 text-center lg:text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Quốc gia</p>
                  <p className="text-white font-bold line-clamp-1">{movie.country?.[0]?.name || "N/A"}</p>
                </div>
              </div>

              {/* THÔNG TIN PHỤ */}
              <div className="mt-8 space-y-3 text-sm md:text-base border-t border-white/5 pt-6 text-left">
                <p className="flex flex-col md:flex-row md:gap-4"><span className="text-gray-500 font-bold md:w-24">Thể loại:</span> <span className="text-gray-300">{movie.category?.map(c => c.name).join(", ")}</span></p>
                <p className="flex flex-col md:flex-row md:gap-4"><span className="text-gray-500 font-bold md:w-24">Đạo diễn:</span> <span className="text-gray-300">{movie.director?.join(", ") || "Đang cập nhật.."}</span></p>
              </div>
            </section>

            {/* TRAILER MOBILE (Chỉ hiện khi màn hình nhỏ) */}
            {trailer && (
              <section className="lg:hidden">
                <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">TRAILER</h3>
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/10"
                >
                  <img src={`https://img.youtube.com/vi/${trailer}/0.jpg`} className="w-full h-full object-cover" alt="Trailer" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                     <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl"><svg fill="white" viewBox="0 0 24 24" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg></div>
                  </div>
                </div>
              </section>
            )}

            {/* DIỄN VIÊN */}
            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6  rounded-full"></span> DIỄN VIÊN
              </h3>
              <div className="px-1">
                <Slider {...castSettings}>
                  {peoples.map((p, i) => (
                    <div key={i} className="text-center px-1 outline-none">
                      <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-800 bg-gray-900 shadow-lg">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover hover:scale-110 transition duration-300"
                          onError={(e) => { e.target.src = USER_PLACEHOLDER; }}
                        />
                      </div>
                      <p className="text-[11px] md:text-sm font-bold line-clamp-1">{p.name}</p>
                      <p className="text-[9px] md:text-[11px] text-gray-500 line-clamp-1">{p.character}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </section>

            {/* NỘI DUNG */}
            <section className="bg-white/2 p-6 md:p-10 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-white">Nội dung phim</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-lg text-justify whitespace-pre-line font-light italic">
                {renderCleanContent(movie.content)}
              </p>
            </section>

            {/* KEYWORDS */}
            <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded text-gray-500 italic">
                    #{kw.name_vn || kw.name}
                  </span>
                ))}
            </div>
               
            <Comments movieId={movie.slug} movieName={movie.name} />
                 <RelatedMovies currentMovie={movie} />
          </div>
        </div>
      </div>

      {/* Modal Trailer */}
      {isModalOpen && trailer && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2 md:p-10 bg-black/95 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-red-600 text-white p-2 rounded-full hover:scale-110 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
    </>
  );
}