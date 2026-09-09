"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FloatingShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Read from localStorage only
    const localShares = parseInt(localStorage.getItem('homepage_shares_fallback') || '0', 10);
    setShareCount(localShares);
  }, []);

  if (pathname !== "/") return null;

  const shareData = {
    title: typeof document !== "undefined" ? document.title : "Stitch USA Immigration News",
    text: "Check out the latest US immigration news and updates!",
    url: typeof window !== "undefined" ? window.location.href : "https://example.com",
  };

  const incrementShare = () => {
    // Update local state and localStorage
    setShareCount(prev => {
      const next = prev + 1;
      localStorage.setItem('homepage_shares_fallback', next.toString());
      return next;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        incrementShare();
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
          setIsOpen(!isOpen);
        }
      }
    } else {
      setIsOpen(!isOpen);
      incrementShare();
    }
  };

  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareText = encodeURIComponent(shareData.text);

  return (
    <div className="fixed bottom-[85px] right-6 z-[9999] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-100 p-2 flex flex-col gap-1 w-[150px] animate-fade-in-up origin-bottom">
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => incrementShare()}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-md transition-colors text-[11px] uppercase tracking-widest font-bold text-slate-700"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" className="w-[14px] h-[14px] flex-shrink-0" />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => incrementShare()}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-md transition-colors text-[11px] uppercase tracking-widest font-bold text-slate-700"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-[14px] h-[14px] flex-shrink-0" />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => incrementShare()}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-md transition-colors text-[11px] uppercase tracking-widest font-bold text-slate-700"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="w-[14px] h-[14px] flex-shrink-0" />
            X/Twitter
          </a>
        </div>
      )}
      
      <button
        onClick={handleShare}
        className="w-[46px] h-[46px] flex flex-col items-center justify-center text-slate-500 hover:text-primary transition-all duration-300 z-50 group gap-1"
        aria-label="Share Website"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">share</span>
        {shareCount !== null && <span className="text-[10px] font-bold leading-none text-slate-500">{shareCount}</span>}
      </button>
    </div>
  );
}
