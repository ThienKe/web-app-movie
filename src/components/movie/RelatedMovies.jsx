import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";
import { getCategori } from "../../services/api";

export default function RelatedMovies({ currentMovie }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentMovie || !currentMovie.category) return;
      setLoading(true);
      try {
        const catSlug = currentMovie.category[0].slug;
        const items = await getCategori(catSlug, 1);
        if (items) {
          const filtered = items.filter(m => m.slug !== currentMovie.slug);
          setRelated(filtered.slice(0, 20));
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentMovie?.slug]);

  if (!loading && related.length === 0) return null;

  return (
    <section className="mt-16 relative z-10 w-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl md:text-2xl font-semibold flex items-center gap-3  ">
          <span className="w-2 h-8 rounded-sm "></span>
          Phim cùng thể loại
        </h3>
        <div className="h-[px] flex-1 bg-white/10 ml-6 hidden md:block"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] aspect-[2/3] rounded-2xl animate-pulse border border-white/5" />
          ))
        ) : (
          related.map((movie) => (
            <div key={movie._id} className="group">
              <Link to={`/phim/${movie.slug}`} className="block">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 shadow-xl transition-all duration-500 group-hover:border-red-500/50">
                  <img 
                    src={getImageUrl(movie)} 
                    alt={movie.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  {/* --- CÁC NHÃN THÔNG TIN (BADGES) --- */}
                  
                  {/* Góc trên trái: Chất lượng (HD/4K) */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 bg-red-600 text-[10px] font-black rounded-md text-white shadow-lg uppercase">
                      {movie.quality || "HD"}
                    </span>
                    {/* Năm sản xuất */}
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-[10px] font-bold rounded-md text-gray-200 border border-white/10 w-fit">
                      {movie.year}
                    </span>
                  </div>

                  {/* Góc dưới phải: Ngôn ngữ (Vietsub/Thuyết Minh) */}
                  <div className="absolute bottom-2 right-2">
                    <span className={`px-2 py-1 text-[9px] font-bold rounded-md uppercase border shadow-lg ${
                      movie.lang?.toLowerCase().includes('thuyết minh') 
                      ? "bg-red-600/80 border-red-500 text-white" 
                      : "bg-black/70 border-white/20 text-red-400"
                    }`}>
                      {movie.lang || "Vietsub"}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="mt-3 px-1">
                  <h4 className="text-sm font-bold line-clamp-1 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-tight">
                    {movie.name}
                  </h4>
                  {/* Hiển thị số tập hoặc trạng thái phim */}
                  <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                    <span className="truncate">{movie.origin_name}</span>
                    {movie.episode_current && (
                      <span className="text-red-500/80 font-medium whitespace-nowrap">
                         • {movie.episode_current}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}