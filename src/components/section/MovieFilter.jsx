import { useNavigate, useLocation } from "react-router-dom";
import { Filter, X, CheckCircle2, Search } from "lucide-react"; // Thêm icon Search
import { useState, useEffect } from "react";

export default function MovieFilter({ countries, years, categories }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Lấy giá trị từ URL để khởi tạo state tạm thời
  const queryParams = new URLSearchParams(location.search);
  const [tempFilters, setTempFilters] = useState({
    country: queryParams.get("country") || "",
    year: queryParams.get("year") || "",
    category: queryParams.get("category") || ""
  });

  // Cập nhật tempFilters nếu URL thay đổi bên ngoài (ví dụ nhấn Reset)
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setTempFilters({
      country: q.get("country") || "",
      year: q.get("year") || "",
      category: q.get("category") || ""
    });
  }, [location.search]);

  // 2. Thay đổi giá trị tạm thời (Chưa navigate)
  const handleSelectTemp = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? "" : value // Toggle
    }));
  };

  // 3. Hàm thực thi lọc (Chỉ chạy khi nhấn nút)
  const applyFilters = () => {
    const params = new URLSearchParams(location.search); // Tạo mới để xóa page cũ
    // Cập nhật Quốc gia
    if (tempFilters.country) params.set("country", tempFilters.country);
    else params.delete("country");
    
    // Cập nhật Năm
    if (tempFilters.year) params.set("year", tempFilters.year);
    else params.delete("year");
    
    // Cập nhật Thể loại
    if (tempFilters.category) params.set("category", tempFilters.category);
    else params.delete("category");
    params.set("page", "1");
    setIsOpen(false);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleReset = () => {
    setTempFilters({ country: "", year: "", category: "" });
    navigate(location.pathname, { replace: true });
    setIsOpen(false);
  };

  return (
    <div className="inline-block"> {/* Thay mb-8 bằng inline-block */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-medium"
        >
          <Filter size={16} className="text-white" /> 
          <span>Bộ lọc</span>
        </button>
        
        {/* Hiển thị nhanh tag (Chỉ hiện khi có filter) */}
        {(tempFilters.country || tempFilters.year || tempFilters.category) && (
          <div className="hidden xl:flex gap-1.5">
            {tempFilters.country && <span className="px-2 py-1 bg-red-500/10 rounded-lg text-[10px] text-red-400 border border-red-500/20 uppercase font-bold">QG</span>}
            {tempFilters.year && <span className="px-2 py-1 bg-red-500/10 rounded-lg text-[10px] text-red-400 border border-red-500/20 uppercase font-bold">Năm</span>}
            {tempFilters.category && <span className="px-2 py-1 bg-red-500/10 rounded-lg text-[10px] text-red-400 border border-red-500/20 uppercase font-bold">TL</span>}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full md:max-w-2xl bg-[#0f0f0f] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase tracking-tighter">Lọc phim nâng cao</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Quốc Gia */}
              <FilterSection 
                label="Chọn quốc gia" 
                items={countries} 
                currentValue={tempFilters.country} 
                onSelect={(val) => handleSelectTemp("country", val)} 
              />
              
              {/* Thể loại */}
              {location.pathname.split('/')[1] !== 'the-loai' && (
                <FilterSection 
                  label="Chọn thể loại" 
                  items={categories} 
                  currentValue={tempFilters.category} 
                  onSelect={(val) => handleSelectTemp("category", val)} 
                />
              )}

              {/* Năm */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase">Năm sản xuất</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => handleSelectTemp("year", y.toString())}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        tempFilters.year === y.toString() ? "bg-red-600 border-red-500 text-white" : "bg-white/5 border-white/5 text-gray-400"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer với 2 nút */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-4">
              <button onClick={handleReset} className="py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold transition-all">Làm mới</button>
              <button onClick={applyFilters} className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                <Search size={18} /> Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component cho gọn
function FilterSection({ label, items, currentValue, onSelect }) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.slug}
            onClick={() => onSelect(item.slug)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${
              currentValue === item.slug ? "bg-red-600 border-red-500 text-white" : "bg-white/5 border-white/10 text-gray-400"
            }`}
          >
            {currentValue === item.slug && <CheckCircle2 size={14} />}
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}