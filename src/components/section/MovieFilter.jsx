import { useNavigate, useLocation } from "react-router-dom";
import { Filter, X, RotateCcw, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function MovieFilter({ countries, years, categories}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const currentCountry = queryParams.get("country");
  const currentYear = queryParams.get("year");

  // Hàm điều hướng ngay khi click
  const handleSelect = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Luôn về trang 1 khi lọc
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    // Chỉ giữ lại path (ví dụ /the-loai/hanh-dong), xóa sạch các query ?...
    navigate(location.pathname);
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-950 hover:bg-red-700 text-white rounded-2xl font-bold transition-all "
        >
          <Filter size={18} /> Bộ lọc nâng cao
        </button>
        
        {/* Hiển thị nhanh các tag đang lọc để user dễ thấy */}
        {(currentCountry || currentYear) && (
          <div className="hidden md:flex gap-2">
            {currentCountry && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-400 border border-blue-400/30">Quốc gia: {currentCountry}</span>}
            {currentYear && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-green-400 border border-green-400/30">Năm: {currentYear}</span>}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full md:max-w-2xl bg-[#0f0f0f] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h2 className="text-xl font-black uppercase">Lọc phim theo yêu cầu</h2>
                <p className="text-xs text-gray-500 mt-1">Lọc trong danh mục: <span className="text-blue-500">{location.pathname.split('/').pop()}</span></p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
              {/* Lọc Quốc Gia */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Chọn quốc gia</label>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => handleSelect("country", c.slug)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${
                        currentCountry === c.slug 
                        ? "bg-red-800 border-red-900 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {currentCountry === c.slug && <CheckCircle2 size={14} />}
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Lọc Thể Loại */}
                  {location.pathname.split('/')[1] !== 'the-loai' && (
  <div className="space-y-4">
    <label className="text-xs font-black text-gray-500 uppercase">Chọn thể loại</label>
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleSelect("category", cat.slug)}
          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
            queryParams.get("category") === cat.slug 
            ? "bg-red-800 border-red-900 text-white" 
            : "bg-white/5 border-white/10 text-gray-400"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  </div>
)}
              {/* Lọc Năm */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Năm sản xuất</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => handleSelect("year", y.toString())}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        currentYear === y.toString() 
                        ? "bg-red-800 border-red-900 text-white" 
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-800/10 hover:bg-red-900 text-white hover:text-white font-bold transition-all text-sm"
              >
                Làm mới 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}