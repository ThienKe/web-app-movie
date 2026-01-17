// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter, Globe, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-white/5 mt-20 pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* CỘT 1: BRAND & INTRO */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.webp" alt="Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-black tracking-tighter">
                PHIM<span className="text-red-600">CÚ</span>ĐÊM
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed ">
              Nền tảng xem phim trực tuyến chất lượng cao với kho nội dung đa dạng từ điện ảnh thế giới đến phim truyền hình đặc sắc. Trải nghiệm giải trí không giới hạn.
            </p>
          </div>

          {/* CỘT 2: KHÁM PHÁ */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Khám Phá</h3>
            <ul className="grid grid-cols-1 gap-3 text-gray-400 text-sm">
              <li><Link to="/" className=" transition-colors flex items-center gap-2"><span>•</span> Trang Chủ</Link></li>
              <li><Link to="/danh-sach/phim-le" className=" transition-colors flex items-center gap-2"><span>•</span> Phim Lẻ Mới</Link></li>
              <li><Link to="/danh-sach/phim-bo" className=" transition-colors flex items-center gap-2"><span>•</span> Phim Bộ Hot</Link></li>
              <li><Link to="/danh-sach/phim-chieu-rap" className="transition-colors flex items-center gap-2"><span>•</span> Phim Chiếu Rạp</Link></li>
            </ul>
          </div>

          {/* CỘT 3: THÔNG TIN */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Thông Tin</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors flex items-center gap-2"><ShieldCheck size={14}/> Điều khoản sử dụng</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors flex items-center gap-2"><Globe size={14}/> Chính sách riêng tư</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors flex items-center gap-2">Khiếu nại bản quyền</Link></li>
              <li className="text-gray-500 italic mt-4 text-xs">Phim được tổng hợp từ nhiều nguồn trên internet.</li>
            </ul>
          </div>

          {/* CỘT 4: KẾT NỐI */}
          <div className="flex flex-col items-start lg:items-end">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Theo dõi chúng tôi</h3>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/keeslt/" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/ekneiht.06/" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        

        {/* COPYRIGHT BẰNG PHẲNG */}
        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs gap-4">
          <p>© {currentYear} <span className="text-gray-300 font-medium">Phim Cú Đêm</span>. All rights reserved.</p>
          <p>Thiết kế bởi <span className="text-gray-400">Thiên Kế</span></p>
        </div>
      </div>
    </footer>
  );
}