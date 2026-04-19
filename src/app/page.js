"use client";

import Link from "next/link";
import LatestUpdatesFeed from "@/components/LatestUpdatesFeed";
import VideoReels from "@/components/VideoReels";
import { getAllArticles } from "@/lib/mockData";
import { getLiveEvents } from "@/lib/liveUpdatesData";
import { getVideos, subscribeEmail } from "@/lib/supabaseHelpers";
import { useState, useEffect } from "react";
import MoreLiveCoverageWidget from "@/components/MoreLiveCoverageWidget";
import FloatingShareButton from "@/components/FloatingShareButton";

// Placeholder fallback image
const FALLBACK_IMAGE = "https://placehold.co/800x600/e2e8f0/94a3b8?text=No+Image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelsStartIndex, setReelsStartIndex] = useState(0);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      const result = await subscribeEmail(email.trim());
      if (result.success) {
        setIsSubscribed(true);
        setTimeout(() => setIsSubscribed(false), 3000);
        setEmail("");
      }
    }
  };

  const [mockArticles, setMockArticles] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [videoArticles, setVideoArticles] = useState([]);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      const articles = await getAllArticles();
      setMockArticles(articles);
      const events = await getLiveEvents();
      setTickerItems((events || []).slice(0, 5));
      const vids = await getVideos();
      setVideoArticles(vids);
    }
    loadData();
  }, []);

  const allArticles = mockArticles;
  const heroArticle = mockArticles[0];
  const gridArticles = mockArticles.slice(1, 5);
  const topStoryArticles = mockArticles.slice(5, 9);
  const sidebarLatestArticles = mockArticles.slice(5, 8);
  const sidebarMostViewed = mockArticles.slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  return (<>
    <main className="mt-2 md:mt-4 px-3 md:px-4 lg:px-0 mb-12">
      <div className="max-w-[1298px] mx-auto flex justify-center px-0 md:px-4 lg:px-24">
        {/* Center Content */}
        <div className="flex-grow space-y-6 md:space-y-8 w-full">
          
          {/* Live Updates Ticker Slider */}
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

          {/* Hero Section: 50/50 Balance → stacks on mobile */}
          {heroArticle && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left: Featured Story */}
              <Link href={`/article/${heroArticle.id}`} className="group cursor-pointer block">
                <div className="relative aspect-[16/10] overflow-hidden mb-3 md:mb-4 rounded-md">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={heroArticle.mainImage || FALLBACK_IMAGE} alt={heroArticle.title} />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{heroArticle.categoryLabel}</span>
                  <h1 className="text-on-surface text-2xl md:text-3xl font-bold headline-font leading-tight group-hover:text-primary transition-colors">
                    {heroArticle.title}
                  </h1>
                  <p className="text-on-surface-variant text-sm md:text-base leading-relaxed line-clamp-3">
                    {heroArticle.paragraphs?.[0] || heroArticle.imageCaption}
                  </p>
                </div>
              </Link>

              {/* Right: 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {gridArticles.map((art) => (
                  <Link key={art.id} href={`/article/${art.id}`} className="space-y-2 group cursor-pointer block">
                    <div className="aspect-[4/3] overflow-hidden rounded-md">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={art.mainImage || FALLBACK_IMAGE} alt={art.title} />
                    </div>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest block mt-2">{art.categoryLabel}</span>
                    <h3 className="font-bold headline-font text-xs md:text-sm leading-tight group-hover:text-primary transition-colors text-slate-900">{art.title}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{art.date}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Mobile Ad Slot */}
          <div className="mobile-ad-slot">
            <div className="bg-slate-50 border border-slate-200 p-4 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sponsored</div>
          </div>

          {/* Top Stories: Horizontal Slider */}
          <section className="py-4 border-y border-slate-100">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight text-slate-900">Top Stories</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 md:p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="p-2 md:p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x -mx-3 px-3 md:mx-0 md:px-0">
              {topStoryArticles.map((art) => (
                <Link key={art.id} href={`/article/${art.id}`} className="flex-shrink-0 w-[240px] md:w-[280px] snap-start group cursor-pointer block">
                  <div className="relative aspect-[16/10] w-full overflow-hidden mb-3 rounded-md">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={art.mainImage || FALLBACK_IMAGE} alt={art.title} />
                    <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-tighter rounded-sm">{art.categoryLabel}</div>
                  </div>
                  <h4 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2 text-slate-900">{art.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                    <span>{art.readTime}</span>
                    <span>•</span>
                    <span>{art.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Browse by Category */}
          <section className="py-4">
            <h2 className="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight mb-4 md:mb-6 text-slate-900">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <Link href="/category/visa-news/f1-opt" className="bg-blue-50/50 hover:bg-blue-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-blue-100/50 rounded-md">
                <span className="material-symbols-outlined text-blue-600 text-2xl md:text-3xl mb-2 md:mb-3">school</span>
                <span className="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">F1 STUDENT VISA</span>
              </Link>
              <Link href="/category/visa-news/h1b-visa" className="bg-indigo-50/50 hover:bg-indigo-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-indigo-100/50 rounded-md">
                <span className="material-symbols-outlined text-indigo-600 text-2xl md:text-3xl mb-2 md:mb-3">work</span>
                <span className="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">H1B Work</span>
              </Link>
              <Link href="/category/visa-news/green-card" className="bg-emerald-50/50 hover:bg-emerald-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-emerald-100/50 rounded-md">
                <span className="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl mb-2 md:mb-3">style</span>
                <span className="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Green Card</span>
              </Link>
              <Link href="/category/visa-guides" className="bg-rose-50/50 hover:bg-rose-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-rose-100/50 rounded-md">
                <span className="material-symbols-outlined text-rose-600 text-2xl md:text-3xl mb-2 md:mb-3">family_restroom</span>
                <span className="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Visa Guides</span>
              </Link>
              <Link href="/category/visa-news/uscis-updates" className="bg-amber-50/50 hover:bg-amber-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-amber-100/50 rounded-md">
                <span className="material-symbols-outlined text-amber-600 text-2xl md:text-3xl mb-2 md:mb-3">gavel</span>
                <span className="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">USCIS Updates</span>
              </Link>
              <Link href="/category/visa-news/b1-b2" className="bg-slate-100/50 hover:bg-slate-200 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-slate-200/50 rounded-md">
                <span className="material-symbols-outlined text-slate-600 text-2xl md:text-3xl mb-2 md:mb-3">flight</span>
                <span className="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">B1/B2 Visitor</span>
              </Link>
            </div>
          </section>

          {/* Mobile Ad Slot */}
          <div className="mobile-ad-slot">
            <div className="bg-slate-50 border border-slate-200 p-4 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sponsored</div>
          </div>

          {/* Video Highlights — dynamically rendered from article data */}
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
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={art.mainImage || FALLBACK_IMAGE} alt={art.title} />
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

          {/* Latest Updates Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 py-4 border-t border-slate-100">
            <LatestUpdatesFeed articles={allArticles} />

            {/* Sidebar — hidden on mobile */}
            <aside className="hidden lg:block space-y-6">
              <div className="space-y-6">
                
                <MoreLiveCoverageWidget />
                
                {/* Latest News — dynamic */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50">
                  <h3 className="font-extrabold text-sm tracking-widest uppercase text-primary mb-6 border-b border-slate-200 pb-3">Latest News</h3>
                  <div className="space-y-5">
                    {sidebarLatestArticles.map((art, idx) => (
                      <div key={art.id}>
                        {idx > 0 && <div className="h-px w-full bg-slate-200/60 mb-5"></div>}
                        <Link href={`/article/${art.id}`} className="group block">
                          <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: idx === 0 ? '#e11d48' : '#64748b' }}>
                            {idx === 0 ? "BREAKING" : art.date}
                          </div>
                          <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors text-slate-800">{art.title}</h4>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Viewed — dynamic */}
                <div>
                  <h3 className="font-extrabold text-sm tracking-widest uppercase text-slate-900 mb-6">Most Viewed</h3>
                  <div className="space-y-8">
                    {sidebarMostViewed.map((art, idx) => (
                      <Link key={art.id} href={`/article/${art.id}`} className="flex gap-4 group">
                        <span className="text-3xl font-black text-slate-200 headline-font italic">{String(idx + 1).padStart(2, '0')}</span>
                        <div>
                          <h4 className="text-sm font-bold leading-snug text-slate-800 group-hover:text-primary transition-colors">{art.title}</h4>
                          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{art.categoryLabel}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Card / Global Briefing */}
                <div className="bg-primary p-6 text-white shadow-lg rounded-xl">
                  <h3 className="text-xl font-extrabold headline-font mb-2">Global Briefing</h3>
                  <p className="text-sm mb-6 opacity-90 leading-relaxed">Get the week&apos;s most critical immigration news and policy analysis directly in your inbox.</p>
                  <form onSubmit={handleSubscribe} className="space-y-3 relative">
                    <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm md:text-[15px] placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none rounded-md transition-all text-white" 
                      placeholder="Email address" 
                      type="email" 
                    />
                    <button type="submit" className="w-full bg-white text-primary font-bold py-2.5 text-[11px] tracking-widest hover:bg-slate-50 transition-all uppercase rounded-md relative overflow-hidden">
                      <span className={`transition-transform duration-300 ${isSubscribed ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>Subscribe Now</span>
                      <span className={`transition-transform duration-300 flex items-center justify-center gap-1.5 ${isSubscribed ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`}><span className="material-symbols-outlined text-[16px]">check_circle</span> Subscribed!</span>
                    </button>
                    {isSubscribed && (
                      <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Welcome aboard.</p>
                    )}
                  </form>
                </div>

              </div>
            </aside>
          </section>

          {/* Mobile-only Newsletter (shown below feed on small screens) */}
          <div className="lg:hidden">
            <div className="bg-primary p-5 text-white shadow-lg rounded-xl">
              <h3 className="text-lg font-extrabold headline-font mb-2">Global Briefing</h3>
              <p className="text-sm mb-4 opacity-90 leading-relaxed">Get critical immigration news delivered to your inbox weekly.</p>
              <form onSubmit={handleSubscribe} className="space-y-3 relative">
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none rounded-md text-white transition-all" 
                  placeholder="Email address" 
                  type="email" 
                />
                <button type="submit" className="w-full bg-white text-primary font-bold py-3 text-[11px] tracking-widest hover:bg-slate-50 transition-all uppercase rounded-md relative overflow-hidden">
                  <span className={`transition-transform duration-300 ${isSubscribed ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>Subscribe Now</span>
                  <span className={`transition-transform duration-300 flex items-center justify-center gap-1.5 ${isSubscribed ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`}><span className="material-symbols-outlined text-[16px]">check_circle</span> Subscribed!</span>
                </button>
                {isSubscribed && (
                  <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Welcome aboard.</p>
                )}
              </form>
            </div>
          </div>

          {/* Mobile-only Sidebar Widgets (visible only on small screens) */}
          <div className="lg:hidden space-y-6">

            {/* More Live Coverage — Mobile */}
            <MoreLiveCoverageWidget />

            {/* Latest News — Mobile */}
            <div className="bg-slate-50 p-5 border border-slate-200/50">
              <h3 className="font-extrabold text-sm tracking-widest uppercase text-primary mb-5 border-b border-slate-200 pb-3">Latest News</h3>
              <div className="space-y-4">
                {sidebarLatestArticles.map((art, idx) => (
                  <div key={art.id}>
                    {idx > 0 && <div className="h-px w-full bg-slate-200/60 mb-4"></div>}
                    <Link href={`/article/${art.id}`} className="group block">
                      <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: idx === 0 ? '#e11d48' : '#64748b' }}>
                        {idx === 0 ? "BREAKING" : art.date}
                      </div>
                      <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors text-slate-800">{art.title}</h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Viewed — Mobile */}
            <div>
              <h3 className="font-extrabold text-sm tracking-widest uppercase text-slate-900 mb-5">Most Viewed</h3>
              <div className="space-y-6">
                {sidebarMostViewed.map((art, idx) => (
                  <Link key={art.id} href={`/article/${art.id}`} className="flex gap-4 group">
                    <span className="text-3xl font-black text-slate-200 headline-font italic">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="text-sm font-bold leading-snug text-slate-800 group-hover:text-primary transition-colors">{art.title}</h4>
                      <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{art.categoryLabel}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Trust Section: Trusted Authority — uses first article image */}
          <section className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-slate-200 shadow-sm overflow-hidden rounded-xl">
              <div className="h-48 md:h-80 lg:h-auto overflow-hidden">
                <img className="w-full h-full object-cover" src={heroArticle?.mainImage || FALLBACK_IMAGE} alt="Your Trusted Authority" />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 self-start mb-4 md:mb-6 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  <span className="material-symbols-outlined text-sm">verified</span> Verified Accuracy
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold headline-font mb-3 md:mb-4 leading-tight text-slate-900">Your Trusted Authority on US Immigration</h2>
                <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">For over a decade, we&apos;ve provided millions of readers with fact-checked, up-to-the-minute analysis of shifting immigration policies and procedural changes.</p>
                <div className="flex items-center gap-6 md:gap-8">
                  <div>
                    <p className="text-xl md:text-2xl font-extrabold text-primary headline-font">12M+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Readers</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div>
                    <p className="text-xl md:text-2xl font-extrabold text-primary headline-font">24/7</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>

    <FloatingShareButton />

    {/* Video Reels Full-Screen Viewer */}
    {reelsOpen && (
      <VideoReels
        videos={videoArticles}
        startIndex={reelsStartIndex}
        onClose={() => setReelsOpen(false)}
      />
    )}
  </>);
}
