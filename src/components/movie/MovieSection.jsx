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
          y: 40,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
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
