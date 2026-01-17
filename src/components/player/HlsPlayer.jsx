import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsPlayer({ src, movieId, episodeSlug, onEnded }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // Dùng ref để quản lý hls instance tốt hơn
  const storageKey = `progress:${movieId}:${episodeSlug}`;

 
  useEffect(() => {
  
    if (typeof window !== "undefined") {
      window.Artplayer = window.Artplayer || {
        version: "5.2.2",
        instances: [],
        contextmenu: { remove: () => {} }, 
        config: { plugins: [] }
      };
    }
  }, []);

  // 2. KHỞI TẠO PLAYER
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Reset video khi đổi tập
    video.pause();
    video.removeAttribute('src');
    video.load();

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        // Cấu hình quan trọng cho Mobile:
        manifestLoadingMaxRetry: 10,
        levelLoadingMaxRetry: 10,
        fragLoadingMaxRetry: 10,
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Tự động khôi phục tiến trình sau khi manifest load xong
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
          video.currentTime = Number(savedTime);
        }
        // Mobile yêu cầu thao tác người dùng để Play, nhưng nếu đã tương tác trước đó thì autoPlay sẽ chạy
        video.play().catch(() => console.log("Chờ người dùng nhấn Play..."));
      });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Dành riêng cho Safari (iOS)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) video.currentTime = Number(savedTime);
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src, storageKey]);

  // 3. LƯU TIẾN TRÌNH & SỰ KIỆN
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveProgress = () => {
      if (video.currentTime > 5) { // Chỉ lưu khi xem được hơn 5s
        localStorage.setItem(storageKey, video.currentTime);
      }
    };

    video.addEventListener("timeupdate", saveProgress);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", saveProgress);
      video.removeEventListener("ended", onEnded);
    };
  }, [storageKey, onEnded]);

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden"
      // Chặn mọi sự kiện chuột phải/giữ tay trên mobile để script share.js không can thiệp được
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        muted={true}
        preload="metadata"
        className="art-video w-full h-full" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'contain',
        maxWidth: '100%' 
      }}
      />
    </div>
  );
}