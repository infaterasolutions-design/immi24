"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LiveTickerSlider({ tickerItems }) {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  useEffect(() => {
    if (!tickerItems || tickerItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [tickerItems]);

  if (!tickerItems || tickerItems.length === 0) return null;

  return (
    <Link href={`/live-updates/${tickerItems[currentTickerIndex]?.id || ''}`} className="flex items-center gap-3 bg-white p-2 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
      <span className="bg-tertiary text-white px-3 md:px-4 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider group-hover:bg-primary transition-colors flex-shrink-0 z-10 relative flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-red"></span>
        Live Update
      </span>
      <div className="flex-grow h-5 md:h-6 relative overflow-hidden">
        {tickerItems.map((item, idx) => {
          let positionClass = 'translate-x-full opacity-0';
          if (idx === currentTickerIndex) {
            positionClass = 'translate-x-0 opacity-100 z-10';
          } else if (idx === (currentTickerIndex - 1 + tickerItems.length) % tickerItems.length) {
            positionClass = '-translate-x-full opacity-0';
          }

          return (
            <p 
              key={item.id}
              className={`absolute left-0 top-0 w-full text-xs md:text-sm font-medium truncate text-slate-800 group-hover:text-primary transition-all duration-500 ease-in-out ${positionClass}`}
            >
              {item.title}
            </p>
          );
        })}
      </div>
      <span className="material-symbols-outlined text-primary ml-auto mr-2 group-hover:translate-x-1 transition-transform hidden sm:block z-10 bg-white relative">arrow_forward</span>
    </Link>
  );
}
