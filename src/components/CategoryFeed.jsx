"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SidebarWidgets from "./SidebarWidgets";

const FALLBACK_IMAGE = "/images/logo.png";

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
                     <Image 
                       width={600} height={400}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                       src={article.mainImage || FALLBACK_IMAGE} 
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
        <div className="lg:col-span-4 hidden lg:block">
          <SidebarWidgets showLiveCoverage={true} />
        </div>
      </div>
    </div>
  );
}
