"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLiveEvents } from "@/lib/liveUpdatesData";

export default function MoreLiveCoverageWidget() {
  const [displayEvents, setDisplayEvents] = useState([]);

  useEffect(() => {
    async function load() {
      const events = await getLiveEvents();
      setDisplayEvents((events || []).slice(0, 4));
    }
    load();
  }, []);

  if (displayEvents.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 mb-6">
      <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse-red"></span>
        More Live Coverage
      </h3>
      <div className="space-y-6">
        {displayEvents.map((event) => {
          return (
            <Link key={event.id} href={`/live-updates/${event.id}`} className="group block">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">LATEST COVERAGE</span>
              <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800 line-clamp-2">
                {event.title}
              </h4>
              <span className="text-[10px] font-bold text-rose-600 tracking-widest mt-1 uppercase flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse-red inline-block"></span> Live Now
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
