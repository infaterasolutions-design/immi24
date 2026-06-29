"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef } from "react";

import LiveTickerSlider from "@/components/LiveTickerSlider";
import NewsletterWidget from "@/components/NewsletterWidget";
import VideoHighlights from "@/components/VideoHighlights";
import MoreLiveCoverageWidget from "@/components/MoreLiveCoverageWidget";

const LatestUpdatesFeed = dynamic(() => import("@/components/LatestUpdatesFeed"));
const FloatingShareButton = dynamic(() => import("@/components/FloatingShareButton"));

// Placeholder fallback image
const FALLBACK_IMAGE = "/images/logo.png";

export default function HomePageContent({ articles = [], tickerItems = [], videoArticles = [], layout = null }) {
  const topStoriesRef = useRef(null);

  const scrollTopStories = (direction) => {
    if (topStoriesRef.current) {
      const scrollAmount = 300;
      topStoriesRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "RECENTLY";
    const date = new Date(dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z');
    const diff = Date.now() - date.getTime();
    
    if (diff < 60000) return "JUST NOW";
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes} MIN${minutes === 1 ? '' : 'S'} AGO`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 HOUR AGO";
    if (hours < 24) return `${hours} HOURS AGO`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 DAY AGO";
    return `${days} DAYS AGO`;
  };
  // 1. Separate Insights and Standard Articles
  const insightsArticles = articles.filter(a => a.category_slug === 'insights' || a.categorySlug === 'insights');
  const standardArticles = articles.filter(a => a.category_slug !== 'insights' && a.categorySlug !== 'insights');

  // Helper to find article by ID
  const findById = (id) => id ? standardArticles.find(a => a.id === id) : null;

  // 2. Determine Hero Article
  // Prioritize manually selected hero, then fallback to is_featured, then newest article
  const manualHero = findById(layout?.hero_article_id);
  const featuredArticle = standardArticles.find(a => a.is_featured === true);
  const heroArticle = manualHero || featuredArticle || standardArticles[0];

  // 3. Filter out Hero from remaining
  const remainingArticles = standardArticles.filter(a => a.id !== heroArticle?.id);

  // 4. Determine Grid Articles
  const gridArticles = [];
  
  // Try to push manually selected grid items if they exist
  if (layout?.grid1_article_id) { const a = findById(layout.grid1_article_id); if (a && a.id !== heroArticle?.id) gridArticles.push(a); }
  if (layout?.grid2_article_id) { const a = findById(layout.grid2_article_id); if (a && a.id !== heroArticle?.id && !gridArticles.includes(a)) gridArticles.push(a); }
  if (layout?.grid3_article_id) { const a = findById(layout.grid3_article_id); if (a && a.id !== heroArticle?.id && !gridArticles.includes(a)) gridArticles.push(a); }
  if (layout?.grid4_article_id) { const a = findById(layout.grid4_article_id); if (a && a.id !== heroArticle?.id && !gridArticles.includes(a)) gridArticles.push(a); }

  // Fill remaining slots with newest articles
  let remainingIndex = 0;
  while (gridArticles.length < 4 && remainingIndex < remainingArticles.length) {
    const candidate = remainingArticles[remainingIndex];
    if (!gridArticles.includes(candidate)) {
      gridArticles.push(candidate);
    }
    remainingIndex++;
  }

  // Determine sidebar / top stories based on what's left after grid
  const unassignedArticles = remainingArticles.filter(a => !gridArticles.includes(a));
  
  // Top Stories is exclusively Insights articles
  const topStoryArticles = insightsArticles.slice(0, 6);
  
  const sidebarLatestArticles = standardArticles.slice(0, 3); // True latest news, exactly like SidebarWidgets
  const sidebarMostViewed = unassignedArticles.slice(3, 6); // Just a fallback for mock data

  return (<>
    <main className="mt-2 md:mt-4 px-3 md:px-4 lg:px-0 mb-12">
      <div className="max-w-[1298px] mx-auto flex justify-center px-0 md:px-4 lg:px-24">
        {/* Center Content */}
        <div className="flex-grow space-y-6 md:space-y-8 w-full">
          
          {/* Live Updates Ticker Slider */}
          <LiveTickerSlider tickerItems={tickerItems} />

          {/* Hero Section: 50/50 Balance → stacks on mobile */}
          {heroArticle && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left: Featured Story */}
              <Link prefetch={true} href={heroArticle.cluster_slug || heroArticle.clusterSlug ? `/${heroArticle.cluster_slug || heroArticle.clusterSlug}/${heroArticle.slug}` : (heroArticle.slug ? `/${heroArticle.slug}` : `/article/${heroArticle.id}`)} className="group cursor-pointer block">
                <div className="relative aspect-[16/10] overflow-hidden mb-3 md:mb-4 rounded-md">
                  <Image width={800} height={500} quality={60} priority fetchPriority="high" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={heroArticle.mainImage || FALLBACK_IMAGE} alt={heroArticle.title} />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{heroArticle.categoryLabel}</span>
                  <h1 className="text-on-surface text-2xl md:text-3xl font-bold headline-font leading-tight group-hover:text-primary transition-colors">
                    {heroArticle.title}
                  </h1>
                  <p className="text-on-surface-variant text-sm md:text-base leading-relaxed line-clamp-3">
                    {(heroArticle.subTitle || heroArticle.paragraphs?.[0]?.replace(/<[^>]*>?/gm, '') || heroArticle.imageCaption || "").slice(0, 150)}...
                  </p>
                </div>
              </Link>

              {/* Right: 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {gridArticles.map((art) => (
                  <Link prefetch={true} key={art.id} href={art.cluster_slug || art.clusterSlug ? `/${art.cluster_slug || art.clusterSlug}/${art.slug}` : (art.slug ? `/${art.slug}` : `/article/${art.id}`)} className="space-y-2 group cursor-pointer block">
                    <div className="aspect-[4/3] overflow-hidden rounded-md relative">
                      <Image width={400} height={300} quality={40} loading="lazy" decoding="async" sizes="(max-width: 768px) 50vw, 25vw" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={art.mainImage || FALLBACK_IMAGE} alt={art.title} />
                    </div>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest block mt-2">{art.categoryLabel}</span>
                    <h3 className="font-bold headline-font text-xs md:text-sm leading-tight group-hover:text-primary transition-colors text-slate-900">{art.title}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{art.date}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}



          {/* Top Stories: Horizontal Slider */}
          <section className="py-4 border-y border-slate-100">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight text-slate-900">
                Top Stories
                <span className="block text-sm text-slate-500 font-normal normal-case tracking-normal mt-1 border-none">Real experiences, city guides &amp; insider tips for immigrants</span>
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => scrollTopStories('left')} className="p-2 md:p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button onClick={() => scrollTopStories('right')} className="p-2 md:p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
            <div ref={topStoriesRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x mt-2">
              {topStoryArticles.length > 0 ? (
                topStoryArticles.map((art) => (
                  <Link prefetch={true} key={art.id} href={art.cluster_slug || art.clusterSlug ? `/${art.cluster_slug || art.clusterSlug}/${art.slug}` : (art.slug ? `/${art.slug}` : `/article/${art.id}`)} className="flex-shrink-0 w-[240px] md:w-[280px] snap-start group cursor-pointer block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden mb-3 rounded-md">
                      <Image width={300} height={200} quality={40} loading="lazy" decoding="async" sizes="280px" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={art.mainImage || FALLBACK_IMAGE} alt={art.title} />
                      <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-tighter rounded-sm">{art.categoryLabel}</div>
                    </div>
                    <h4 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2 text-slate-900">{art.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                      <span>{art.readTime}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500 py-4 px-2">New Insights coming soon. Stay tuned.</p>
              )}
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



          {/* Video Highlights — dynamically rendered from article data */}
          <VideoHighlights videoArticles={videoArticles} />

          {/* Latest Updates Section & Sidebar */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 py-4 border-t border-slate-100">
            
            {/* Left/Main Column */}
            <div className="lg:col-span-2">
              <LatestUpdatesFeed articles={standardArticles} />
            </div>

            {/* Right/Sidebar Column (stacks below on mobile) */}
            <aside className="space-y-6 lg:col-span-1">
              
              {/* Mobile-only Newsletter (shows above sidebar widgets on mobile) */}
              <div className="lg:hidden">
                <NewsletterWidget isMobile={true} />
              </div>

              <MoreLiveCoverageWidget events={tickerItems} />
              
              {/* Latest News */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
                <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6">Latest News</h3>
                <div className="space-y-6">
                  {sidebarLatestArticles.map((art, idx) => (
                    <Link prefetch={true} key={art.id} href={art.cluster_slug || art.clusterSlug ? `/${art.cluster_slug || art.clusterSlug}/${art.slug}` : `/${art.slug}`} className="group block">
                      <div className={`text-xs font-bold mb-1 ${idx === 0 ? 'text-tertiary' : 'text-slate-500'}`}>
                        {getTimeAgo(art.published_at || art.created_at)}
                      </div>
                      <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">
                        {art.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Most Viewed */}
              <div>
                <h3 className="font-extrabold text-sm tracking-widest uppercase text-slate-900 mb-5 lg:mb-6">Most Viewed</h3>
                <div className="space-y-6 lg:space-y-8">
                  {sidebarMostViewed.map((art, idx) => (
                    <Link prefetch={true} key={art.id} href={art.cluster_slug || art.clusterSlug ? `/${art.cluster_slug || art.clusterSlug}/${art.slug}` : `/${art.slug}`} className="flex gap-4 group">
                      <span className="text-3xl font-black text-slate-200 headline-font italic">{String(idx + 1).padStart(2, '0')}</span>
                      <div>
                        <h4 className="text-sm font-bold leading-snug text-slate-800 group-hover:text-primary transition-colors">{art.title}</h4>
                        <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{art.categoryLabel}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Desktop Newsletter Card (shows at bottom of sidebar on desktop) */}
              <div className="hidden lg:block">
                <NewsletterWidget isMobile={false} />
              </div>

            </aside>
          </section>

          {/* Trust Section: Trusted Authority — uses first article image */}
          <section className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-slate-200 shadow-sm overflow-hidden rounded-xl">
              <div className="h-48 md:h-80 lg:h-auto overflow-hidden relative min-h-[200px]">
                <Image className="w-full h-full object-cover" src="/images/trusted-authority.jpg" alt="Your Trusted Authority" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 self-start mb-4 md:mb-6 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  <span className="material-symbols-outlined text-sm">fact_check</span> Fact-Checked Reporting
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold headline-font mb-3 md:mb-4 leading-tight text-slate-900">Your Real-Time Source on US Immigration</h2>
                <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">We deliver fast, fact-checked analysis of shifting U.S. immigration policies, visa updates, and procedural changes — updated 24/7.</p>
                <div className="flex items-center gap-6 md:gap-8">
                  <div>
                    <p className="text-xl md:text-2xl font-extrabold text-primary headline-font">Updated</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">EVERY HOUR</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div>
                    <p className="text-xl md:text-2xl font-extrabold text-primary headline-font">24/7</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">POLICY TRACKING</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>

    <FloatingShareButton />
  </>);
}
