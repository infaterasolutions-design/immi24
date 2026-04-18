"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarWidgets from "./SidebarWidgets";

export default function ArticleSection({ article, isFirst = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!article) return null;

  return (
    <div id={`article-${article.id}`} className="article-wrapper" data-article-id={article.id}>
      <main className={`pt-4 md:pt-8 pb-0 px-3 md:px-4 lg:px-24 max-w-[1298px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative ${!isFirst ? 'mt-6 md:mt-8' : ''}`}>
        {/* Un-clickable Floating Social Interaction Bar (Desktop) */}
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

        {/* Article Section */}
        <article className="lg:col-span-7">
          {/* Breadcrumbs / Category > Subcategory */}
          <div className="flex items-center gap-3 mb-5 md:mb-6 flex-wrap">
            <div className="bg-[#eef2ff] text-[#1e3a8a] px-3 py-1.5 rounded flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-sans">
              <Link href={`/category/${article.categorySlug}`} className="hover:opacity-80 transition-opacity">
                {article.categorySlug === "visa-news" ? "VISA NEWS" : 
                 article.categorySlug === "visa-guides" ? "VISA GUIDES" : 
                 article.categorySlug === "about" ? "ABOUT" : article.categorySlug.toUpperCase().replace('-', ' ')}
              </Link>
              {article.subCategorySlug && (
                <>
                  <span className="text-[#1e3a8a]/40 text-xs leading-none relative -top-[1px]">|</span>
                  <Link href={`/category/${article.categorySlug}/${article.subCategorySlug}`} className="hover:opacity-80 transition-opacity">
                    {article.categoryLabel.toUpperCase()}
                  </Link>
                </>
              )}
            </div>
            <span className="text-slate-300 mx-1 text-[8px]">●</span>
            <span className="text-slate-500 text-sm font-medium">{article.readTime}</span>
          </div>

          {/* Title styling matched to Live Updates */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-headline tracking-tighter text-slate-900 mb-5 leading-[1.1]">
            {article.title}
          </h1>

          {/* Subtitle (Medium Style Description) */}
          {article.paragraphs && article.paragraphs[0] && (
            <p className="text-[20px] md:text-[24px] text-slate-500 leading-[1.35] mb-8 font-normal font-headline pr-4 lg:pr-12 line-clamp-3">
              {article.paragraphs[0]}
            </p>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-slate-100">
            <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-100 shrink-0">
              <img 
                alt={article.authorName}
                className="w-full h-full object-cover" 
                src={article.authorImage}
              />
            </div>
            <div className="flex flex-col justify-center gap-1.5">
              <div className="text-slate-900 font-bold text-[16px] leading-none">{article.authorName}</div>
              <div className="text-slate-500 text-[14px] leading-none">Washington, D.C. • MAR 14, 2024 at 10:00 AM EDT</div>
            </div>
          </div>

          {/* Action Bar (Above the image) */}
          <div className="flex justify-end gap-2 md:gap-3 mb-3 md:mb-4 relative z-20 w-full">
             <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest text-slate-600 hover:text-primary transition-all shadow-sm border border-outline-variant/10">
               <span className="material-symbols-outlined text-[20px]">thumb_up</span>
             </button>
             <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest text-slate-600 hover:text-primary transition-all shadow-sm border border-outline-variant/10">
               <span className="material-symbols-outlined text-[20px]">bookmark</span>
             </button>
             <div className="relative">
               <button 
                 onClick={() => setShowShareMenu(!showShareMenu)}
                 className={`w-10 h-10 rounded-full flex items-center justify-center ${showShareMenu ? 'bg-primary text-white' : 'bg-surface-container-lowest text-slate-600'} hover:text-white hover:bg-primary transition-all shadow-sm border border-outline-variant/10`}
               >
                 <span className="material-symbols-outlined text-[20px]">share</span>
               </button>
               
               {/* Share Dropdown */}
               <div className={`absolute top-12 right-0 mt-2 bg-white rounded-full shadow-2xl border border-slate-200 p-3 flex flex-col items-center gap-4 z-30 transition-all duration-700 ease-out origin-top-right ${showShareMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                 <button className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <img src="/social/facebook.jpeg" alt="Facebook" className="w-8 h-8 object-contain rounded border border-slate-100/50" />
                 </button>
                 <button className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <img src="/social/X.jpg" alt="X" className="w-8 h-8 object-contain rounded-full border border-slate-100/50" />
                 </button>
                 <button className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <img src="/social/linkedin.png" alt="LinkedIn" className="w-8 h-8 object-contain rounded border border-slate-100/50" />
                 </button>
                 <button className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <img src="/social/mail.jpeg" alt="Email" className="w-8 h-8 object-contain rounded border border-slate-100/50" />
                 </button>
                 <div className="h-px w-6 bg-slate-200"></div>
                 <button className="hover:-translate-y-1 transition-transform w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex justify-center items-center border border-slate-200/50">
                   <span className="material-symbols-outlined text-[18px]">link</span>
                 </button>
               </div>
             </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 md:mb-12 rounded-xl shadow-2xl shadow-slate-200/50 relative group">
            <div className="overflow-hidden rounded-xl">
              <img 
                alt={article.title}
                className="w-full aspect-[16/9] object-cover" 
                src={article.mainImage}
              />
            </div>
            <div className="p-4 bg-surface-container-low text-on-surface-variant text-[11px] italic font-medium rounded-b-xl">
              {article.imageCaption}
            </div>
          </div>

          {/* Rich Text Content */}
          <div className={`relative overflow-hidden transition-[max-height] duration-[1500ms] ease-in-out ${isExpanded ? 'max-h-[5000px]' : 'max-h-[250px]'}`}>
            <div className="prose max-w-none font-body text-base md:text-lg pb-8 md:pb-12">
              {article.paragraphs?.map((p, idx) => (
                <p key={idx} className={idx === 0 ? "text-xl text-on-surface leading-relaxed font-medium mb-8" : ""}>{p}</p>
              ))}
              
              {article.quote && (
                 <blockquote className="border-l-4 border-primary">
                   {article.quote}
                 </blockquote>
              )}
             
              {article.subTitle && <h2>{article.subTitle}</h2>}
              
              {article.subParagraphs?.map((p, idx) => (
                 <p key={idx}>{p}</p>
              ))}
              
              {article.id === "1" && ( /* Example custom block only embedded in certain articles, just matching our mock UI */
                <div className="my-10 p-8 rounded-2xl bg-primary-container/5 border border-primary-container/10">
                  <h3 className="font-headline font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                    Key Deadlines to Remember
                  </h3>
                  <ul className="space-y-3 text-sm text-on-surface-variant">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Registration Window:</strong> Opens March 1st at 12:00 PM ET.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Account Setup:</strong> MyUSCIS accounts should be updated by Feb 15th.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tags area now flows naturally within the expander */}
            <div className="mt-8 mb-12 flex flex-wrap gap-2 pt-8 border-t border-outline-variant/20">
              {article.tags?.map((tag) => (
                 <span key={tag} className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant">#{tag}</span>
              ))}
            </div>
            
            {/* Gradient Overlay & Button (Fades out smoothly) */}
            <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-4 z-10 w-full transition-opacity duration-1000 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button 
                onClick={() => setIsExpanded(true)}
                className="px-8 py-3 bg-primary text-white font-bold tracking-widest uppercase text-sm shadow-xl rounded-full hover:scale-105 transition-transform outline-none"
              >
                Keep Reading
              </button>
            </div>
          </div>

          {/* Next Article Separator */}
          <div className="mt-6 md:mt-8 mb-3 md:mb-4 w-full relative flex items-center justify-center border-t-2 border-dashed border-outline-variant/30">
             <span className="-top-4 absolute bg-[#F9FAFB] px-6 text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 border border-slate-200 rounded-full py-1.5 shadow-sm z-10">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Next Article
             </span>
          </div>

        </article>

        {/* Sidebar Section (Only rendered on the first article) */}
        {isFirst && (
          <SidebarWidgets className="hidden lg:block lg:col-span-4" />
        )}
      </main>
    </div>
  );
}
