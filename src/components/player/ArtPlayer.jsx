import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useHistory } from '../../hooks/useHistory';

export default function ArtPlayer({ src, movieId, episodeSlug, onEnded, ...rest }) {
  const artRef = useRef(null);
  const storageKey = `progress:${movieId}:${episodeSlug}`;
  const { addToHistory, getSavedTime } = useHistory();

  useEffect(() => {
    const savedTime = localStorage.getItem(storageKey) || 0;

    const art = new Artplayer({
      container: artRef.current,
      url: src,
      type: 'm3u8', // Chỉ định loại file
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          }
        },
      },
      // CẤU HÌNH ĐỂ FIX LỖI CONTEXTMENU
      setting: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#e11d48', // Màu đỏ giống theme của bạn
      lang: 'vi',
      lock: true, // Khóa màn hình trên mobile
      fastForward: true,
      autoOrientation: true,
      // QUAN TRỌNG: Ghi đè contextmenu để không bị lỗi share.js
      contextmenu: [
        {
            html: 'Phim Cú Đêm',
            click: function (contextmenu) {
                console.info('Welcome to Phim Cu Dem');
                contextmenu.show = false;
            },
        },
      ],
      ...rest,
    });

    // Khôi phục thời gian đã xem
    art.on('ready', () => {
      if (savedTime > 0) {
        art.currentTime = Number(savedTime);
      }
      art.play().catch(() => {
        art.muted = true; // Nếu bị chặn autoplay thì mute để chạy
        art.play();
      });
    });

    // Lưu tiến trình
    art.on('video:timeupdate', () => {
      if (art.currentTime > 5) {
        localStorage.setItem(storageKey, art.currentTime);
      }
    });

    // Xử lý khi hết phim
    art.on('video:ended', () => {
      if (onEnded) onEnded();
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [src, storageKey]);

  return <div ref={artRef} className="w-full h-full"></div>;
}