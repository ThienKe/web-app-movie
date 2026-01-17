export const VN_MAP = {
  // Danh mục chính (danhSach)
  "phim-moi": "Phim Mới",
  "phim-bo": "Phim Bộ",
  "phim-le": "Phim Lẻ",
  "hoat-hinh": "Hoạt Hình",
  "phim-chieu-rap": "Phim Chiếu Rạp",
  "phim-sap-chieu": "Phim Sắp Chiếu",
  "phim-dang-chieu": "Phim Đang Chiếu",
  "phim-hot": "Phim Hot",
  "phim-thuyet-minh": "Phim Thuyết Minh",
  "phim-long-tieng": "Phim Lồng Tiếng",

  // Thể loại (theLoai)
  "hanh-dong": "Hành Động",
  "co-trang": "Cổ Trang",
  "kinh-di": "Kinh Dị",
  "tinh-cam": "Tình Cảm",
  "hai-huoc": "Hài Hước",
  "vien-tuong": "Viễn Tưởng",
  "phieu-luu": "Phiêu Lưu",
  "tam-ly": "Tâm Lý",
  "chien-tranh": "Chiến Tranh",
  "khoa-hoc-vien-tuong": "Khoa Học Viễn Tưởng",
  "than-thoai": "Thần Thoại",
  "hinh-su": "Hình Sự",
  "lich-su": "Lịch Sử",
  "am-nhac": "Âm Nhạc",
  "tai-lieu": "Tài Liệu",
  "the-thao": "Thể Thao",
  "phim-18": "Phim 18+",
  "phim-13": "Phim 13+",

  // Quốc gia (quocGia)
  "han-quoc": "Hàn Quốc",
  "trung-quoc": "Trung Quốc",
  "au-my": "Âu Mỹ",
  "viet-nam": "Việt Nam",
  "nhat-ban": "Nhật Bản",
  "thai-lan": "Thái Lan",
  "an-do": "Ấn Độ",
  "phap": "Pháp",
  "dai-loan": "Đài Loan",
  "hong-kong": "Hồng Kông",
  "anh": "Anh",
  "duc": "Đức",
  "nga": "Nga",
  "uc": "Úc",
  "indonesia": "Indonesia",

  // Mặc định cho trường hợp lọc tất cả
  "tat-ca": ""
};

/**
 * Hàm lấy tên tiếng Việt từ slug. 
 * Nếu không có trong từ điển sẽ tự động format (vi-du -> VI DU)
 */
export const getVnName = (key) => {
  if (!key) return "";
  return VN_MAP[key] || key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};