"use client";

import Link from "next/link";
import { useState } from "react";
import MoreLiveCoverageWidget from "./MoreLiveCoverageWidget";

// Strip HTML tags to get clean plain text for card descriptions
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function getExcerpt(article) {
  if (article.subTitle) return article.subTitle;
  if (article.paragraphs && article.paragraphs[0]) return stripHtml(article.paragraphs[0]);
  if (article.imageCaption) return article.imageCaption;
  return "";
}
export default function CategoryFeed({ title, description, articles }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };
  return (
    <div className="max-w-[1298px] mx-auto px-3 md:px-4 lg:px-24 py-6 md:py-8 mb-12">
      
      {/* Header Section */}
      <div className="mb-6 md:mb-10 pb-4 md:pb-6 border-b border-slate-200">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold headline-font text-slate-900 mb-2 md:mb-4">{title}</h1>
        {description && (
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed max-w-3xl">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
        {/* Main Feed */}
        <div className="lg:col-span-8">
           {articles.length === 0 ? (
             <div className="text-slate-500 py-10 text-center bg-slate-50 rounded-xl border border-slate-100">
               No articles found in this category yet.
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               {articles.slice(0, visibleCount).map((article) => (
                 <Link href={`/${article.slug}`} key={article.id} className="group flex flex-col space-y-3 md:space-y-4 cursor-pointer block border border-transparent hover:border-slate-100 pb-4 rounded-xl transition-all hover:shadow-lg bg-white">
                   <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl w-full">
                     <img 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                       src={article.mainImage} 
                       alt={article.title} 
                     />
                     <div className="absolute top-3 left-3 bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest rounded-sm shadow-md">
                        {article.categoryLabel || article.category}
                     </div>
                   </div>
                   <div className="px-3 md:px-4 space-y-2 md:space-y-3 flex-grow border-x border-b border-transparent group-hover:border-slate-100 rounded-b-xl transition-all">
                     <h3 className="text-lg md:text-xl font-extrabold headline-font leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-3">
                       {article.title}
                     </h3>
                     <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                       {getExcerpt(article)}
                     </p>
                     <div className="flex items-center gap-3 pt-3 md:pt-4 text-[11px] text-slate-500 font-medium tracking-widest uppercase border-t border-slate-100 mt-auto">
                        <span className="flex items-center gap-1.5 text-primary"><span className="material-symbols-outlined text-[14px]">schedule</span> {article.readTime}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
           )}

           {articles.length > visibleCount && (
             <div className="mt-10 flex justify-center">
               <button 
                 onClick={handleLoadMore}
                 className="bg-primary text-on-primary px-8 py-3 font-headline font-bold text-xs tracking-widest uppercase hover:bg-blue-800 transition-all rounded-full flex items-center gap-2"
               >
                 Load More Articles
                 <span className="material-symbols-outlined text-[18px]">expand_more</span>
               </button>
             </div>
           )}

           {/* Mobile Ad Slot between feed and sidebar */}
           <div className="mobile-ad-slot mt-6">
             <div className="bg-slate-50 border border-slate-200 p-4 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sponsored</div>
           </div>
        </div>

        {/* Right Sidebar Widget — hidden on mobile */}
        <aside className="lg:col-span-4 space-y-12 hidden lg:block">
          <div className="space-y-12">
            
            <MoreLiveCoverageWidget />
            
            {/* Latest News Sidebar */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50">
              <h3 className="font-extrabold text-sm tracking-widest uppercase text-primary mb-6 border-b border-slate-200 pb-3">Latest News</h3>
              <div className="space-y-5">
                <Link href="/article/6" className="group block">
                  <div className="text-[10px] font-bold text-rose-600 tracking-widest uppercase mb-1">BREAKING</div>
                  <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors text-slate-800">Supreme Court to review DACA Work Authorization limits in 2025.</h4>
                </Link>
                <div className="h-px w-full bg-slate-200/60"></div>
                <Link href="/article/7" className="group block">
                  <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">2 HOURS AGO</div>
                  <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors text-slate-800">USCIS expands premium processing for O-1 and O-2 visas.</h4>
                </Link>
                <div className="h-px w-full bg-slate-200/60"></div>
                <Link href="/article/10" className="group block">
                  <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">5 HOURS AGO</div>
                  <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors text-slate-800">New processing times released for I-485 applications in California.</h4>
                </Link>
              </div>
            </div>

            {/* Most Viewed */}
            <div>
              <h3 className="font-extrabold text-sm tracking-widest uppercase text-slate-900 mb-6">Most Viewed</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <span className="text-3xl font-black text-slate-200 headline-font italic">01</span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-800">The Ultimate Guide to Green Card Marriage Interviews</h4>
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Green Card • 12k views</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-3xl font-black text-slate-200 headline-font italic">02</span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-800">5 Common Mistakes in EB-2 NIW Personal Statements</h4>
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Work Permit • 9.4k views</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-3xl font-black text-slate-200 headline-font italic">03</span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-800">How to Expedite Your Citizenship Application</h4>
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Citizenship • 7.1k views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Box */}
            <div className="bg-primary rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mt-6">
              <div className="relative z-10">
                <span className="material-symbols-outlined mb-4 text-3xl opacity-90" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
                <h3 className="font-extrabold text-xl mb-2 headline-font">Global Briefing</h3>
                <p className="text-sm text-white/90 leading-relaxed mb-6">Stay updated with critical immigration law changes delivered to your inbox weekly.</p>
                <form onSubmit={handleSubscribe} className="space-y-3 relative">
                  <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-sm placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none transition-all" 
                    placeholder="Email address" 
                    type="email" 
                  />
                  <button type="submit" className="w-full bg-white text-primary font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">
                    {isSubscribed ? "Subscribed!" : "Subscribe Now"}
                  </button>
                  {isSubscribed && (
                    <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Welcome aboard.</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
