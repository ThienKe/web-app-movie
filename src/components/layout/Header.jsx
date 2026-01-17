import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, History, Menu, User as UserIcon, X, LogOut, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';

const POSTER_BASE = "https://img.ophim.live/uploads/movies/";

const danhSach = [{ name: "Phim mới", slug: "phim-moi", link: "/danh-sach/phim-moi" }, { name: "Phim bộ", slug: "phim-bo", link: "/danh-sach/phim-bo" }, { name: "Phim lẻ", slug: "phim-le", link: "/danh-sach/phim-le" }, { name: "Hoạt hình", slug: "hoat-hinh", link: "/danh-sach/hoat-hinh" }, { name: "Phim Chiếu Rạp", slug: "phim-chieu-rap", link: "/danh-sach/phim-chieu-rap" }, { name: "Phim Sắp Chiếu", slug: "phim-sap-chieu", link: "/danh-sach/phim-sap-chieu" }, { name: "Phim Đang Chiếu", slug: "phim-dang-chieu", link: "/danh-sach/phim-dang-chieu" }, { name: "Phim Hot", slug: "phim-hot", link: "/danh-sach/phim-hot" }, { name: "Phim Thuyết Minh", slug: "phim-thuyet-minh", link: "/danh-sach/phim-hot" }, { name: "Phim lồng tiếng", slug: "phim-long-tieng", link: "/danh-sach/phim-long-tieng" }];
const theLoai = [{ name: "Hành Động", slug: "hanh-dong" }, { name: "Cổ Trang", slug: "co-trang" }, { name: "Kinh Dị", slug: "kinh-di" }, { name: "Tình Cảm", slug: "tinh-cam" }, { name: "Hài Hước", slug: "hai-huoc" }, { name: "Viễn Tưởng", slug: "vien-tuong" }, { name: "Hoạt Hình", slug: "hoat-hinh" }, { name: "Phiêu Lưu", slug: "phieu-luu" }, { name: "Tâm Lý", slug: "tam-ly" }, { name: "Chiến Tranh", slug: "chien-tranh" }, { name: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong" }, { name: "Thần Thoại", slug: "than-thoai" }, { name: "Hình Sự", slug: "hinh-su" }, { name: "Lịch Sử", slug: "lich-su" }, { name: "Âm Nhạc", slug: "am-nhac" }, { name: "Tài Liệu", slug: "tai-lieu" }, { name: "Thể Thao", slug: "the-thao" }, { name: "Phim 18+", slug: "phim-18" }, { name: "Phim 13+", slug: "phim-13" }];
const quocGia = [{ name: "Hàn Quốc", slug: "han-quoc" }, { name: "Trung Quốc", slug: "trung-quoc" }, { name: "Âu Mỹ", slug: "au-my" }, { name: "Việt Nam", slug: "viet-nam" }, { name: "Nhật Bản", slug: "nhat-ban" }, { name: "Thái Lan", slug: "thai-lan" }, { name: "Ấn Độ", slug: "an-do" }, { name: "Pháp", slug: "phap" }, { name: "Đài Loan", slug: "dai-loan" }, { name: "Hồng Kông", slug: "hong-kong" }, { name: "Anh", slug: "anh" }, { name: "Đức", slug: "duc" }, { name: "Nga", slug: "nga" }, { name: "Úc", slug: "uc" }, { name: "Indonesia", slug: "indonesia" }];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { user: currentUser, logout: performLogout } = useAuthContext();

  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // 1. Nếu đang ở sát top (dưới 50px), luôn hiện và luôn trong suốt
    if (currentScrollY < 50) {
      setVisible(true);
      setScrolled(false);
      setLastScrollY(currentScrollY);
      return;
    }

    // 2. Nếu đang mở Menu/Search thì giữ nguyên trạng thái
    if (mobileMenuOpen || mobileSearchOpen) {
      setVisible(true);
      return;
    }

    // 3. Logic Ẩn/Hiện dựa trên hướng cuộn
    if (currentScrollY > lastScrollY) {
      // ĐANG CUỘN XUỐNG: Ẩn hoàn toàn
      setVisible(false);
    } else {
      // ĐANG CUỘN LÊN: Hiện lại và lúc này mới bật màu nền (scrolled)
      setVisible(true);
      setScrolled(true);
    }
    setSearchFocused(false);
    setLastScrollY(currentScrollY);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [lastScrollY, mobileMenuOpen, mobileSearchOpen]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Thêm tham số limit nếu API hỗ trợ, nếu không ta sẽ slice ở frontend
        const response = await axios.get(`https://ophim1.com/v1/api/tim-kiem`, {
          params: { keyword: searchTerm.trim() }
        });

        // KIỂM TRA CẤU TRÚC DATA: 
        // API v1 thường trả về response.data.data.items
        const items = response.data?.data?.items || response.data?.items || [];
        setSuggestions(items.slice(0, 5));
      } catch (error) {
        console.error("Lỗi API tìm kiếm:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSearch, 400); // Tăng debounce lên 400ms để ổn định
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/tim-kiem?keyword=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
    setSearchFocused(false);
    setMobileSearchOpen(false);
    setSuggestions([]);
  };

  const handleLogout = async () => {
    try {
      await performLogout();
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };
  const SuggestionBox = ({ isMobile = false }) => {
    // Điều kiện hiển thị: Phải đang focus HOẶC đang ở mobile, và có chữ trong ô search
    if (!searchTerm.trim() || (!searchFocused && !isMobile)) return null;

    return (
      <div className={`
      ${isMobile ? 'w-full mt-2' : 'absolute top-full left-0 mt-2 w-100'} 
      bg-slate-900 border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
      z-999 overflow-hidden
    `}>
        {isLoading ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            <div className="animate-pulse">Đang tìm kiếm phim...</div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="flex flex-col">
            {suggestions.map((phim) => (
              <Link
                key={phim.slug}
                to={`/phim/${phim.slug}`}
                onMouseDown={(e) => e.preventDefault()} // Quan trọng: Ngăn blur làm mất link trước khi kịp click
                onClick={() => {
                  setSearchTerm('');
                  setSearchFocused(false);
                  setMobileSearchOpen(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-700  border-b border-white/5 transition-colors group"
              >
                <img
                  src={`${POSTER_BASE}${phim.thumb_url}`}
                  alt=""
                  className="w-12 h-16 object-cover rounded bg-slate-800"
                  onError={(e) => e.target.src = '/logo.webp'} // Backup ảnh lỗi
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-bold truncate group-hover:text-gray-500 transition-colors">
                    {phim.name}
                  </h4>
                  <p className="text-gray-400 text-xs truncate italic">{phim.origin_name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-slate-800 text-gray-300 px-1 rounded">{phim.year}</span>
                  </div>
                </div>
              </Link>
            ))}

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSearch}
              className="p-3 text-center text-sm font-semibold text-white bg-slate-900 hover:bg-gray-700 transition-colors"
            >
              Xem toàn bộ kết quả cho "{searchTerm}"
            </button>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            Không tìm thấy phim nào...
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {(mobileMenuOpen || mobileSearchOpen) && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45"
          onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
        />
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-4 md:px-8 lg:px-12 flex items-center justify-between
  ${scrolled && visible ? 'bg-slate-800/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'}
  ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} 
`}>

        {/* LOGO */}
        <div className="flex items-center justify-center lg:justify-start w-1/3 lg:w-auto">
          <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
            <img
              src="/logo.webp"
              alt="Phim Cú Đêm"
              className="h-9 w-auto md:h-12 lg:h-14 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
            <span className="text-xl md:text-2xl font-black tracking-tighter bg-linear-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent hidden sm:block">
              PHIM<span className="text-red-600">CÚ</span>ĐÊM
            </span>
          </Link>
        </div>

        {/* CENTER: DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/danh-sach/phim-bo" className="text-white hover:text-red-500 transition font-medium">Phim bộ</Link>
          <Link to="/danh-sach/phim-le" className="text-white hover:text-red-500 transition font-medium">Phim lẻ</Link>
          <Dropdown title="Danh sách" items={danhSach} type="danh-sach" />
          <Dropdown title="Thể loại" items={theLoai} type="the-loai" />
          <Dropdown title="Quốc gia" items={quocGia} type="quoc-gia" />
        </nav>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block relative">
            <form onSubmit={handleSearch} className="relative z-10">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Tìm kiếm phim..."
                className="bg-white/10 rounded-full px-5 py-2 w-48 lg:w-64 text-white focus:ring-1 focus:ring-slate-500 outline-none transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
            <SuggestionBox isMobile={false} />
          </div>

          <Link to="/yeu-thich" className="hidden md:block text-white p-2 hover:bg-red-500 rounded-full"><Heart className="w-5 h-5" /></Link>
          <Link to="/lich-su" className="hidden md:block text-white p-2 hover:bg-red-500 rounded-full transition relative group">
            <History className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">Lịch sử</span>
          </Link>

          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden p-2 text-white">
            <Search className="w-6 h-6" />
          </button>

          {/* User Section Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                  {currentUser.displayName?.charAt(0) || <UserIcon size={14} />}
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition" title="Đăng xuất"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <Link to="/dang-nhap" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold text-sm">Đăng nhập</Link>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white">
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* MOBILE SEARCH */}
        {mobileSearchOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 p-4 border-t border-slate-800 animate-in slide-in-from-top z-60">
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên phim..."
                className="w-full bg-slate-800 text-white px-5 py-3 rounded-xl outline-none border border-red-500/30"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-white" />
              </button>
            </form>
            <SuggestionBox isMobile={true} />
          </div>
        )}

        {/* MOBILE MENU - ĐÃ FIX LẠI LOGOUT & THÊM LỊCH SỬ */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 flex flex-col border-t border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh]">

            {/* Header thông tin User trên Mobile */}
            {currentUser && (
              <div className="p-6 bg-slate-800/50 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase">
                    {currentUser.displayName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{currentUser.displayName || "Thành viên"}</p>
                    <p className="text-xs text-gray-400">{currentUser.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 flex flex-col gap-2">
              <DropdownMobile title="Danh sách" items={danhSach} type="danh-sach" closeMenu={() => setMobileMenuOpen(false)} />
              <DropdownMobile title="Thể loại" items={theLoai} type="the-loai" closeMenu={() => setMobileMenuOpen(false)} />
              <DropdownMobile title="Quốc gia" items={quocGia} type="quoc-gia" closeMenu={() => setMobileMenuOpen(false)} />

              <div className="mt-4 flex flex-col gap-1">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white py-3 px-2 flex items-center gap-3 hover:bg-white/5 rounded-lg transition">
                  Trang chủ
                </Link>
                <Link to="/yeu-thich" onClick={() => setMobileMenuOpen(false)} className="text-white py-3 px-2 flex items-center gap-3 hover:bg-white/5 rounded-lg transition">
                  Phim yêu thích
                </Link>

                {/* Nút Lịch sử cho Mobile */}
                <Link to="/lich-su" onClick={() => setMobileMenuOpen(false)} className="text-white py-3 px-2 flex items-center gap-3 hover:bg-white/5 rounded-lg transition">
                  Lịch sử xem phim
                </Link>

                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="text-red-500 py-3 px-2 flex items-center gap-3 hover:bg-red-500/10 rounded-lg transition mt-2 font-bold"
                  >
                    <LogOut size={20} /> Đăng xuất tài khoản
                  </button>
                ) : (
                  <Link to="/dang-nhap" onClick={() => setMobileMenuOpen(false)} className="bg-red-600 text-white text-center py-3 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition">
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

// ... Dropdown và DropdownMobile giữ nguyên logic ...
function Dropdown({ title, items, type }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-white hover:text-red-500 transition font-medium flex items-center gap-1 py-2">
        {title} <span className="text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2 w-125 z-50">
          <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 grid grid-cols-3 gap-1 shadow-2xl">
            {items.map(item => (
              <Link key={item.slug} to={`/${type}/${item.slug}`} className="text-gray-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownMobile({ title, items, type, closeMenu }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full text-left text-white py-4 flex justify-between font-medium">
        {title} <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 pb-4 px-2 animate-in fade-in slide-in-from-left-2 duration-200">
          {items.map(item => (
            <Link key={item.slug} to={`/${type}/${item.slug}`} onClick={closeMenu} className="text-gray-400 text-sm py-2 hover:text-white">
              • {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;