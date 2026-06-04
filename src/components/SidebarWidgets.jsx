"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getSidebarData } from "@/app/actions/sidebar";
import { getLiveEventUrlMap, getLiveEventUrlFromMap } from "@/lib/liveEventUrls";

export default function SidebarWidgets({ className = "", showLiveCoverage = true, initialData }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [latestNews, setLatestNews] = useState(initialData?.latestNews || []);
  const [mostViewed, setMostViewed] = useState(initialData?.mostViewed || []);
  const [liveEvents, setLiveEvents] = useState(initialData?.liveEvents || []);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [urlMap, setUrlMap] = useState(null);

  useEffect(() => {
    getLiveEventUrlMap().then(setUrlMap);
  }, []);

  // Define outside useEffect so the Retry button can also call it
  const fetchSidebarData = useCallback(async () => {
    try {
      setFetchFailed(false);
      const { latestNews: latest, mostViewed: viewed, liveEvents: events } = await getSidebarData();
      setLatestNews(latest);
      setMostViewed(viewed);
      setLiveEvents(events);
    } catch (err) {
      console.error("Sidebar fetch failed:", err);
      setFetchFailed(true);
    }
  }, []);

  useEffect(() => {
    // Skip client-side fetch if we already have server-provided data
    if (initialData) return;

    let timeoutId;
    timeoutId = setTimeout(() => setFetchFailed(true), 10000);

    fetchSidebarData().finally(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, [initialData, fetchSidebarData]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      // Simulate API call
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  // Helper to format "X hours ago"
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

  return (
    <aside className={`space-y-12 ${className}`}>
      {/* Sticky Sidebar Content wrapper */}
      <div className="sticky top-32 space-y-12">
        {showLiveCoverage && liveEvents.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 mb-6">
            <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse-red"></span>
              More Live Coverage
            </h3>
            <div className="space-y-6">
              {liveEvents.slice(0, 4).map((event) => (
                <Link key={event.id} href={getLiveEventUrlFromMap(event.id, urlMap)} className="group block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">LATEST COVERAGE</span>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800 line-clamp-2">
                    {event.title}
                  </h4>
                  <span className="text-[10px] font-bold text-rose-600 tracking-widest mt-1 uppercase flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse-red inline-block"></span> Live Now
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Latest News Sidebar */}
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6">Latest News</h3>
          <div className="space-y-6">
            {latestNews.length > 0 ? latestNews.map((article, idx) => (
              <Link key={article.id} href={article.cluster_slug ? `/${article.cluster_slug}/${article.slug}` : (article.slug ? `/${article.slug}` : `/article/${article.id}`)} className="group block">
                <div className={`text-xs font-bold mb-1 ${idx === 0 ? 'text-tertiary' : 'text-slate-500'}`}>
                  {getTimeAgo(article.published_at)}
                </div>
                <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">
                  {article.title}
                </h4>
              </Link>
            )) : (
              <div className="text-sm text-slate-500">
                <p>{fetchFailed ? "Unable to load latest news." : "Loading latest news..."}</p>
                {fetchFailed && (
                  <button onClick={fetchSidebarData} className="mt-2 text-xs font-bold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Most Viewed */}
        <div>
          <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-on-surface mb-6">Most Viewed</h3>
          <div className="space-y-8">
            {mostViewed.length > 0 ? mostViewed.map((article, idx) => (
              <div key={article.id} className="flex gap-4">
                <span className="text-3xl font-black text-outline-variant/30 font-headline italic">0{idx + 1}</span>
                <div>
                  <Link href={article.cluster_slug ? `/${article.cluster_slug}/${article.slug}` : (article.slug ? `/${article.slug}` : `/article/${article.id}`)}>
                    <h4 className="text-sm font-bold leading-snug text-slate-800 hover:text-primary transition-colors cursor-pointer">{article.title}</h4>
                  </Link>
                  <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tighter">
                    {article.category_label || "Trending"} • {(12 - idx * 2.5).toFixed(1)}k views
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-slate-500">
                <p>{fetchFailed ? "Unable to load most viewed." : "Loading most viewed..."}</p>
                {fetchFailed && (
                  <button onClick={fetchSidebarData} className="mt-2 text-xs font-bold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="bg-primary rounded-2xl p-8 text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden mt-6">
          <div className="relative z-10">
            <span className="material-symbols-outlined mb-4" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
            <h3 className="font-headline font-bold text-xl mb-2 text-white">Editorial Digest</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6">Stay updated with critical immigration law changes delivered to your inbox weekly.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-sm placeholder:text-white/40 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all text-white" 
                placeholder="Email address" 
                type="email" 
              />
              <button type="submit" className="w-full bg-white text-primary font-bold py-3 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                {isSubscribed ? "Subscribed!" : "Subscribe Now"}
              </button>
              {isSubscribed && (
                <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Check your inbox.</p>
              )}
            </form>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </aside>
  );
}
