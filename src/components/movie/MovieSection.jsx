// src/components/movie/MovieSection.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MovieCard from "./MovieCard";

gsap.registerPlugin(ScrollTrigger);

export default function MovieSection({ title, movies }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
useGSAP(
  () => {
    if (!movies?.length) return;

    gsap.fromTo(
      cardsRef.current,
      {
        y: 20,             // Nảy nhẹ từ dưới
        opacity: 0,
        scale: 0.9,        // Phóng từ nhỏ đến lớn
        filter: "blur(5px)", // Trạng thái ban đầu bị mờ (quan trọng để mượt)
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",  // Rõ nét dần
        duration: 0.8,        // Tăng lên 0.8s để chuyển động có chiều sâu
        ease: "expo.out",     // Kiểu mượt nhất của GSAP, không bị khựng
        stagger: {
          amount: 0.4,        // Tổng thời gian tỏa ra là 0.4s
          from: "center",     // Tỏa từ trung tâm
          ease: "power2.inOut"
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          once: true
        }
      }
    );
  },
  { scope: sectionRef, dependencies: [movies] }
);

  if (!movies?.length) return null;

  return (
    <section ref={sectionRef} className="w-full py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-6 lg:px-10 text-white">
        {title}
      </h2>

      {/* Grid 2 hàng × 8 cột = 16 phim */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 px-20px md:px-6 lg:px-10">
        {movies.slice(0, 36).map((movie, index) => (
          <div
            key={movie._id || movie.slug}
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <MovieCard movie={movie} large />
          </div>
        ))}
      </div>
    </section>
  );
}
