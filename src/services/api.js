// src/services/api.js
import axios from "axios";
import.meta.env.VITE_TMDB_KEY

const api = axios.create({
  baseURL: "https://ophim1.com/v1/api", // API OPhim chính thức 2026
  timeout: 15000,
});

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
export const getHomeData = async () => {
  const response = await api.get("/home");
  return response.data.data;
};

export const getCategori = async (slug, page = 1, extraParams = {}) => {
  const response = await api.get(`/the-loai/${slug}`, {
    params: { 
      page, 
      ...extraParams 
    }
  });
  return response.data.data;
};

export const getCountry = async (slug, page = 1, extraParams = {}) => {
  const response = await api.get(`/quoc-gia/${slug}`, {
    params: { 
      page, 
      ...extraParams 
    }
  });
  return response.data.data;
};
export const getListMovies = async (slug, page = 1, extraParams = {}) => {
  const response = await api.get(`/danh-sach/${slug}`, {
    params: { 
      page, 
      ...extraParams 
    }
  });
  return response.data.data;
};

export const getMovieImages = async (slug) => {
  const response = await api.get(`/phim/${slug}/images`);
  return response.data.data; 
};
// Hàm mới: Lấy phim chiếu rạp
export const getPhimChieuRap = async (page = 1) => {
  const response = await api.get(`/danh-sach/phim-chieu-rap?page=${page}`);
  return response.data.data; 
};

export const getPhimMoi = async (page = 1) => {
  const response = await api.get(`/danh-sach/phim-moi?page=${page}`);
  return response.data.data; 
};

export const getMovieDetail = async (slug) => {
  const response = await api.get(`/phim/${slug}`);
  // Trả về thẳng .item để các component MovieDetail/Watch dùng được luôn
  return response.data.data.item; 
};


export const getCastFromTMDB = async (id, movieType = 'movie') => {
  if (!id) return null;
  
  // Kiểm tra loại phim để gọi đúng endpoint
  const type = movieType === 'series' || movieType === 'tv' ? 'tv' : 'movie';
  
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${import.meta.env.VITE_TMDB_KEY}`
    );
    return response.data;
  } catch (error) {
    // Thay vì console.error (hiện đỏ), ta dùng console.warn hoặc chỉ return null
    if (error.response && error.response.status === 404) {
      console.warn(`TMDB không có dữ liệu diễn viên cho ID: ${id}`);
    }
    return { cast: [] }; // Trả về cấu trúc mặc định để không bị lỗi .map()
  }
};

export const getTrailerFromTMDB = async (id, type = 'movie') => {
  if (!id) return null;
  
  // Đảm bảo type chỉ nhận 'movie' hoặc 'tv'
  const movieType = type === 'series' || type === 'tv' ? 'tv' : 'movie';
  
  try {
    // Thử gọi không có language trước để lấy dữ liệu gốc (tránh 404 do thiếu bản dịch)
    const response = await axios.get(
      `https://api.themoviedb.org/3/${movieType}/${id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}`
    );
    
    // Tìm video loại Trailer trên YouTube
    const trailer = response.data.results.find(
      v => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
    );

    return trailer || response.data.results[0] || null;
  } catch (error) {
    console.warn(`Không tìm thấy trailer cho ${movieType} ID: ${id}`);
    return null;
  }
};

export const getMoviePeoples = (slug) => {
  return axios.get(`/phim/${slug}/peoples`);
};



export const getMovieKeywords = async (slug) => {
  const response = await api.get(`/phim/${slug}/keywords`);
  return response.data.data; // { keywords: [...] }
};


export const searchMovies = async (keyword, page = 1) => {
  try {
    const res = await axios.get("https://ophim1.com/v1/api/tim-kiem", {
      params: {
        keyword: keyword,
        page: page
      }
    });
    console.log("Dữ liệu thực tế từ API:", res.data);

    if (res.data && res.data.data && res.data.data.items) {
      return res.data.data.items;
    }
    return [];
  } catch (error) {
    console.error("Lỗi gọi API:", error);
    return [];
  }
};

export const getListMoviesFilter = async (slug, page = 1, filters = {}) => {
  try {
    const response = await api.get(`/danh-sach/${slug}`, {
      params: {
        page: page,
        limit: 24, // Bạn có thể chỉnh limit tùy ý
        ...filters // Chứa category, country, year nếu API hỗ trợ
      }
    });
    // Trả về cả dữ liệu phim và phân trang để logic tốt hơn
    return response.data.data; 
  } catch (error) {
    console.error("Lỗi API:", error);
    return { items: [], params: { pagination: {} } };
  }
};