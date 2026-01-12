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
import.meta.env.VITE_TMDB_KEY
import Comments from '../components/common/Comments';

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
  const OPHIM_IMAGE_PROXY = "https://ophim17.cc/_next/image?url=";
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
        // 1. Gọi TMDB lấy diễn viên và Hình ảnh
        const [castData, iData] = await Promise.all([
          tmdbId ? getCastFromTMDB(tmdbId, detailData?.type).catch(() => ({ cast: [] })) : null,
          getMovieImages(slug).catch(() => ({ images: [] }))
        ]);

        if (!mounted) return;
        setImages(iData?.images || []);

        // 2. LẤY TRAILER (Sửa lỗi ở đây)
        if (tmdbId) {
          // Gọi thẳng hàm đã sửa ở api.js
          const trailerData = await getTrailerFromTMDB(tmdbId, movieType);
          if (mounted && trailerData) {
            setTrailer(trailerData.key);
            console.log("Đã tìm thấy mã YouTube:", trailerData.key);
          } else {
            console.log("TMDB không trả về video nào cho ID này.");
          }
        }

        // 3. Xử lý Diễn viên
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

  if (loading) return <div className="pt-20 text-center text-white  min-h-screen font-bold">ĐANG TẢI...</div>;
  if (!movie) return <div className="pt-20 text-center text-white  min-h-screen">KHÔNG TÌM THẤY PHIM</div>;

  const sliderSettings = {
    dots: false,
    infinite: images.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, images.filter(i => i.type === 'backdrop').length || 1),
    slidesToScroll: 1,
    arrows: true,
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
      { breakpoint: 600, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  };
  return (
    <div className="pt-20 min-h-screen text-white  pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">

        <div className="grid md:grid-cols-4 gap-10">

          {/* CỘT 1: POSTER & BUTTONS */}
          <div className="lg:col-span-1 w-full max-w-[300px] mx-auto lg:max-w-none">
            <div className="sticky top-24">
              <img src={getImageUrl(movie)} alt={movie.name} className="w-full rounded-2xl shadow-2xl border border-white/10" />

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to={`/xem/${movie.slug}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Xem ngay
                </Link>

                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 border ${isFavorite(movie._id)
                    ? "bg-red-500/20 hover:bg-red-500/30 border-red-500 text-red-500"
                    : "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                    }`}
                >
                  <span className="text-xl">{isFavorite(movie._id) ? "" : ""}</span>
                  {isFavorite(movie._id) ? "đã thích" : "Yêu thích"}
                </button>
              </div>
              {trailer && (
                <section className="mt-10 px-4 md:px-0">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-600"></span> Trailer
                  </h3>

                  {/* Card nhỏ - Mobile: Full width, Desktop: Rộng vừa phải */}
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="relative w-full md:max-w-xs aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-lg border border-white/10"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${trailer}/0.jpg`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                        <svg fill="white" viewBox="0 0 24 24" className="w-6 h-6 ml-1"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </div>


                </section>
              )}
              {/* KEYWORDS */}
              <div className="mt-8">
                <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Từ khóa</h4>
                <div className="flex flex-wrap gap-2">
                  {keywords.length > 0 ? keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded text-gray-400">
                      #{kw.name_vn || kw.name}
                    </span>
                  )) : <span className="text-gray-600 italic text-[10px]">Đang cập nhật...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 2 & 3: THÔNG TIN CHI TIẾT */}
          <div className="md:col-span-3 space-y-10">
            {/* TIÊU ĐỀ & THÔNG SỐ */}
            <section>
              <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">{movie.name}</h1>
              <p className="text-xl text-gray-500 mb-6">{movie.origin_name} ({movie.year})</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {/* Cột TMDB */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center group hover:border-blue-500/50 transition-all">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">TMDB Score</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-500 font-black text-lg">{movie.tmdb?.vote_average || "N/A"}</span>
                    <span className="text-[10px] text-gray-400 mt-1">/10</span>
                  </div>
                  <p className="text-[14px] text-gray-500 italic">{movie.tmdb?.vote_count?.toLocaleString()} votes</p>
                </div>

                {/* Cột IMDB */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center group hover:border-yellow-500/50 transition-all">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">IMDB Score</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-500 font-black text-lg">{movie.imdb?.vote_average || "N/A"}</span>
                    <span className="text-[10px] text-gray-400 mt-1">/10</span>
                  </div>
                  <p className="text-[14px] text-gray-500 italic">{movie.imdb?.vote_count?.toLocaleString()} votes</p>
                </div>

                {/* Cột Chất lượng & Ngôn ngữ */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Chất lượng</p>
                  <p className="text-white font-bold">{movie.quality}</p>
                  <p className="text-[9px] text-blue-400">{movie.lang}</p>
                </div>

                {/* Cột Quốc gia & Năm */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Thông tin</p>
                  <p className="text-white font-bold line-clamp-1">{movie.country?.[0]?.name || "N/A"}</p>
                  <p className="text-[9px] text-gray-500">{movie.year}</p>
                </div>
              </div>

              <div className="text-sm space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <p><span className="text-gray-500 font-medium">Thể loại:</span> {movie.category?.map(c => c.name).join(", ")}</p>
                <p><span className="text-gray-500 font-medium">Đạo diễn:</span> {movie.director?.join(", ") || "Đang cập nhật.."}</p>
                {movie.tmdb?.type === "tv" && (
                  <p><span className="text-gray-500 font-medium">Số mùa:</span> Season {movie.tmdb.season}</p>
                )}
              </div>
            </section>


            {/* DIỄN VIÊN */}
            <section className="cast-slider">
              <h3 className="text-lg font-bold mb-6 border-l-4 border-purple-600 pl-3 uppercase">Diễn viên</h3>
              <div className="px-4">
                <Slider {...castSettings}>
                  {peoples.map((p, i) => (
                    <div key={i} className="text-center px-2 outline-none">
                      <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-800 bg-gray-900 shadow-lg group">
                        <img
                          src={p.image}
                          alt={p.name}
                          className={`w-full h-full ${p.image.includes('glyphicons') ? 'object-contain p-4' : 'object-cover'} group-hover:scale-110 transition duration-300`}
                          onError={(e) => {
                            // Nếu ảnh TMDB lỗi, dùng avatar chữ thay thế
                            e.target.onerror = null; // Ngăn vòng lặp vô tận
                            e.target.src = USER_PLACEHOLDER;
                          }}
                        />
                      </div>
                      <p className="text-[11px] font-bold line-clamp-1 text-gray-200">{p.name}</p>
                      <p className="text-[9px] text-gray-500 line-clamp-1">{p.character || "Diễn viên"}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </section>


            {/* SLIDER HÌNH ẢNH PHIM */}
            {images.filter(img => img.type === 'backdrop').length > 0 && (
              <section className="movie-image-slider">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> HÌNH ẢNH PHIM
                </h3>
                <div className="px-4">
                  <Slider {...sliderSettings}>
                    {images.filter(img => img.type === 'backdrop').map((img, i) => (
                      <div key={i} className="px-2">
                        <div className="rounded-xl overflow-hidden aspect-video border border-white/10 group">
                          <img
                            src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            alt="Scene"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            )}

            {/* NỘI DUNG */}
            <section className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-semibold mb-4  uppercase tracking-widest">Nội dung</h3>
              <p className="text-gray-400 leading-relaxed text-justify text-lg">
                {renderCleanContent(movie.content)}
              </p>
            </section>

            <Comments movieId={movie.slug} movieName={movie.name} />

          </div>
        </div>
      </div>
      {/* Modal Popup */}
      {isModalOpen && trailer && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}


    </div>
  );
}