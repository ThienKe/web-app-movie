import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import MovieCard from "../components/movie/MovieCard";
import MovieCardSkeleton from "../components/movie/MovieCardSkeleton";
import MovieFilter from "../components/section/MovieFilter";
import SEO from "../components/SEO";
import { getCountry, getListMovies, getCategori } from "../services/api";
import { getVnName } from "../utils/vnMap.js";

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
    { name: "Indonesia", slug: "indonesia" },
    { name: "Malaysia", slug: "malaysia" },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const type = location.pathname.split("/")[1];

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get("page")) || 1;
  const countryFilter = searchParams.get("country");
  const yearFilter = searchParams.get("year");
  const categoryFilter = searchParams.get("category");

  const displayTitle = useMemo(() => {
    return slug === 'tat-ca' ? getVnName(type) : getVnName(slug);
  }, [slug, type]);

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  useEffect(() => {
    const fetchMovies = async () => {
  setLoading(true);
  try {
    // Chỉ thêm vào object nếu filter đó có giá trị
    const apiFilters = {};
    if (countryFilter) apiFilters.country = countryFilter;
    if (yearFilter) apiFilters.year = yearFilter;
    if (categoryFilter) apiFilters.category = categoryFilter;

    let responseData;
    // Bây giờ các hàm này đã nhận apiFilters ở tham số thứ 3
    if (type === "danh-sach") {
      responseData = await getListMovies(slug, page, apiFilters);
    } else if (type === "the-loai") {
      responseData = await getCategori(slug, page, apiFilters);
    } else if (type === "quoc-gia") {
      responseData = await getCountry(slug, page, apiFilters);
    }
        const items = responseData?.items || [];
        const pagination = responseData?.params?.pagination;
        
        // Tính toán phân trang chính xác
        const totalItems = Number(pagination?.totalItems) || 0;
        const itemsPerPage = Number(pagination?.totalItemsPerPage) || 24;
        const calculatedTotal = Math.ceil(totalItems / itemsPerPage) || 1;

        setTotalPages(calculatedTotal);
        setHasMore(page < calculatedTotal);
        setMovies(items);
        
      } catch (err) {
        console.error("Lỗi:", err);
        setMovies([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [slug, type, page, countryFilter, yearFilter, categoryFilter]);

  return (
    <>
      <SEO title={`Danh sách phim ${displayTitle}`} />
      <div className="pt-24 min-h-screen text-white px-4 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
      
      {/* Container Tiêu đề & Bộ lọc: Thêm mb-12 để tạo khoảng cách với các card phim bên dưới */}
      <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl flex items-baseline gap-2">
            <span className="text-gray-400 font-normal text-xl md:text-2xl">Danh sách:</span>
            <span className="font-semibold text-white tracking-wider">
              {displayTitle}
            </span>
          </h1>

          {/* Nút bộ lọc nằm ngay cạnh Title */}
          <MovieFilter
            countries={FILTER_DATA.countries}
            years={FILTER_DATA.years}
            categories={FILTER_DATA.categories}
          />
        </div>
        
        {/* Có thể thêm hiển thị tổng số phim hoặc breadcrumb nhỏ ở đây nếu muốn */}
        <div className="hidden sm:block text-xs text-gray-500 italic">
          Tổng cộng: {totalPages * 24}+ phim
        </div>
      </div>

        {loading ? (
          // Grid 8 cột cho Skeleton giống SearchPage
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Grid 8 cột cho Movie Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <MovieCard key={movie._id || movie.slug} movie={movie} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500 italic">
                  Không tìm thấy phim phù hợp với bộ lọc này.
                </div>
              )}
            </div>

            {/* ===== PAGINATION BOX (Sát lề phải) ===== */}
            {movies.length > 0 && (
              <div className="mt-16 flex justify-end items-center gap-4 pb-20 border-t border-white/5 pt-10">
                <div className="text-sm font-medium">
                  <span className="text-gray-500">Trang</span>{" "}
                  <span className="text-white">{page}</span>{" "}
                  <span className="text-gray-600">/</span>{" "}
                  <span className="text-gray-400">{totalPages.toLocaleString()}</span>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-2xl">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-white/10 text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Trước
                  </button>

                  <div className="w-[1px] h-8 bg-white/10 self-center"></div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasMore || loading}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold"
                  >
                    Sau
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}