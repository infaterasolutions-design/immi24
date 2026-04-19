"use client";

import Link from "next/link";
import { useState, use } from "react";
import SidebarWidgets from "@/components/SidebarWidgets";
import { getLiveEventById, LIVE_EVENTS } from "@/lib/liveUpdatesData";

const LiveUpdateCard = ({ update }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="relative pl-8 lg:pl-0 group mb-10 lg:mb-14">
      {/* Timeline dots */}
      {update.isFirst ? (
        <div className="absolute left-[-6px] lg:left-[-32px] top-1 w-[18px] h-[18px] bg-amber-500 rounded-full ring-2 ring-amber-200 z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      ) : (
        <div className="absolute left-[-1px] lg:left-[-27px] top-2 w-2 h-2 bg-slate-300 rounded-full ring-2 ring-white z-10"></div>
      )}
      
      <div className="flex flex-col relative">
        <header className="flex items-center gap-2 mb-3">
          <span className="font-bold text-sm text-slate-900">{update.time}</span>
        </header>

        {/* Card with border and shadow */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm relative">
          <h3 className="text-xl md:text-[22px] font-bold font-headline tracking-tight text-slate-900 mb-4 leading-snug">
            {update.title}
          </h3>

          {/* Images sit above description */}
          {update.images && update.images.length > 0 && (
            <div className={`grid ${update.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 md:gap-4 mb-4`}>
              {update.images.map((imgSrc, idx) => (
                <img key={idx} className="w-full object-cover rounded-xl shadow-sm max-h-[400px]" src={imgSrc} alt={`Update Image ${idx + 1}`} />
              ))}
            </div>
          )}

          <div className="relative">
            {/* Clamped description content */}
            <div className={`text-[17px] leading-[1.65] font-serif text-slate-800 whitespace-pre-wrap transition-all duration-300 ${!isExpanded ? 'line-clamp-8' : ''}`}>
               {update.content}
            </div>
            
            {update.quote && (
              <div className={`bg-slate-50 border-l-4 border-slate-300 p-4 md:p-5 mt-4 italic text-sm md:text-base text-slate-700 font-medium rounded-r-xl ${!isExpanded ? 'hidden' : 'block'}`}>
                {update.quote}
              </div>
            )}
            
            {/* Display "Read More" universally if content is sufficiently long */}
            {(update.content && update.content.length > 200) && (
              <div className="mt-4 pt-3">
                 <button 
                   onClick={() => setIsExpanded(!isExpanded)}
                   className="text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                 >
                   {isExpanded ? "Show Less" : "Read More"}
                   <span className="material-symbols-outlined text-[16px]">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                 </button>
              </div>
            )}
          </div>

          {/* Share Button intersecting the bottom border */}
          <button className="absolute -bottom-5 right-4 md:right-8 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-md shadow-sm transition-all group/share z-20">
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default function LiveUpdateEventPage({ params }) {
  const { id } = use(params);
  const event = getLiveEventById(id);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  // Pagination for updates
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold font-headline text-slate-900 mb-4">Event Not Found</h1>
          <p className="text-slate-500 mb-8">This live event does not exist or has been removed.</p>
          <Link href="/live-updates" className="bg-primary text-white px-6 py-3 font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all rounded-md">
            ← Back to All Live Updates
          </Link>
        </div>
      </div>
    );
  }

  const updates = event.updates || [];
  const visibleUpdates = updates.slice(0, visibleCount);
  const hasMore = visibleCount < updates.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="pt-4 md:pt-8 pb-24 min-h-screen flex justify-center px-3 md:px-4 lg:px-0">
      <main className="w-full max-w-[1298px] mx-auto px-0 md:px-4 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Floating Social Interaction Bar (Desktop) - Matches Article Page Layout */}
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

        <section className="col-span-1 lg:col-span-7">
          <header className="mb-8 md:mb-12">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/live-updates" className="hover:text-primary transition-colors">Live Updates</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium truncate max-w-[200px]">{event.title}</span>
            </div>

            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse-red"></span>
                LIVE UPDATES
              </span>
              <span className="text-[10px] md:text-xs text-outline font-medium tracking-wide uppercase">Breaking News</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter text-slate-900 mb-6 md:mb-8 leading-[1.1]">
              {event.title}
            </h1>
            
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10 text-on-surface-variant flex-wrap">
              {event.author && (
                <>
                  <div className="flex items-center gap-2">
                    <img 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" 
                      src={event.author.image || "/images/u1.jpg"} 
                      alt={event.author.name} 
                    />
                    <div>
                      <span className="block text-sm font-bold font-headline text-slate-900">{event.author.name}</span>
                      <span className="block text-[10px] md:text-xs uppercase tracking-tight">{event.author.role}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-outline-variant/30 hidden sm:block"></div>
                </>
              )}
              <div className="text-xs md:text-sm font-medium">
                {event.date}
              </div>
            </div>

            {event.heroImage && (
              <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl mb-8">
                <img 
                   className="w-full h-full object-cover" 
                   src={event.heroImage} 
                   alt={event.title} 
                />
                {event.imageCaption && (
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-slate-900/80 backdrop-blur-sm text-white px-2 md:px-3 py-1 text-[9px] md:text-[10px] uppercase font-bold tracking-widest rounded-sm">
                    {event.imageCaption}
                  </div>
                )}
              </div>
            )}

            {/* Context paragraph before live updates start */}
            {event.headerContext && (
              <div className="relative">
                <div className={`text-[16px] md:text-[18px] leading-[1.65] font-serif text-slate-800 whitespace-pre-wrap transition-all duration-300 ${!isHeaderExpanded ? 'line-clamp-6' : ''}`}>
                  {event.headerContext}
                </div>
                {event.headerContext.length > 300 && (
                  <div className="mt-4">
                     <button 
                       onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                       className="text-primary font-bold text-[12px] uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-1"
                     >
                       {isHeaderExpanded ? "Show Less context" : "Read More context"}
                       <span className="material-symbols-outlined text-[18px]">{isHeaderExpanded ? 'expand_less' : 'expand_more'}</span>
                     </button>
                  </div>
                )}
              </div>
            )}
          </header>

          <div className="space-y-4 lg:space-y-6 relative mt-8 lg:mt-12">
            {visibleUpdates.length > 0 ? (
              <>
                <div className="absolute left-[3px] lg:left-[-23px] top-6 bottom-0 w-[1px] bg-slate-200"></div>
                {visibleUpdates.map((update) => (
                  <LiveUpdateCard key={update.id} update={update} />
                ))}
              </>
            ) : (
              <div className="bg-slate-50 text-slate-500 p-8 rounded-xl text-center border border-slate-200 border-dashed">
                 No updates have been posted for this event yet. Check back soon.
              </div>
            )}
          </div>

          {hasMore && (
            <div className="mt-12 md:mt-16 flex justify-center">
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 font-headline font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-blue-800 transition-all flex items-center gap-3 rounded-full w-full sm:w-auto justify-center shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Loading Updates...' : 'Load Older Updates'}
                {!isLoading && <span className="material-symbols-outlined text-[20px]">expand_more</span>}
              </button>
            </div>
          )}
        </section>

        {/* Global Sidebar Widgets - Mirrors Article Page Component exactly */}
        <SidebarWidgets showLiveCoverage={true} className="col-span-1 lg:col-span-4 hidden lg:block" />
      </main>
    </div>
  );
}
