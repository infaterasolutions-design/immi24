"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ArticleSection({ article, isFirst = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!article) return null;

  return (
    <div id={`article-${article.id}`} className="article-wrapper" data-article-id={article.id}>
      <main className={`pt-4 md:pt-8 pb-0 px-3 md:px-8 max-w-[1100px] lg:px-20 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 relative ${!isFirst ? 'mt-6 md:mt-8' : ''}`}>
        {/* Article Section */}
        <article className="lg:col-span-8">
          {/* Breadcrumbs / Category > Subcategory */}
          <div className="flex items-center gap-2 mb-4 md:mb-6 flex-wrap">
            <Link href={`/category/${article.categorySlug}`} className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label hover:bg-primary hover:text-white transition-colors">
              {article.categorySlug === "visa-news" ? "Visa News" : 
               article.categorySlug === "visa-guides" ? "Visa Guides" : 
               article.categorySlug === "processing-times" ? "Processing Times" : 
               article.categorySlug === "visa-bulletin" ? "Visa Bulletin" : 
               article.categorySlug === "fee-calculator" ? "Fee Calculator" : 
               article.categorySlug === "tools" ? "Tools" : 
               article.categorySlug === "about" ? "About" : article.categorySlug}
            </Link>
            {article.subCategorySlug && (
              <>
                <span className="material-symbols-outlined text-slate-400 text-[14px]">chevron_right</span>
                <Link href={`/category/${article.categorySlug}/${article.subCategorySlug}`} className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">
                  {article.categoryLabel}
                </Link>
              </>
            )}
            <span className="text-outline-variant text-xs">•</span>
            <span className="text-on-surface-variant text-xs font-medium">{article.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold font-headline leading-[1.1] text-on-surface mb-5 md:mb-8 tracking-tight">
            {article.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 pb-6 md:pb-8 border-b border-outline-variant/20">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
              <img 
                alt={article.authorName}
                className="w-full h-full object-cover" 
                src={article.authorImage}
              />
            </div>
            <div>
              <div className="text-on-surface font-bold text-sm">{article.authorName}</div>
              <div className="text-on-surface-variant text-xs">{article.authorRole} • {article.date}</div>
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
               
               {/* Share Dropdown (Slow motion & Icons only) */}
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
          <aside className="lg:col-span-4 space-y-12">
          {/* Sticky Sidebar Content */}
          <div className="sticky top-32 space-y-12">
            {/* Latest News Sidebar */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6">Latest News</h3>
              <div className="space-y-6">
                <Link href="#" className="group block">
                  <div className="text-xs font-bold text-tertiary mb-1">BREAKING</div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">Supreme Court to review DACA Work Authorization limits in 2025.</h4>
                </Link>
                <Link href="#" className="group block">
                  <div className="text-xs font-bold text-slate-500 mb-1">2 HOURS AGO</div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">USCIS expands premium processing for O-1 and O-2 visas.</h4>
                </Link>
                <Link href="#" className="group block">
                  <div className="text-xs font-bold text-slate-500 mb-1">5 HOURS AGO</div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">New processing times released for I-485 applications in California.</h4>
                </Link>
              </div>
            </div>

            {/* Most Viewed */}
            <div>
              <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-on-surface mb-6">Most Viewed</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <span className="text-3xl font-black text-outline-variant/30 font-headline italic">01</span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-800">The Ultimate Guide to Green Card Marriage Interviews</h4>
                    <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tighter">Green Card • 12k views</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-3xl font-black text-outline-variant/30 font-headline italic">02</span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-800">5 Common Mistakes in EB-2 NIW Personal Statements</h4>
                    <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tighter">Work Permit • 9.4k views</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-3xl font-black text-outline-variant/30 font-headline italic">03</span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-800">How to Expedite Your Citizenship Application</h4>
                    <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tighter">Citizenship • 7.1k views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Box */}
            <div className="bg-primary rounded-2xl p-8 text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden mt-6">
              <div className="relative z-10">
                <span className="material-symbols-outlined mb-4" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
                <h3 className="font-headline font-bold text-xl mb-2 text-white">Editorial Digest</h3>
                <p className="text-sm text-white/80 leading-relaxed mb-6">Stay updated with critical immigration law changes delivered to your inbox weekly.</p>
                <form className="space-y-3">
                  <input className="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-sm placeholder:text-white/40 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all text-white" placeholder="Email address" type="email" />
                  <button type="button" className="w-full bg-white text-primary font-bold py-3 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                    Subscribe Now
                  </button>
                </form>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </aside>
        )}
      </main>
    </div>
  );
}
