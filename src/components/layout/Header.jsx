import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, History, Menu, User, X } from 'lucide-react';
import axios from 'axios';

const POSTER_BASE = "https://img.ophim.live/uploads/movies/";

// ===== MENU ITEMS =====
const danhSach = [
  { name: "Phim mới", slug: "phim-moi", link: "/danh-sach/phim-moi" },
  { name: "Phim bộ", slug: "phim-bo", link: "/danh-sach/phim-bo" },
  { name: "Phim lẻ", slug: "phim-le", link: "/danh-sach/phim-le" },
  { name: "Hoạt hình", slug: "hoat-hinh", link: "/danh-sach/hoat-hinh" },
  { name: "Phim Chiếu Rạp", slug: "phim-chieu-rap", link: "/danh-sach/phim-chieu-rap" },
  { name: "Phim Sắp Chiếu", slug: "phim-sap-chieu", link: "/danh-sach/phim-sap-chieu" },
  { name: "Phim Đang Chiếu", slug: "phim-dang-chieu", link: "/danh-sach/phim-dang-chieu" },
  { name: "Phim Hot", slug: "phim-hot", link: "/danh-sach/phim-hot" },
];

const theLoai = [
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
  { name: "Phim 13+", slug: "phim-13" },
];

const quocGia = [
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
  { name: "Mỹ", slug: "my" },
  { name: "Đức", slug: "duc" },
  { name: "Phần Lan", slug: "phan-lan" },
  { name: "Nga", slug: "nga" },
  { name: "Úc", slug: "uc" },
];

const Header = ({ user, logout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  /* ===== SEARCH HANDLER ===== */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/tim-kiem?keyword=${encodeURIComponent(searchTerm.trim())}`);
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  /* ===== SEARCH SUGGESTION ===== */
  useEffect(() => {
    if (!searchTerm.trim()) return setSuggestions([]);
    const controller = new AbortController();

    const fetchSearch = async () => {
      try {
        const res = await axios.get(`https://ophim1.com/v1/api/tim-kiem`, {
          params: { keyword: searchTerm },
          signal: controller.signal
        });
        setSuggestions(res.data?.data?.items || []);
      } catch (err) {
        if (err.name !== "CanceledError") console.error(err);
      }
    };

    fetchSearch();
    return () => controller.abort();
  }, [searchTerm]);

  /* ===== SCROLL EFFECT ===== */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all py-4 px-4 md:px-8 lg:px-12
      ${scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>

      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="text-white text-2xl font-bold">PhimCúĐêm</Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/danh-sach/phim-bo" className="text-white hover:text-slate-300">Phim bộ</Link>
          <Link to="/danh-sach/phim-le" className="text-white hover:text-slate-300">Phim lẻ</Link>
          <Dropdown title="Danh sách" items={danhSach} type="danh-sach" />
          <Dropdown title="Thể loại" items={theLoai} type="the-loai" />
          <Dropdown title="Quốc gia" items={quocGia} type="quoc-gia" />
        </nav>

        {/* SEARCH + ICONS */}
        <div className="flex items-center gap-4 relative">

          {/* DESKTOP SEARCH */}
          <div className="hidden md:block relative">
            <form onSubmit={handleSearch}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Tìm kiếm phim..."
                className="bg-slate-800/70 rounded-full px-5 py-3 pr-12 w-72 text-white"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>

            {/* SUGGESTIONS */}
            {searchFocused && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 z-50">
                {suggestions.slice(0, 5).map(m => (
                  <Link
                    key={m.slug}
                    to={`/phim/${m.slug}`}
                    className="flex gap-4 p-4 hover:bg-slate-800/60 transition"
                  >
                    <img src={`${POSTER_BASE}${m.poster_url}`} className="w-12 h-16 object-cover rounded" />
                    <div>
                      <p className="text-white font-medium">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.year}</p>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={() => navigate(`/tim-kiem?keyword=${searchTerm}`)}
                  className="w-full py-3 text-center text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition rounded-b-2xl"
                >
                  Toàn bộ kết quả →
                </button>
              </div>
            )}
          </div>

          {/* ICONS DESKTOP */}
          <Link to="/yeu-thich" className="hidden md:block"><Heart className="text-white" /></Link>
          <Link to="/lich-su" className="hidden md:block"><History className="text-white" /></Link>
          {user ? (
            <button onClick={logout} className="hidden md:flex items-center gap-2 text-white">
              <User /> Đăng xuất
            </button>
          ) : (
            <Link to="/dang-nhap" className="hidden md:flex items-center gap-2 text-white">
              <User /> Đăng nhập
            </Link>
          )}

          {/* MOBILE SEARCH + MENU BUTTON */}
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden">
            <Search className="text-white" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH DROPDOWN */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl w-full absolute top-full left-0 px-4 py-4 z-40">
          <form onSubmit={handleSearch}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm phim..."
              className="w-full px-4 py-3 rounded-full text-black"
            />
          </form>
        </div>
      )}

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl w-full absolute top-full left-0 px-4 py-4 flex flex-col gap-3 z-40">
          <DropdownMobile title="Danh sách" items={danhSach} type="danh-sach" closeMenu={() => setMobileMenuOpen(false)} />
          <DropdownMobile title="Thể loại" items={theLoai} type="the-loai" closeMenu={() => setMobileMenuOpen(false)} />
          <DropdownMobile title="Quốc gia" items={quocGia} type="quoc-gia" closeMenu={() => setMobileMenuOpen(false)} />
          <Link to="/yeu-thich" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium">Yêu thích</Link>
          <Link to="/lich-su" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium">Lịch sử</Link>
          {user ? (
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white font-medium flex items-center gap-2">
              <User /> Đăng xuất
            </button>
          ) : (
            <Link to="/dang-nhap" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium flex items-center gap-2">
              <User /> Đăng nhập
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

// ===== DROPDOWN DESKTOP =====
function Dropdown({ title, items, type }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white hover:text-slate-300 transition font-medium flex items-center gap-1"
      >
        {title} <span className="text-xs">▼</span>
      </button>

      {open && (
<div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[800px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 z-50">          <div className="grid grid-cols-5 gap-6 p-6">
            {items.map(item => (
              <Link
                key={`${title}-${item.slug}`}
                to={`/${type}/${item.slug}`}
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-slate-800/60 px-4 py-3 transition font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== DROPDOWN MOBILE =====
function DropdownMobile({ title, items, type, closeMenu }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-300 hover:text-white font-medium flex justify-between items-center px-2 py-2"
      >
        {title} <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="flex flex-col pl-4">
          {items.map(item => (
            <Link
              key={`${title}-${item.slug}`}
              to={`/${type}/${item.slug}`}
              onClick={closeMenu}
              className="text-gray-400 hover:text-white px-2 py-1 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;
