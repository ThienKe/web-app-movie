// src/pages/Home.jsx
import { useState, useEffect } from "react";
import HeroSlider from "../components/hero/HeroSlider";
import MovieSection from "../components/movie/MovieSection";
import { getListMovies, getCountry, getCategori } from "../services/api"; // Gom nhóm import
import UpcomingMovieSlider from "../components/section/UpcomingMovieSlider";

export default function Home() {
  const [sections, setSections] = useState({
    moi: [], bo: [], le: [], rap: [],
    hoatHinh: [], hanhDong: [], thaiLan: [], thuyetminh: [], longtieng: [],vietnam: [],
    loading: true
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const [moi, bo, le, rap, hoatHinh, hanhDong, thaiLan, thuyetminh, longtieng,vietnam] = await Promise.all([
          getListMovies("phim-moi-cap-nhat"),
          getListMovies("phim-bo"),
          getListMovies("phim-le"),
          getListMovies("phim-chieu-rap"),
          getListMovies("hoat-hinh"),
          getCategori("hanh-dong"),
          getCountry("thai-lan"),
          getListMovies("thuyet-minh"),
          getListMovies("phim-long-tieng"),
          getCountry("viet-nam"),
        ]);

        // Kiểm tra dữ liệu tồn tại trước khi slice để tránh lỗi crash
        setSections({
          moi: (moi || []).slice(0, 12),
          bo: (bo || []).slice(0, 12),
          le: (le || []).slice(0, 12),
          rap: (rap || []).slice(0, 12),
          hoatHinh: (hoatHinh || []).slice(0, 12),
          hanhDong: (hanhDong || []).slice(0, 12),
          thaiLan: (thaiLan || []).slice(0, 12),
          thuyetminh: (thuyetminh || []).slice(0, 12),
          longtieng: (longtieng || []).slice(0, 12),
          vietnam: (vietnam || []).slice(0, 12),
          loading: false,
        });
      } catch (err) {
        console.error("Lỗi fetch sections:", err);
        setSections((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchSections();
  }, []);

  return (
    <div className="bg-transparent">
      <title>Phim Cú Đêm - Xem phim hay online miễn phí</title>

      <HeroSlider />
      
      {/* Tăng padding cho thoáng đúng ý bạn */}
     <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 py-10">
      <UpcomingMovieSlider />
    </div>

    {sections.loading ? (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="loader"></div>

      </div>
    ) : (
        <div className="space-y-12 md:space-y-28 pb-20">
  {/* Section 1: Phim chiếu rạp - 6 card ngang */}
  <MovieSection 
    variant="cinema" 
    title="Phim chiếu rạp" 
    movies={sections.rap} 
    viewAllLink="/danh-sach/phim-chieu-rap" 
  />

  {/* Section 2: Phim mới - Bình thường */}
  <MovieSection 
    title="Phim mới cập nhật" 
    movies={sections.moi} 
    viewAllLink="/danh-sach/phim-moi" 
  />

  {/* Section 3: Phim bộ - Viền nổi bật, bo 4 góc sâu */}
  <MovieSection 
    variant="highlight" 
    title="Phim bộ" 
    movies={sections.bo} 
    viewAllLink="/danh-sach/phim-bo" 
  />

  {/* Section 4: Phim lẻ - Y chang section 3 */}
  <MovieSection 
    variant="rounded-full-card" 
    title="Phim lẻ" 
    movies={sections.le} 
    viewAllLink="/danh-sach/phim-le" 
  />

  {/* Section 5: Hoạt hình - Zíc zắc lên xuống */}
  <MovieSection 
    variant="zigzag" 
    title="Hoạt hình & Anime" 
    movies={sections.hoatHinh} 
    viewAllLink="/danh-sach/hoat-hinh" 
  />
  


 {/* 7, 8, 9. Các mục đóng khung cực nổi bật */}
  <MovieSection title="Phim thuyết minh" movies={sections.thuyetminh} variant="zigzag"  viewAllLink="/danh-sach/phim-thuyet-minh" />
  <MovieSection title="Điện ảnh Thái Lan" movies={sections.thaiLan} variant="frame" viewAllLink="/quoc-gia/thai-lan" />
  <MovieSection title="Hành động kịch tính" movies={sections.hanhDong}  viewAllLink="/the-loai/hanh-dong" />
    <MovieSection title="Phim lồng tiếng" movies={sections.longtieng} variant="frame" viewAllLink="/danh-sach/phim-long-tieng" />
      <MovieSection title="Phim Việt Nam" movies={sections.vietnam} variant="highlight" viewAllLink="/quoc-gia/viet-nam" />
</div>
      )}
    </div>
  );
}