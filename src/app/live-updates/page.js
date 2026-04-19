"use client";

import Link from "next/link";
import SidebarWidgets from "@/components/SidebarWidgets";
import { LIVE_EVENTS } from "@/lib/liveUpdatesData";

export default function LiveUpdatesIndexPage() {
  return (
    <div className="pt-4 md:pt-8 pb-24 min-h-screen flex justify-center px-3 md:px-4 lg:px-0">
      <main className="w-full max-w-[1298px] mx-auto px-0 md:px-4 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <section className="col-span-1 lg:col-span-8">
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tighter text-slate-900 mb-4 leading-[1.1]">
              Active Live News Coverage
            </h1>
            <p className="text-slate-600 text-lg">Follow the latest breaking developments on major immigration policies and impactful global events as they happen.</p>
          </header>

          <div className="space-y-6">
            {LIVE_EVENTS.map((event) => (
              <Link key={event.id} href={`/live-updates/${event.id}`} className="group block bg-white border border-slate-200 hover:border-primary/40 hover:shadow-md transition-all rounded-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {event.heroImage && (
                    <div className="w-full md:w-[40%] aspect-[4/3] md:min-h-[220px] relative overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={event.heroImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-sm flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-red"></span>
                        LIVE
                      </div>
                    </div>
                  )}
                  <div className="p-5 md:p-6 flex flex-col justify-center flex-grow">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">{event.date}</span>
                    <h2 className="text-xl md:text-2xl font-bold font-headline text-slate-900 leading-snug group-hover:text-primary transition-colors mb-3">
                      {event.title}
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                      {event.headerContext}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-primary text-[11px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      View coverage <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <SidebarWidgets showLiveCoverage={false} className="col-span-1 lg:col-span-4 hidden lg:block" />
      </main>
    </div>
  );
}
