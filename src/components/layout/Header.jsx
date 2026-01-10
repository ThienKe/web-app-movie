import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, History, Menu, User as UserIcon, X, LogOut } from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';

const POSTER_BASE = "https://img.ophim.live/uploads/movies/";

// ===== DATA =====
const danhSach = [{ name: "Phim mới", slug: "phim-moi", link: "/danh-sach/phim-moi" }, { name: "Phim bộ", slug: "phim-bo", link: "/danh-sach/phim-bo" }, { name: "Phim lẻ", slug: "phim-le", link: "/danh-sach/phim-le" }, { name: "Hoạt hình", slug: "hoat-hinh", link: "/danh-sach/hoat-hinh" }, { name: "Phim Chiếu Rạp", slug: "phim-chieu-rap", link: "/danh-sach/phim-chieu-rap" }, { name: "Phim Sắp Chiếu", slug: "phim-sap-chieu", link: "/danh-sach/phim-sap-chieu" }, { name: "Phim Đang Chiếu", slug: "phim-dang-chieu", link: "/danh-sach/phim-dang-chieu" }, { name: "Phim Hot", slug: "phim-hot", link: "/danh-sach/phim-hot" }];
const theLoai = [{ name: "Hành Động", slug: "hanh-dong" }, { name: "Cổ Trang", slug: "co-trang" }, { name: "Kinh Dị", slug: "kinh-di" }, { name: "Tình Cảm", slug: "tinh-cam" }, { name: "Hài Hước", slug: "hai-huoc" }, { name: "Viễn Tưởng", slug: "vien-tuong" }, { name: "Hoạt Hình", slug: "hoat-hinh" }, { name: "Phiêu Lưu", slug: "phieu-luu" }, { name: "Tâm Lý", slug: "tam-ly" }, { name: "Chiến Tranh", slug: "chien-tranh" }, { name: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong" }, { name: "Thần Thoại", slug: "than-thoai" }, { name: "Hình Sự", slug: "hinh-su" }, { name: "Lịch Sử", slug: "lich-su" }, { name: "Âm Nhạc", slug: "am-nhac" }, { name: "Tài Liệu", slug: "tai-lieu" }, { name: "Thể Thao", slug: "the-thao" }, { name: "Phim 18+", slug: "phim-18" }, { name: "Phim 13+", slug: "phim-13" }];
const quocGia = [{ name: "Hàn Quốc", slug: "han-quoc" }, { name: "Trung Quốc", slug: "trung-quoc" }, { name: "Âu Mỹ", slug: "au-my" }, { name: "Việt Nam", slug: "viet-nam" }, { name: "Nhật Bản", slug: "nhat-ban" }, { name: "Thái Lan", slug: "thai-lan" }, { name: "Ấn Độ", slug: "an-do" }, { name: "Pháp", slug: "phap" }, { name: "Đài Loan", slug: "dai-loan" }, { name: "Hồng Kông", slug: "hong-kong" }, { name: "Anh", slug: "anh" }, { name: "Mỹ", slug: "my" }, { name: "Đức", slug: "duc" }, { name: "Phần Lan", slug: "phan-lan" }, { name: "Nga", slug: "nga" }, { name: "Úc", slug: "uc" }];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const { user: currentUser, logout: performLogout } = useAuthContext();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/tim-kiem?keyword=${encodeURIComponent(searchTerm.trim())}`);
    setSearchFocused(false);
    setMobileSearchOpen(false);
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

  return (
    <>
      {/* OVERLAY */}
      {(mobileMenuOpen || mobileSearchOpen) && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
        />
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8 lg:px-12 flex items-center justify-between
        ${scrolled || mobileMenuOpen ? 'bg-slate-900 shadow-2xl' : 'bg-transparent'}`}>
        
        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="h-9 md:h-11 w-auto object-contain transition group-hover:scale-105" />
          <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">
            PhimCúĐêm
          </span>
        </Link>

        {/* CENTER: DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/danh-sach/phim-bo" className="text-white hover:text-blue-500 transition font-medium">Phim bộ</Link>
          <Link to="/danh-sach/phim-le" className="text-white hover:text-blue-500 transition font-medium">Phim lẻ</Link>
          <Dropdown title="Danh sách" items={danhSach} type="danh-sach" />
          <Dropdown title="Thể loại" items={theLoai} type="the-loai" />
          <Dropdown title="Quốc gia" items={quocGia} type="quoc-gia" />
        </nav>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Desktop */}
          <div className="hidden md:block relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Tìm kiếm phim..."
                className="bg-slate-800/70 rounded-full px-5 py-2 w-48 lg:w-64 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          <Link to="/yeu-thich" className="hidden md:block text-white p-2 hover:bg-white/10 rounded-full"><Heart className="w-5 h-5" /></Link>
          
          <button 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 text-white"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {currentUser.displayName?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <Link to="/dang-nhap" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm">Đăng nhập</Link>
            )}
          </div>

          {/* Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* MOBILE SEARCH (Absolute inside Header) */}
        {mobileSearchOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 p-4 border-t border-slate-800 animate-in slide-in-from-top">
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên phim..."
                className="w-full bg-slate-800 text-white px-5 py-3 rounded-xl outline-none"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2"><Search className="w-5 h-5 text-white" /></button>
            </form>
          </div>
        )}

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 p-6 flex flex-col gap-4 border-t border-slate-800 shadow-2xl overflow-y-auto max-h-[80vh]">
             <DropdownMobile title="Danh sách" items={danhSach} type="danh-sach" closeMenu={() => setMobileMenuOpen(false)} />
             <DropdownMobile title="Thể loại" items={theLoai} type="the-loai" closeMenu={() => setMobileMenuOpen(false)} />
             <DropdownMobile title="Quốc gia" items={quocGia} type="quoc-gia" closeMenu={() => setMobileMenuOpen(false)} />
             <Link to="/yeu-thich" onClick={() => setMobileMenuOpen(false)} className="text-white py-3 border-b border-white/5">Phim yêu thích</Link>
             {!currentUser && <Link to="/dang-nhap" className="bg-blue-600 text-center py-3 rounded-xl font-bold">Đăng nhập</Link>}
          </div>
        )}
      </header>
    </>
  );
};

// Các Helper Components (Dropdown, DropdownMobile) giữ nguyên logic cũ của bạn nhưng đảm bảo đóng thẻ đúng...
function Dropdown({ title, items, type }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-white hover:text-blue-500 transition font-medium flex items-center gap-1 py-2">
        {title} <span className="text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2 w-[500px] z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 grid grid-cols-3 gap-1 shadow-2xl">
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
      <button onClick={() => setOpen(!open)} className="w-full text-left text-white py-4 flex justify-between">
        {title} <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 pb-4">
          {items.map(item => (
            <Link key={item.slug} to={`/${type}/${item.slug}`} onClick={closeMenu} className="text-gray-400 text-sm py-1">
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;