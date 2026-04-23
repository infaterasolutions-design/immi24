"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export default function VideoReels({ videos, startIndex = 0, onClose }) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Scroll to the starting video on mount
  useEffect(() => {
    if (containerRef.current) {
      const target = containerRef.current.children[startIndex];
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [startIndex]);

  // Lock body scroll when reels are open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, videos.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, videos.length, onClose]);

  const scrollToIndex = useCallback((idx) => {
    if (containerRef.current) {
      const target = containerRef.current.children[idx];
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // IntersectionObserver to detect which reel is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    const children = containerRef.current?.children;
    if (children) {
      Array.from(children).forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, [videos]);

  const toggleLike = (idx) => {
    setLiked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = async (video) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.title,
          url: window.location.href,
        });
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center">
      {/* 9:16 Aspect Ratio Container — full on mobile, centered on desktop */}
      <div className="relative w-full h-full md:h-[95vh] md:w-auto md:aspect-[9/16] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Reel Counter */}
        <div className="absolute top-5 right-4 z-50 text-white/70 text-xs font-bold tracking-wider">
          {activeIndex + 1} / {videos.length}
        </div>

        {/* Scrollable Reels Container */}
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        >
        {videos.map((video, idx) => (
          <div
            key={video.id}
            data-index={idx}
            className="relative h-full w-full snap-start snap-always flex items-center justify-center"
          >
            {/* Video / Image Background */}
            <div className="absolute inset-0">
              <Image
                src={video.mainImage}
                alt={video.title}
                fill
                className="object-cover"
              />
              {/* Dark gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
            </div>

            {/* Center Play/Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-10 w-20 h-20 flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                opacity: isPlaying ? 0 : 1,
                pointerEvents: isPlaying ? "none" : "auto",
              }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </div>
            </button>

            {/* Tap area to toggle play/pause */}
            <div
              className="absolute inset-0 z-[5]"
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Animated play icon on pause */}
            {!isPlaying && idx === activeIndex && (
              <div className="absolute inset-0 z-[6] flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse">
                  <span
                    className="material-symbols-outlined text-white text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    pause
                  </span>
                </div>
              </div>
            )}

            {/* Right Side Action Buttons */}
            <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-6">
              {/* Like */}
              <button
                onClick={() => toggleLike(idx)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    liked[idx]
                      ? "bg-red-500 scale-110"
                      : "bg-white/15 backdrop-blur-sm hover:bg-white/25"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-white text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <span className="text-white text-[10px] font-bold">
                  {liked[idx] ? "Liked" : "Like"}
                </span>
              </button>

              {/* Comment */}
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    chat_bubble
                  </span>
                </div>
                <span className="text-white text-[10px] font-bold">
                  Comment
                </span>
              </button>

              {/* Share */}
              <button
                onClick={() => handleShare(video)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    share
                  </span>
                </div>
                <span className="text-white text-[10px] font-bold">Share</span>
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={() => setMuted(!muted)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {muted ? "volume_off" : "volume_up"}
                  </span>
                </div>
                <span className="text-white text-[10px] font-bold">
                  {muted ? "Unmute" : "Mute"}
                </span>
              </button>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 right-16 z-20 p-5 pb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider rounded-sm">
                  {video.categoryLabel || "Video"}
                </span>
                <span className="text-white/60 text-[10px] font-medium">
                  {video.date}
                </span>
              </div>
              <h3 className="text-white text-lg md:text-xl font-bold font-headline leading-snug mb-2 drop-shadow-lg">
                {video.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 drop-shadow-md">
                {video.paragraphs?.[0] || video.imageCaption || ""}
              </p>

              {/* Fake progress bar */}
              <div className="mt-4 h-[3px] bg-white/20 rounded-full overflow-hidden">
                {idx === activeIndex && isPlaying ? (
                  <div className="h-full bg-white rounded-full animate-progress" />
                ) : (
                  <div
                    className="h-full bg-white/50 rounded-full"
                    style={{ width: "0%" }}
                  />
                )}
              </div>
            </div>

            {/* Scroll hints */}
            {idx < videos.length - 1 && idx === activeIndex && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <span className="material-symbols-outlined text-white/40 text-lg">
                  expand_more
                </span>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
