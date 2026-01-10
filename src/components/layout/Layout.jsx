// src/components/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function Layout() {
  const [bgPos, setBgPos] = useState("50% 50%");

  useEffect(() => {
    const updateBackgroundPosition = () => {
      const centerY = window.scrollY + window.innerHeight / 2;
      setBgPos(`50% ${centerY}px`);
    };

    updateBackgroundPosition();
    window.addEventListener("scroll", updateBackgroundPosition);
    window.addEventListener("resize", updateBackgroundPosition);

    return () => {
      window.removeEventListener("scroll", updateBackgroundPosition);
      window.removeEventListener("resize", updateBackgroundPosition);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#020617] relative overflow-hidden text-white">
      
      {/* ===== RADIAL GLOW BACKGROUND ===== */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(
              circle 500px at ${bgPos},
              rgba(6,182,212,0.35),
              transparent 70%
            )
          `,
        }}
      />

      {/* ===== CONTENT LAYER ===== */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
          <Header />
        {/* chừa chỗ cho header fixed */}
        <main className="flex-1 pt-20">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
