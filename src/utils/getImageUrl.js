// src/utils/getImageUrl.js
import noImage from "../assets/no-image.jpg";

const CDN_BASE = "https://img.ophim.live/uploads/movies/"; // Chính thức từ API OPhim 2026

export const getImageUrl = (movie) => {
  if (!movie) return noImage;

  const path = movie.poster_url || movie.thumb_url || "";
  if (!path) return noImage;

  // Một số phim có path bắt đầu bằng /, loại bỏ để tránh //
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${CDN_BASE}${cleanPath}`;
};