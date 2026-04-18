"use client";

import Link from "next/link";
import { useState } from "react";
import SidebarWidgets from "@/components/SidebarWidgets";

const INITIAL_UPDATES = [
  {
    id: 1,
    time: "13m ago (20:21 GMT)",
    title: "Iranian official says 3,468 killed in US-Israeli attacks during war",
    content: "Iran's state-run Foundation of Martyrs and Veterans Affairs has said US-Israeli at-tacks since the start of the war killed at least 3,468 people.\n\nThe number was reported by the ISNA news agency and attributed to foundation head Ahmad Mousavi.\n\nA previous toll from the head of the Iranian Legal Medicine Organisation issued on April 12 had said 3,375 people in Iran had been killed in the war.\n\nThis marks a significant escalation in the reported figures, reflecting the ongoing intensity of the conflict. Observers note that these figures have not been independently verified, as international organizations face severe access restrictions in the affected zones.\n\nThe international community continues to call for immediate de-escalation and the opening of humanitarian corridors to provide essential aid to civilian populations caught in the crossfire. Diplomatic efforts in Geneva are currently stalled, with both sides refusing to participate in direct negotiations without preconditions. More details will be shared as the situation develops over the next 24 hours.",
    isFirst: true,
  },
  {
    id: 2,
    time: "45m ago (19:49 GMT)",
    title: "Member states react to tax reciprocity clause",
    content: "Spain and Italy have expressed concerns regarding the tax implications for remote workers staying longer than 180 days. Negotiations are currently focusing on a 'Dual Residence Recognition' model.\n\nSeveral finance ministers argued that the current framework would disproportionately benefit northern states while draining tax revenues from southern tourist hubs. They propose a mandatory revenue-sharing mechanism if a digital nomad resides in multiple countries during a single fiscal year.",
    images: ["/images/2.jpg", "/images/3.jpg"],
  },
  {
    id: 3,
    time: "2h ago (18:10 GMT)",
    title: "Tech Hubs in Berlin and Lisbon support the move",
    content: "Major European technology associations have released a joint statement welcoming the streamlined digital nomad visa, citing a projected 15% boost in local innovation ecosystems.",
  }
];

const MORE_UPDATES = [
  {
    id: 4,
    time: "12:30 GMT",
    title: "Initial debate scheduled for European Parliament",
    content: "The European Parliament has confirmed that the first reading of the proposed digital nomad visa framework will take place during next week's plenary session in Strasbourg.",
  },
  {
    id: 5,
    time: "11:15 GMT",
    title: "Analysis: What this means for US citizens",
    content: "For American professionals, the proposed visa could mean a single application for pan-European remote work access, fundamentally altering transatlantic labor dynamics.",
    images: ["/images/4.jpg"],
  }
];

const LiveUpdateCard = ({ update }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="relative pl-8 md:pl-12 group mb-10 md:mb-14">
      {/* Timeline dots */}
      {update.isFirst ? (
        <div className="absolute left-[-5px] top-1 w-[18px] h-[18px] bg-amber-500 rounded-full ring-2 ring-amber-200 z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      ) : (
        <div className="absolute left-[0px] top-1.5 w-2 h-2 bg-slate-300 rounded-full ring-2 ring-white z-10"></div>
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
            {(update.content.length > 200) && (
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

export default function LiveUpdatesPage() {
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUpdates([...updates, ...MORE_UPDATES]);
      setHasMore(false);
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
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse-red"></span>
                LIVE UPDATES
              </span>
              <span className="text-[10px] md:text-xs text-outline font-medium tracking-wide uppercase">Breaking News • 12 mins ago</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter text-slate-900 mb-6 md:mb-8 leading-[1.1]">
              Global Mobility Shift: European Union Proposes Streamlined Digital Nomad Visa Framework
            </h1>
            
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10 text-on-surface-variant flex-wrap">
              <div className="flex items-center gap-2">
                <img 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
                  src="/images/u1.jpg" 
                  alt="Julian Thorne" 
                />
                <div>
                  <span className="block text-sm font-bold font-headline text-slate-900">Julian Thorne</span>
                  <span className="block text-[10px] md:text-xs uppercase tracking-tight">Chief Policy Correspondent</span>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/30 hidden sm:block"></div>
              <div className="text-xs md:text-sm font-medium">
                Updated October 24, 2023 — 14:20 GMT
              </div>
            </div>

            <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl mb-8">
              <img 
                className="w-full h-full object-cover" 
                src="/images/1.jpg" 
                alt="European Parliament" 
              />
              <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-slate-900/80 backdrop-blur-sm text-white px-2 md:px-3 py-1 text-[9px] md:text-[10px] uppercase font-bold tracking-widest rounded-sm">
                Photo: Getty Images / European Press Agency
              </div>
            </div>

            {/* Context paragraph before live updates start */}
            <div className="relative pl-8 md:pl-12">
              <div className={`text-[16px] md:text-[18px] leading-[1.65] font-serif text-slate-800 whitespace-pre-wrap transition-all duration-300 ${!isHeaderExpanded ? 'line-clamp-8' : ''}`}>
                {"The European Commission is moving aggressively forward with a new proposal that could fundamentally alter the landscape for remote workers globally. As the post-pandemic reality continues to detach high-value knowledge workers from physical office locations, member states have recognized the urgent need to retain their competitive edge in attracting this lucrative demographic.\n\nHistorically, digital nomads navigating Europe have been forced to contend with a complex and often contradictory patchwork of individual national requirements. Some countries demand exorbitant proof of income, while others strictly prohibit any remote work whatsoever under standard tourist visas. The proposed unified framework aims to dismantle these barriers, offering a streamlined 'EU Nomad Pass' that would essentially act as a golden ticket for highly skilled professionals.\n\nThis proposed legislation would allow approved remote workers to reside and work across any participating EU member state for up to two years. Crucially, the pass seeks to synchronize tax obligations, establishing a 'Dual Residence Recognition' model designed to eliminate the threat of double taxation—a major deterrent for location-independent workers. The framework would establish a default rule where the nomad is primarily taxed in the member state where they spend the majority of the fiscal year.\n\nThe implications of this shift are massive. For American professionals, the proposed visa could mean a single application for pan-European remote work access, fundamentally altering transatlantic labor dynamics. While the proposal is currently facing pushback from southern tourist hubs concerned about infrastructure strain, the overarching mandate from Brussels is clear: Europe must consolidate its position as the premier destination for the global digital workforce."}
              </div>
              <div className="mt-4">
                 <button 
                   onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                   className="text-primary font-bold text-[12px] uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-1"
                 >
                   {isHeaderExpanded ? "Show Less" : "Read More"}
                   <span className="material-symbols-outlined text-[18px]">{isHeaderExpanded ? 'expand_less' : 'expand_more'}</span>
                 </button>
              </div>
            </div>
          </header>

          <div className="space-y-2 md:space-y-4 relative mt-8 md:mt-12">
            <div className="absolute left-[3px] top-6 bottom-0 w-[1px] bg-slate-200"></div>
            
            {updates.map((update) => (
              <LiveUpdateCard key={update.id} update={update} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 md:mt-16 flex justify-center">
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 font-headline font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-blue-800 transition-all flex items-center gap-3 rounded-full w-full sm:w-auto justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
