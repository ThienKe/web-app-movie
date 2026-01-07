// src/pages/Home.jsx
import { useState, useEffect } from "react";
import HeroSlider from "../components/hero/HeroSlider";
import MovieSection from "../components/movie/MovieSection";
import { getListMovies } from "../services/api";
import UpcomingMovieSlider from "../components/section/UpcomingMovieSlider";

export default function Home() {
  const [sections, setSections] = useState({
    moi: [],
    bo: [],
    le: [],
    rap: [],
    loading: true,
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const [moi, bo, le, rap] = await Promise.all([
          getListMovies("phim-moi-cap-nhat"),
          getListMovies("phim-bo"),
          getListMovies("phim-le"),
          getListMovies("phim-chieu-rap"),
        ]);

        setSections({
          moi: moi.slice(0, 24),
          bo: bo.slice(0, 24),
          le: le.slice(0, 24),
          rap: rap.slice(0, 24),
          loading: false,
        });
      } catch (err) {
        console.error("Lỗi fetch sections:", err);
        setSections({ loading: false });
      }
    };
    fetchSections();
  }, []);

  return (
    <>
      <title>Phim Cú Đêm - Xem phim hay online miễn phí</title>

      <HeroSlider />
        <div className="w-full px-4 md:px-6 lg:px-10 py-6">
    <UpcomingMovieSlider />
  </div>

      {sections.loading ? (
        <div className="text-center py-20 text-2xl">Đang tải danh sách phim...</div>
      ) : (
        <>
          <MovieSection title="Phim mới" movies={sections.moi} />
          <MovieSection title="Phim bộ" movies={sections.bo} />
          <MovieSection title="Phim lẻ" movies={sections.le} />
          <MovieSection title="Phim chiếu rạp" movies={sections.rap} />
        </>
      )}
    </>
  );
}