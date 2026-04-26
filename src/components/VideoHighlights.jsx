"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const VideoReels = dynamic(() => import("@/components/VideoReels"));
const FALLBACK_IMAGE = "/images/logo.png";

export default function VideoHighlights({ videoArticles }) {
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelsStartIndex, setReelsStartIndex] = useState(0);

  if (!videoArticles || videoArticles.length === 0) return null;

  return (
    <>
      <section className="py-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight text-slate-900">Video Highlights</h2>
          <div className="flex gap-2">
            <button className="p-2 md:p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="p-2 md:p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x -mx-3 px-3 md:mx-0 md:px-0">
          {videoArticles.map((art, idx) => {
            const durations = ["1:24", "0:58", "2:15", "1:05", "0:45"];
            return (
              <div key={art.id} onClick={() => { setReelsStartIndex(idx); setReelsOpen(true); }} className="flex-shrink-0 w-36 md:w-44 snap-start group cursor-pointer block">
                <div className="relative aspect-[9/16] video-card-rounded overflow-hidden mb-2">
                  <Image width={200} height={350} quality={60} loading="lazy" sizes="176px" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={art.mainImage || FALLBACK_IMAGE} alt={art.title} />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl md:text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 text-[10px] text-white font-bold rounded-sm">{durations[idx] || "1:00"}</div>
                </div>
                <h4 className="text-[11px] md:text-xs font-bold headline-font line-clamp-2 text-center group-hover:text-primary transition-colors text-slate-900">{art.title}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* Video Reels Full-Screen Viewer */}
      {reelsOpen && (
        <VideoReels
          videos={videoArticles}
          startIndex={reelsStartIndex}
          onClose={() => setReelsOpen(false)}
        />
      )}
    </>
  );
}
