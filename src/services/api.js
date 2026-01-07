// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://ophim1.com/v1/api", // API OPhim chính thức 2026
  timeout: 15000,
});

export const getHomeData = async () => {
  const response = await api.get("/home");
  return response.data.data;
};

export const getCategori = async (slug, page = 1) => {
  const response = await api.get(`/the-loai/${slug}?page=${page}`);
  return response.data.data.items || [];
};

export const getCountry = async (slug, page = 1) => {
  const response = await api.get(`/quoc-gia/${slug}?page=${page}`);
  return response.data.data.items || [];
};
export const getListMovies = async (slug, page = 1) => {
  const response = await api.get(`/danh-sach/${slug}?page=${page}`);
  return response.data.data.items || [];
};

export const getMovieImages = async (slug) => {
  const response = await api.get(`/phim/${slug}/images`);
  return response.data.data; // Trả về { posters: [...], backdrops: [...] }
};
// Hàm mới: Lấy phim chiếu rạp
export const getPhimChieuRap = async (page = 1) => {
  const response = await api.get(`/danh-sach/phim-chieu-rap?page=${page}`);
  return response.data.data; // Trả về { items: [...], pagination: ... }
};

export const getMovieDetail = async (slug) => {
  const response = await api.get(`/phim/${slug}`);
  if (response.data.status === "success") {
    return response.data.data.item; // Đúng: phim chi tiết ở data.item
  }
  throw new Error("Phim không tồn tại");
};


export const getMoviePeoples = (slug) => {
  return axios.get(`/v1/api/phim/${slug}/peoples`);
};


// Thêm hàm lấy từ khóa phim từ TMDB
export const getMovieKeywords = async (slug) => {
  const response = await api.get(`/phim/${slug}/keywords`);
  return response.data.data; // { keywords: [...] }
};


export const searchMovies = async (keyword, page = 1) => {
  const res = await axios.get("/tim-kiem", {
    params: {
      keyword,
      page
    }
  });

  // API ophim trả items ở đây
  return res.data?.data?.items ||  [];
};
