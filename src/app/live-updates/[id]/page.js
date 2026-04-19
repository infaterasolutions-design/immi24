"use client";

import Link from "next/link";
import { useState } from "react";
import { use } from "react";
import { LIVE_UPDATES, getLiveUpdateById } from "@/lib/liveUpdatesData";
import SidebarWidgets from "@/components/SidebarWidgets";

export default function LiveUpdateDetailPage({ params }) {
  const { id } = use(params);
  const update = getLiveUpdateById(id);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!update) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold font-headline text-slate-900 mb-4">Update Not Found</h1>
          <p className="text-slate-500 mb-8">This live update does not exist or has been removed.</p>
          <Link href="/live-updates" className="bg-primary text-white px-6 py-3 font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all">
            ← Back to Live Updates
          </Link>
        </div>
      </div>
    );
  }

  // Get other updates for "More Updates" navigation
  const otherUpdates = LIVE_UPDATES.filter((u) => u.id !== update.id).slice(0, 4);

  return (
    <div className="pt-4 md:pt-8 pb-24 min-h-screen flex justify-center px-3 md:px-4 lg:px-0">
      <main className="w-full max-w-[1298px] mx-auto px-0 md:px-4 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* Floating Social Interaction Bar (Desktop) */}
        <aside className="hidden lg:flex flex-col items-end pt-[190px] pr-2 xl:pr-6">
          <div className="sticky top-32 flex flex-col gap-4 opacity-50 cursor-not-allowed pointer-events-none">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-slate-500 border border-slate-200">
              <span className="material-symbols-outlined text-[20px]">thumb_up</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-slate-500 border border-slate-200">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-slate-500 border border-slate-200">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="col-span-1 lg:col-span-7">
          <header className="mb-8 md:mb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/live-updates" className="hover:text-primary transition-colors">Live Updates</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium truncate max-w-[200px]">{update.title}</span>
            </div>

            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse-red"></span>
                LIVE UPDATE
              </span>
              <span className="text-[10px] md:text-xs text-outline font-medium tracking-wide uppercase">{update.time}</span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter text-slate-900 mb-6 md:mb-8 leading-[1.1]">
              {update.title}
            </h1>

            {/* Hero Image */}
            {update.heroImage && (
              <div className="aspect-[16/9] overflow-hidden mb-6">
                <img
                  className="w-full h-full object-cover"
                  src={update.heroImage}
                  alt={update.title}
                />
              </div>
            )}

            {/* Header Context */}
            {update.headerContext && (
              <div className="relative">
                <div className={`text-[16px] md:text-[18px] leading-[1.65] font-serif text-slate-800 whitespace-pre-wrap transition-all duration-300 ${!isExpanded ? 'line-clamp-4' : ''}`}>
                  {update.headerContext}
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                    <span className="material-symbols-outlined text-[16px]">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Full Update Content */}
          <article className="mb-12">
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-8 shadow-sm">
              {/* Additional Images */}
              {update.images && update.images.length > 0 && (
                <div className={`grid ${update.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 md:gap-4 mb-6`}>
                  {update.images.map((imgSrc, idx) => (
                    <img key={idx} className="w-full object-cover rounded-xl shadow-sm max-h-[400px]" src={imgSrc} alt={`Update Image ${idx + 1}`} />
                  ))}
                </div>
              )}

              <div className="text-[17px] leading-[1.75] font-serif text-slate-800 whitespace-pre-wrap">
                {update.content}
              </div>
            </div>

            {/* Share Button */}
            <div className="flex items-center gap-3 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-colors border border-slate-200">
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share this update
              </button>
            </div>
          </article>

          {/* More Updates Navigation */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-lg font-extrabold headline-font border-l-4 border-primary pl-4 uppercase tracking-tight text-slate-900 mb-6">
              More Updates
            </h2>
            <div className="space-y-4">
              {otherUpdates.map((otherUpdate) => (
                <Link
                  key={otherUpdate.id}
                  href={`/live-updates/${otherUpdate.id}`}
                  className="group block p-4 bg-white border border-slate-200 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-red"></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{otherUpdate.time}</span>
                  </div>
                  <h3 className="text-base font-bold font-headline text-slate-900 group-hover:text-primary transition-colors leading-snug">
                    {otherUpdate.title}
                  </h3>
                </Link>
              ))}
            </div>

            <Link
              href="/live-updates"
              className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
            >
              ← View all live updates
            </Link>
          </section>
        </section>

        {/* Sidebar */}
        <SidebarWidgets showLiveCoverage={true} className="col-span-1 lg:col-span-4 hidden lg:block" />
      </main>
    </div>
  );
}
