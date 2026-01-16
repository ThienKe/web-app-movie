// src/components/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function Layout() {
  

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden flex flex-col">
      
      {/* Lớp phủ màu xám nhẹ (giống màu comment của bạn) lên toàn bộ trang */}
      <div className="fixed inset-0 z-0 bg-white/5 pointer-events-none" />

      
      
        
        <Header />

      
        <main className="flex-1 w-full max-w-[1920px] mx-auto relative z-10">
          <Outlet />
        </main>

        <Footer />
      </div>
   
  );
}