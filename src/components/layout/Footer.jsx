// src/components/layout/Footer.jsx (Click logo nhảy Trang Chủ)
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 mt-20 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Bên trái: Logo link to Trang Chủ + Description */}
          <div>
            <Link to="/" className="text-3xl font-bold mb-4 block hover:text-gray-300 transition">
              PhimCúĐêm
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Xem phim hay online miễn phí chất lượng HD. Cập nhật phim mới, phim bộ, phim lẻ, phim chiếu rạp, phim vietsub, thuyết minh nhanh nhất.
            </p>
          </div>

          {/* Giữa: 4 link nhanh */}
          <div>
            <ul className="space-y-2 text-gray-300 items-center">
              <li><Link to="/" className="hover:text-white transition">Trang Chủ</Link></li>
              <li><Link to="/danh-sach/phim-le" className="hover:text-white transition">Phim Lẻ</Link></li>
              <li><Link to="/danh-sach/phim-chieu-rap" className="hover:text-white transition">Chiếu Rạp</Link></li>
              <li><Link to="/quoc-gia/viet-nam" className="hover:text-white transition">Việt Nam</Link></li>
            </ul>
          </div>

          {/* Bên phải: Social */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-xl font-semibold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 hover:bg-white/10 rounded-full transition">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 hover:bg-white/10 rounded-full transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 hover:bg-white/10 rounded-full transition">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="p-3 hover:bg-white/10 rounded-full transition">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © 2026 Phim Cú Đêm. All rights reserved. 
        </div>
      </div>
    </footer>
  );
}