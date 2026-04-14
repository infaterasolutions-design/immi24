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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {visibleArticles.map((article, index) => (
          <article 
            key={article.id} 
            className={`group flex flex-col bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden cursor-pointer ${index >= 10 ? 'animate-slowMotionFade opacity-0' : ''}`}
          >
            {/* Massive Card Image */}
            <Link href={`/article/${article.id}`} className="aspect-[16/9] w-full overflow-hidden block relative">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                loading="lazy" 
                src={article.mainImage} 
                alt="News Image" 
              />
              <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm opacity-90">
                {article.categoryLabel || article.category}
              </div>
            </Link>
            
            {/* Card Content */}
            <Link href={`/article/${article.id}`} className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-slate-400 font-medium uppercase">{article.date}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold headline-font group-hover:text-primary transition-colors mb-2 text-slate-900 line-clamp-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {article.paragraphs[0] || article.imageCaption}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

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
