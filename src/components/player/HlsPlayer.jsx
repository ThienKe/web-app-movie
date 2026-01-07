import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsPlayer({ src, movieId, episodeSlug, onEnded }) {
  const videoRef = useRef(null);
  const storageKey = `progress:${movieId}:${episodeSlug}`;

  // ===== INIT HLS =====
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  // ===== AUTO RESUME + SAVE PROGRESS =====
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      video.currentTime = Number(savedTime);
    }

    const saveProgress = () => {
      localStorage.setItem(storageKey, video.currentTime);
    };

    video.addEventListener("timeupdate", saveProgress);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", saveProgress);
      video.removeEventListener("ended", onEnded);
    };
  }, [storageKey, onEnded]);

  // ===== PHÍM TẮT =====
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
        case "arrowright":
        case "l":
          video.currentTime += 10;
          break;
        case "arrowleft":
        case "j":
          video.currentTime -= 10;
          break;
        case "arrowup":
          video.volume = Math.min(video.volume + 0.1, 1);
          break;
        case "arrowdown":
          video.volume = Math.max(video.volume - 0.1, 0);
          break;
        case "f":
          if (!document.fullscreenElement) {
            video.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      preload="auto"
      className="w-full h-full bg-black"
    />
  );
}
