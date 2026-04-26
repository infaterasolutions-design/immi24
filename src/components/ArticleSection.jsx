"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarWidgets from "./SidebarWidgets";

const FALLBACK_IMAGE = "/images/logo.png";

export default function ArticleSection({ article, isFirst = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Build the full public URL for this article
  const getArticleUrl = () => {
    if (typeof window === 'undefined') return '';
    // Use env-based production URL if available, otherwise use current page URL
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteBase) {
      const path = article.slug ? `/${article.slug}` : `/article/${article.id}`;
      return `${siteBase.replace(/\/$/, '')}${path}`;
    }
    // Fallback: use the actual browser URL the user is on right now
    return window.location.href;
  };

  const handleShare = (platform) => {
    const url = getArticleUrl();
    const title = article.title || '';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        break;
      case 'twitter':
        shareUrl = `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0ARead more: ${encodedUrl}`;
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, 'share_popup', 'width=600,height=500,scrollbars=yes,resizable=yes,noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = getArticleUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Decode Tiptap's escaped HTML embeds directly before rendering
  const decodedContent = useMemo(() => {
    if (!article.contentHtml) return "";
    return article.contentHtml.replace(
      /<div class="html-embed-content">([\s\S]*?)<\/div>/g,
      (match, p1) => {
        const unescaped = p1
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#34;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#x27;/g, "'");
        return `<div class="html-embed-content">${unescaped}</div>`;
      }
    );
  }, [article.contentHtml]);

  useEffect(() => {
    if (!decodedContent) return;

    const initScripts = () => {
      // 1. Extract and execute any scripts embedded within the HTML (e.g. Instagram embed.js)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = decodedContent;
      const scripts = tempDiv.querySelectorAll("script");
      
      scripts.forEach(oldScript => {
        // Prevent duplicate global scripts
        if (oldScript.src && document.querySelector(`script[src="${oldScript.src}"]`)) return;
        
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        document.body.appendChild(newScript);
      });

      // 2. Load external SDKs if embeds exist
      if (decodedContent.includes('twitter-tweet') && !window.twttr) {
        const s = document.createElement('script');
        s.src = 'https://platform.twitter.com/widgets.js';
        s.async = true;
        document.body.appendChild(s);
      } else if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }

      if (decodedContent.includes('instagram-media') && !window.instgrm) {
        const s = document.createElement('script');
        s.src = 'https://www.instagram.com/embed.js';
        s.async = true;
        document.body.appendChild(s);
      } else if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    const articleEl = document.getElementById(`article-${article.id}`);
    if (!articleEl) return;

    // Use IntersectionObserver to only load scripts when article is near viewport
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        initScripts();
        observer.disconnect();
      }
    }, { rootMargin: "600px" });

    observer.observe(articleEl);

    return () => observer.disconnect();
  }, [decodedContent, article.id]);

  if (!article) return null;

  return (
    <div id={`article-${article.id}`} className="article-wrapper" data-article-id={article.id} data-article-slug={article.slug}>
      <article className={`grid grid-cols-1 lg:grid-cols-8 gap-8 md:gap-12 relative ${!isFirst ? 'mt-4 md:mt-6 pt-4 border-t-2 border-slate-100' : ''}`}>
        {/* Floating Social Interaction Bar (Desktop) */}
        <aside className="hidden lg:flex flex-col items-end pt-[190px] pr-2 xl:pr-6 lg:col-span-1">
          <div className="sticky top-32 flex flex-col gap-4">
             <button
               onClick={() => setIsLiked(!isLiked)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                 isLiked ? 'bg-primary text-white border-primary scale-110' : 'bg-transparent text-slate-500 border-slate-200 hover:text-primary hover:border-primary'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">thumb_up</span>
             </button>
             <button
               onClick={() => setIsSaved(!isSaved)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                 isSaved ? 'bg-amber-500 text-white border-amber-500 scale-110' : 'bg-transparent text-slate-500 border-slate-200 hover:text-amber-500 hover:border-amber-500'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">{isSaved ? 'bookmark_added' : 'bookmark'}</span>
             </button>
             <button
               onClick={() => setShowShareMenu(!showShareMenu)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                 showShareMenu ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-500 border-slate-200 hover:text-primary hover:border-primary'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">share</span>
             </button>
          </div>
        </aside>

        {/* Article Section */}
        <div className="lg:col-span-7">
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
                    {article.subCategorySlug.toUpperCase().replace(/-/g, ' ')}
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

          {/* Subtitle (Short Description) */}
          {article.subTitle && (
            <p className="text-[20px] md:text-[24px] text-slate-500 leading-[1.35] mb-8 font-normal font-headline pr-4 lg:pr-12 line-clamp-3">
              {article.subTitle}
            </p>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-4 md:mb-5 pb-4 md:pb-5 border-b border-slate-100">
            <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
              {article.authorImage ? (
                <Image 
                  width={56} height={56}
                  alt={article.authorName}
                  className="w-full h-full object-cover" 
                  src={article.authorImage}
                />
              ) : (
                <span className="text-xl font-bold text-primary">
                  {(article.authorName || "A").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center gap-1.5">
              <div className="text-slate-900 font-bold text-[16px] leading-none">{article.authorName}</div>
              <div className="text-slate-500 text-[14px] leading-none">Washington, D.C. • MAR 14, 2024 at 10:00 AM EDT</div>
            </div>
          </div>

          {/* Action Bar (Above the image) */}
          <div className="flex justify-end gap-2 md:gap-3 mb-2 relative z-20 w-full">
             <button
               onClick={() => setIsLiked(!isLiked)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${
                 isLiked ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest text-slate-600 border-outline-variant/10 hover:text-primary'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">thumb_up</span>
             </button>
             <button
               onClick={() => setIsSaved(!isSaved)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${
                 isSaved ? 'bg-amber-500 text-white border-amber-500' : 'bg-surface-container-lowest text-slate-600 border-outline-variant/10 hover:text-amber-500'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">{isSaved ? 'bookmark_added' : 'bookmark'}</span>
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
                 <button onClick={() => handleShare('facebook')} className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <Image src="/social/facebook.jpeg" alt="Facebook" width={32} height={32} className="w-8 h-8 object-contain rounded border border-slate-100/50" />
                 </button>
                 <button onClick={() => handleShare('twitter')} className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <Image src="/social/X.jpg" alt="X" width={32} height={32} className="w-8 h-8 object-contain rounded-full border border-slate-100/50" />
                 </button>
                 <button onClick={() => handleShare('linkedin')} className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <Image src="/social/linkedin.png" alt="LinkedIn" width={32} height={32} className="w-8 h-8 object-contain rounded border border-slate-100/50" />
                 </button>
                 <button onClick={() => handleShare('email')} className="hover:-translate-y-1 transition-transform w-8 h-8 flex justify-center items-center">
                   <Image src="/social/mail.jpeg" alt="Email" width={32} height={32} className="w-8 h-8 object-contain rounded border border-slate-100/50" />
                 </button>
                 <div className="h-px w-6 bg-slate-200"></div>
                 <button onClick={handleCopyLink} className={`hover:-translate-y-1 transition-transform w-8 h-8 rounded-full flex justify-center items-center border ${
                   copySuccess ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-700 border-slate-200/50'
                 }`}>
                   <span className="material-symbols-outlined text-[18px]">{copySuccess ? 'check' : 'link'}</span>
                 </button>
               </div>
             </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl shadow-2xl shadow-slate-200/50 relative group">
            <div className="overflow-hidden rounded-xl">
              <Image 
                width={1200} height={675}
                alt={article.title}
                className="w-full aspect-[16/9] object-cover" 
                src={article.mainImage || FALLBACK_IMAGE}
                priority={isFirst}
              />
            </div>
            {article.imageCaption && (
              <div className="px-4 py-2 bg-surface-container-low text-on-surface-variant text-[11px] italic font-medium rounded-b-xl">
                {article.imageCaption}
              </div>
            )}
          </div>

          {/* Rich Text Content */}
          <div className={
            `relative overflow-hidden transition-[max-height] duration-[1500ms] ease-in-out ` +
            (isExpanded ? 'max-h-[50000px]' : 'max-h-[250px] md:max-h-[400px]')
          }>
            <div className={`prose prose-lg max-w-none font-body pb-8 md:pb-12 lg:pb-12 text-slate-800 mt-4`}>
              
              {decodedContent ? (
                 <div dangerouslySetInnerHTML={{ __html: decodedContent }} />
              ) : (
                <>
                  {article.paragraphs?.map((p, idx) => (
                    <p key={idx} className={idx === 0 ? "text-xl text-slate-900 leading-relaxed font-medium mb-8" : "mb-6"}>{p}</p>
                  ))}
                  
                  {article.quote && (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-slate-600 my-8">
                      {article.quote}
                    </blockquote>
                  )}
                
                  {article.subTitle && <h2 className="text-2xl font-bold mt-10 mb-4">{article.subTitle}</h2>}
                  
                  {article.subParagraphs?.map((p, idx) => (
                    <p key={`sub-${idx}`} className="mb-6">{p}</p>
                  ))}
                </>
              )}

              {article.id === "1" && !decodedContent && (
                <div className="my-10 p-8 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <h3 className="font-headline font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                    Key Deadlines to Remember
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Registration Window:</strong> Opens March 1st at 12:00 PM ET.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Account Setup:</strong> MyUSCIS accounts should be updated by Feb 15th.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tags area now flows naturally within the expander, but hidden when collapsed */}
            <div className={`mt-6 mb-4 flex flex-wrap gap-2 pt-6 border-t border-outline-variant/20 ${!isExpanded ? 'hidden' : 'flex'}`}>
              {article.tags?.map((tag) => (
                 <span key={tag} className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant">#{tag}</span>
              ))}
            </div>
            
            {/* Gradient Overlay & Button */}
            <div className={
              `w-full flex items-end justify-center transition-opacity duration-1000 ` +
              (isExpanded ? 'opacity-0 pointer-events-none ' : 'opacity-100 ') +
              `absolute bottom-0 left-0 right-0 h-48 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent z-10`
            }>
              <button 
                onClick={() => setIsExpanded(true)}
                className="px-8 py-3 bg-primary text-white font-bold tracking-widest uppercase text-sm shadow-xl rounded-full hover:scale-105 transition-transform outline-none"
              >
                Keep Reading
              </button>
            </div>
          </div>

          {/* Next Article Separator */}
          <div className="mt-6 mb-2 w-full relative flex items-center justify-center border-t-2 border-dashed border-outline-variant/30">
             <span className="-top-4 absolute bg-[#F9FAFB] px-6 text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 border border-slate-200 rounded-full py-1.5 shadow-sm z-10">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Next Article
             </span>
          </div>

        </div>
      </article>
    </div>
  );
}
