"use client";

import { useState } from "react";
import Link from "next/link";

export default function LatestUpdatesFeed({ articles }) {
  const [visibleCount, setVisibleCount] = useState(10);
  
  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  return (
    <div className="lg:col-span-2 space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight text-slate-900">
        Latest Updates
      </h2>
      
      {visibleArticles.map((article, index) => (
        <article 
          key={article.id} 
          className={`group pb-4 md:pb-6 border-b border-slate-100 flex gap-3 md:gap-6 cursor-pointer ${index >= 10 ? 'animate-slowMotionFade opacity-0' : ''}`}
        >
          <Link href={`/article/${article.id}`} className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{article.categoryLabel || article.category}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">{article.date}</span>
            </div>
            <h3 className="text-base md:text-lg font-bold headline-font group-hover:text-primary transition-colors mb-1 md:mb-2 text-slate-900 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 hidden sm:block">
              {article.paragraphs[0] || article.imageCaption}
            </p>
          </Link>
          <Link href={`/article/${article.id}`} className="w-[110px] h-[75px] md:w-[190px] md:h-[125px] overflow-hidden flex-shrink-0 block">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" src={article.mainImage} alt="News Image" />
          </Link>
        </article>
      ))}

      {hasMore && (
        <button 
          onClick={loadMore}
          className="w-full py-4 mt-4 bg-slate-50 font-bold text-[11px] tracking-widest text-primary hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200 uppercase rounded-md shadow-sm"
        >
          Load More Stories
        </button>
      )}
    </div>
  );
}
