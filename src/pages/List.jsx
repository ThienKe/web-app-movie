import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import MovieCard from "../components/movie/MovieCard";
import { getCountry, getListMovies, getCategori } from "../services/api";
import ExtraMovieSlider from "../components/section/ExtraMovieSlider.jsx";
import UpcomingMovieSlider from "../components/section/UpcomingMovieSlider";
import MovieCardSkeleton from "../components/movie/MovieCardSkeleton";
import { toTitleCase } from "../utils/formatTitle";
import MovieFilter from "../components/section/MovieFilter";
import PageMeta from "../components/PageMeta";


const FILTER_DATA = {
  categories: [
    { name: "Hành Động", slug: "hanh-dong" },
     { name: "Cổ Trang", slug: "co-trang" }, 
     { name: "Kinh Dị", slug: "kinh-di" },
      { name: "Tình Cảm", slug: "tinh-cam" }, 
      { name: "Hài Hước", slug: "hai-huoc" }, 
      { name: "Viễn Tưởng", slug: "vien-tuong" }, 
      { name: "Hoạt Hình", slug: "hoat-hinh" }, 
      { name: "Phiêu Lưu", slug: "phieu-luu" },
       { name: "Tâm Lý", slug: "tam-ly" }, 
       { name: "Chiến Tranh", slug: "chien-tranh" },
        { name: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong" }, 
        { name: "Thần Thoại", slug: "than-thoai" }, 
        { name: "Hình Sự", slug: "hinh-su" },
         { name: "Lịch Sử", slug: "lich-su" }, 
         { name: "Âm Nhạc", slug: "am-nhac" },
          { name: "Tài Liệu", slug: "tai-lieu" }, 
          { name: "Thể Thao", slug: "the-thao" }, 
          { name: "Phim 18+", slug: "phim-18" },
  ],
  countries: [
    { name: "Hàn Quốc", slug: "han-quoc" }, 
    { name: "Trung Quốc", slug: "trung-quoc" }, 
    { name: "Âu Mỹ", slug: "au-my" }, 
    { name: "Việt Nam", slug: "viet-nam" }, 
    { name: "Nhật Bản", slug: "nhat-ban" },
     { name: "Thái Lan", slug: "thai-lan" }, 
     { name: "Ấn Độ", slug: "an-do" }, 
    { name: "Pháp", slug: "phap" }, 
    { name: "Đài Loan", slug: "dai-loan" },
     { name: "Hồng Kông", slug: "hong-kong" }, 
     { name: "Anh", slug: "anh" },
      {name : "Indonesia", slug : "indonesia"},
      {name : "Malaysia", slug : "malaysia"},
      { name: "Đức", slug: "duc" }, 
      { name: "Phần Lan", slug: "phan-lan" }, 
      { name: "Nga", slug: "nga" }, 
    { name: "Úc", slug: "uc" }

  ],
  years: Array.from({ length: 26 }, (_, i) => 2026 - i)
};
export default function List() {
  const { slug } = useParams();
  const location = useLocation();
  const type = location.pathname.split("/")[1];

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Lấy params từ URL để lọc kép
  const queryParams = new URLSearchParams(location.search);
const countryFilter = queryParams.get("country"); // Đổi từ quoc-gia -> country
const yearFilter = queryParams.get("year");
useEffect(() => {
  if (slug === 'phim-moi') {
    document.title = "Phim mới nhất - CuDem Movie";
  } else {
    // Logic cho các slug khác (phim-le, phim-bo...)
    document.title = slug.replace(/-/g, ' ') + " - CuDem Movie";
  }
}, [slug]);
  /* ===== RESET KHI ĐỔI ROUTE CHÍNH ===== */
  /* ===== FETCH & FILTER LOGIC ===== */
useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let responseData;
      
      // 1. Lấy dữ liệu gốc từ API theo URL (Slug chính)
      if (type === "danh-sach") {
        responseData = await getListMovies(slug, page);
      } else if (type === "the-loai") {
        responseData = await getCategori(slug, page);
      } else if (type === "quoc-gia") {
        responseData = await getCountry(slug, page);
      }

      // API v1 trả về mảng items trực tiếp từ các hàm service bạn đã viết
      const items = Array.isArray(responseData) ? responseData : (responseData?.items || []);

      // 2. LOGIC LỌC PHỤ (Client-side filtering)
      // Lúc này ta lọc dựa trên các tham số phụ trên URL (?country=...&year=...&category=...)
      let filtered = [...items];

      // Lọc theo Quốc gia (Nếu đang không ở trang quoc-gia)
      if (countryFilter && type !== "quoc-gia") {
        filtered = filtered.filter(m => 
          Array.isArray(m.country) 
            ? m.country.some(c => c.slug === countryFilter)
            : m.country?.slug === countryFilter || m.country === countryFilter
        );
      }

      // Lọc theo Năm
      if (yearFilter) {
        filtered = filtered.filter(m => m.year?.toString() === yearFilter);
      }

      // Lọc theo Thể loại (Nếu đang không ở trang the-loai)
      // Lưu ý: Bạn cần lấy thêm categoryFilter từ URLSearchParams
      const categoryFilter = queryParams.get("category");
      if (categoryFilter && type !== "the-loai") {
        filtered = filtered.filter(m => 
          m.category?.some(cat => cat.slug === categoryFilter)
        );
      }

      setMovies(filtered);
      
      // Kiểm tra còn phim hay không dựa trên số lượng items gốc của API
      setHasMore(items.length >= 20); 

    } catch (err) {
      console.error("Lỗi Fetch:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, [slug, type, page, location.search]);
  return (
    <div className="pt-24 min-h-screen text-white">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 py-10">
        
        <h1 className="text-2xl md:text-3xl font-semibold mb-10 pl-4 ">
          {toTitleCase(type.replace(/-/g, ' '))}: {toTitleCase(slug.replace(/-/g, ' '))}
        </h1>

        {/* Component lọc riêng */}
        <MovieFilter 
  categories={FILTER_DATA.categories} 
  countries={FILTER_DATA.countries} 
  years={FILTER_DATA.years} 
/>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 md:gap-6">
            {Array.from({ length: 16 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 md:gap-6">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie._id || movie.slug} className="w-full max-w-[190px] mx-auto">
                  <MovieCard movie={movie} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Không tìm thấy phim phù hợp với bộ lọc này.
              </div>
            )}
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        <div className="mt-12 flex justify-end items-center space-x-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Trước
          </button>

          <span className="bg-white/10 px-5 py-3 rounded-xl">
            Trang {page}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            Sau
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}