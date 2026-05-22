"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarWidgets from "./SidebarWidgets";
import RelatedArticles from "./RelatedArticles";
import { recordInteraction } from "@/app/actions/interactions";

import Breadcrumb from "./Breadcrumb";

const FALLBACK_IMAGE = "/images/logo.png";

export default function ArticleSection({ article, isFirst = false, customWidgets = { mid: [], end: [] } }) {
  const midArticles = customWidgets.mid || [];
  const endArticles = customWidgets.end || [];
  const [isExpanded, setIsExpanded] = useState(false);

  // Independent interaction states
  const [leftIsLiked, setLeftIsLiked] = useState(false);
  const [leftIsSaved, setLeftIsSaved] = useState(false);
  const [showLeftShare, setShowLeftShare] = useState(false);
  const [leftLikesCount, setLeftLikesCount] = useState(article.likes_count || 0);
  const [leftSavesCount, setLeftSavesCount] = useState(article.saves_count || 0);

  const [topIsLiked, setTopIsLiked] = useState(false);
  const [topIsSaved, setTopIsSaved] = useState(false);
  const [showTopShare, setShowTopShare] = useState(false);
  const [topLikesCount, setTopLikesCount] = useState(article.likes_count || 0);
  const [topSavesCount, setTopSavesCount] = useState(article.saves_count || 0);

  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    setLeftIsLiked(!!localStorage.getItem(`liked_left_${article.id}`));
    setLeftIsSaved(!!localStorage.getItem(`saved_left_${article.id}`));
    setTopIsLiked(!!localStorage.getItem(`liked_top_${article.id}`));
    setTopIsSaved(!!localStorage.getItem(`saved_top_${article.id}`));
  }, [article.id]);

  const handleInteraction = async (position, type) => {
    const storageKey = `${type}_${position}_${article.id}`;
    if (localStorage.getItem(storageKey)) return; // Prevent multiple interactions

    localStorage.setItem(storageKey, "true");

    // Optimistic UI update
    if (position === "left") {
      if (type === "like") { setLeftIsLiked(true); setLeftLikesCount(c => c + 1); }
      if (type === "save") { setLeftIsSaved(true); setLeftSavesCount(c => c + 1); }
    } else {
      if (type === "like") { setTopIsLiked(true); setTopLikesCount(c => c + 1); }
      if (type === "save") { setTopIsSaved(true); setTopSavesCount(c => c + 1); }
    }

    // Server action
    await recordInteraction(article.id, type);
  };

  // Build the full public URL for this article
  const getArticleUrl = () => {
    if (typeof window === 'undefined') return '';
    // Use env-based production URL if available, otherwise use current page URL
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteBase) {
      const path = article.cluster_slug
        ? `/${article.cluster_slug}/${article.slug}`
        : (article.slug ? `/${article.slug}` : `/article/${article.id}`);
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
        setShowLeftShare(false);
        setShowTopShare(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, 'share_popup', 'width=600,height=500,scrollbars=yes,resizable=yes,noopener,noreferrer');
    setShowLeftShare(false);
    setShowTopShare(false);
    recordInteraction(article.id, "share");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowLeftShare(false);
        setShowTopShare(false);
      }, 2000);
    } catch {
      const input = document.createElement('input');
      input.value = getArticleUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowLeftShare(false);
        setShowTopShare(false);
      }, 2000);
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

  // Ensure all links inside article content open in a new tab
  useEffect(() => {
    const articleEl = document.getElementById(`article-${article.id}`);
    if (!articleEl) return;
    const links = articleEl.querySelectorAll('.prose a[href]');
    links.forEach((link) => {
      // Only set for links that don't already have an explicit target
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  if (!article) return null;

  return (
    <div id={`article-${article.id}`} className="article-wrapper" data-article-id={article.id} data-article-slug={article.cluster_slug ? `${article.cluster_slug}/${article.slug}` : article.slug}>
      <article className={`grid grid-cols-1 lg:grid-cols-8 gap-8 md:gap-12 relative ${!isFirst ? 'mt-4 md:mt-6 pt-4 border-t-2 border-slate-100' : ''}`}>
        {/* Floating Social Interaction Bar (Desktop) */}
        <aside className="hidden lg:flex flex-col items-end pt-[190px] pr-2 xl:pr-6 lg:col-span-1">
          <div className="sticky top-32 flex flex-col gap-4">
             <button
               onClick={() => handleInteraction("left", "like")}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                 leftIsLiked ? 'bg-primary text-white border-primary scale-110' : 'bg-transparent text-slate-500 border-slate-200 hover:text-primary hover:border-primary'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">thumb_up</span>
             </button>
             <button
               onClick={() => handleInteraction("left", "save")}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                 leftIsSaved ? 'bg-amber-500 text-white border-amber-500 scale-110' : 'bg-transparent text-slate-500 border-slate-200 hover:text-amber-500 hover:border-amber-500'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">{leftIsSaved ? 'bookmark_added' : 'bookmark'}</span>
             </button>
             <button
               onClick={() => {
                 const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                 if (isMobile && navigator.share) {
                   navigator.share({
                     title: article.title || "Article",
                     url: getArticleUrl(),
                   }).then(() => recordInteraction(article.id, "share")).catch((err) => console.log("Share canceled", err));
                 } else {
                   setShowLeftShare(!showLeftShare);
                 }
               }}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                 showLeftShare ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-500 border-slate-200 hover:text-primary hover:border-primary'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">share</span>
             </button>
          </div>
        </aside>

        {/* Article Section */}
        <div className="lg:col-span-7">
          {/* Breadcrumbs / Category > Subcategory OR Cluster */}
          <Breadcrumb
            category={
              article.cluster_slug
                ? { name: article.clusterDisplayName || article.cluster_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), slug: article.cluster_slug }
                : (article.categorySlug ? { name: article.categoryLabel || article.categorySlug, slug: article.categorySlug } : null)
            }
            subcategory={
              !article.cluster_slug && article.subCategorySlug
                ? { name: article.subCategorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), slug: article.subCategorySlug }
                : null
            }
            articleTitle={article.title}
          />
          <div className="flex items-center gap-3 mb-5 md:mb-3 flex-wrap">
            {article.cluster_slug ? (
              <div className="bg-[#eef2ff] text-[#1e3a8a] px-3 py-1.5 rounded flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-sans">
                <Link href={`/${article.cluster_slug}/`} className="hover:opacity-80 transition-opacity">
                  {article.clusterDisplayName || article.cluster_slug.toUpperCase().replace(/-/g, ' ')}
                </Link>
              </div>
            ) : article.categorySlug ? (
              <div className="bg-[#eef2ff] text-[#1e3a8a] px-3 py-1.5 rounded flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-sans">
                <Link href={`/${article.categorySlug}/`} className="hover:opacity-80 transition-opacity">
                  {article.categoryLabel || article.categorySlug.toUpperCase().replace(/-/g, ' ')}
                </Link>
                {article.subCategorySlug && (
                  <>
                    <span className="text-[#1e3a8a]/40 text-xs leading-none relative -top-[1px]">|</span>
                    <Link href={`/${article.categorySlug}/${article.subCategorySlug}/`} className="hover:opacity-80 transition-opacity">
                      {article.subCategorySlug.toUpperCase().replace(/-/g, ' ')}
                    </Link>
                  </>
                )}
              </div>
            ) : null}
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
          <div className="flex items-center gap-4 mb-1 pb-2 border-b border-slate-100">
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
              <div className="text-slate-500 text-[14px] leading-none">{(() => {
                const d = article.published_at ? new Date(article.published_at) : null;
                if (!d) return article.date || "";
                const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                const day = d.getDate();
                const year = d.getFullYear();
                const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                const tz = d.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop();
                return `${month} ${day}, ${year} at ${time} ${tz}`;
              })()}</div>
            </div>
          </div>

          {/* Location Badge — styled like category breadcrumb */}
          {article.location && (
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="bg-[#eef2ff] text-[#1e3a8a] px-3 py-1.5 rounded flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-sans">
                <span className="text-sm leading-none">📍</span>
                {article.location.parentSlug ? (
                  <>
                    <Link href={`/${article.location.parentSlug}`} className="hover:opacity-80 transition-opacity">
                      {article.location.parentName}
                    </Link>
                    <span className="text-[#1e3a8a]/40 text-xs leading-none relative -top-[1px]">|</span>
                    <Link href={`/${article.location.parentSlug}/${article.location.slug}`} className="hover:opacity-80 transition-opacity">
                      {article.location.name}
                    </Link>
                  </>
                ) : (
                  <Link href={`/${article.location.slug}`} className="hover:opacity-80 transition-opacity">
                    {article.location.name}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Action Bar (Above the image) */}
          <div className="flex justify-end gap-2 md:gap-3 mb-2 relative z-20 w-full">
             <button
               onClick={() => handleInteraction("top", "like")}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${
                 topIsLiked ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest text-slate-600 border-outline-variant/10 hover:text-primary'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">thumb_up</span>
             </button>
             <button
               onClick={() => handleInteraction("top", "save")}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${
                 topIsSaved ? 'bg-amber-500 text-white border-amber-500' : 'bg-surface-container-lowest text-slate-600 border-outline-variant/10 hover:text-amber-500'
               }`}
             >
               <span className="material-symbols-outlined text-[20px]">{topIsSaved ? 'bookmark_added' : 'bookmark'}</span>
             </button>
             <div className="relative">
               <button 
                 onClick={() => {
                   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                   if (isMobile && navigator.share) {
                     navigator.share({
                       title: article.title || "Article",
                       url: getArticleUrl(),
                     }).then(() => recordInteraction(article.id, "share")).catch((err) => console.log("Share canceled", err));
                   } else {
                     setShowTopShare(!showTopShare);
                   }
                 }}
                 onBlur={() => setTimeout(() => setShowTopShare(false), 200)}
                 className={`w-10 h-10 rounded-full flex items-center justify-center ${showTopShare ? 'bg-primary text-white' : 'bg-surface-container-lowest text-slate-600'} hover:text-white hover:bg-primary transition-all shadow-sm border border-outline-variant/10`}
               >
                 <span className="material-symbols-outlined text-[20px]">share</span>
               </button>
               
               {/* Share Dropdown */}
               <div 
                 onMouseDown={(e) => e.preventDefault()}
                 className={`absolute top-12 right-0 mt-2 bg-white rounded-full shadow-2xl border border-slate-200 p-1.5 flex flex-row items-center gap-1 z-30 transition-all duration-300 ease-out origin-top-right ${showTopShare ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                 <button onMouseDown={() => handleShare('facebook')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-[#1877F2] transition-colors">
                   <span className="font-bold text-lg leading-none mt-[-2px]">f</span>
                 </button>
                 <div className="w-px h-5 bg-slate-200 mx-0.5" />
                 <button onMouseDown={() => handleShare('twitter')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-900 transition-colors">
                   <span className="font-bold text-lg leading-none mt-[-2px]">𝕏</span>
                 </button>
                 <div className="w-px h-5 bg-slate-200 mx-0.5" />
                 <button onMouseDown={() => handleShare('linkedin')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                   <Image src="/social/linkedin.png" alt="LinkedIn" width={16} height={16} className="w-4 h-4 object-contain opacity-80" />
                 </button>
                 <div className="w-px h-5 bg-slate-200 mx-0.5" />
                 <div className="relative">
                   <button onMouseDown={handleCopyLink} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${copySuccess ? 'bg-green-50 text-green-600' : 'hover:bg-slate-100 text-slate-600'}`}>
                     <span className="material-symbols-outlined text-[18px]">{copySuccess ? 'check' : 'link'}</span>
                   </button>
                   {copySuccess && (
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap animate-fade-in-up">
                       Copied!
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-2 border-transparent border-t-slate-800" />
                     </div>
                   )}
                 </div>
               </div>
             </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl shadow-2xl shadow-slate-200/50 relative group">
            <div className="overflow-hidden rounded-xl">
              <Image 
                src={article.mainImage || FALLBACK_IMAGE}
                width={1200} 
                height={675}
                quality={75}
                priority={true}
                fetchPriority="high"
                alt={article.title}
                className="w-full aspect-[16/9] object-cover" 
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
                 (() => {
                   let htmlContent = decodedContent;
                   let usedMid = /\[WIDGET_MID\]/i.test(htmlContent);
                   let usedEnd = /\[WIDGET_END\]/i.test(htmlContent);

                   // Auto-inject MID after first paragraph if not manually placed
                   if (!usedMid && midArticles.length > 0) {
                     htmlContent = htmlContent.replace(/(<\/p>)/i, '$1|||WIDGET_MID|||');
                   }

                   let processedHtml = htmlContent
                     // First try to replace the entire paragraph if it mostly contains the shortcode
                     .replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?\[WIDGET_MID\](?:(?!<\/p>)[\s\S])*?<\/p>/gi, '|||WIDGET_MID|||')
                     .replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?\[WIDGET_END\](?:(?!<\/p>)[\s\S])*?<\/p>/gi, '|||WIDGET_END|||')
                     // Fallback raw replace just in case
                     .replace(/\[WIDGET_MID\]/gi, '|||WIDGET_MID|||')
                     .replace(/\[WIDGET_END\]/gi, '|||WIDGET_END|||');

                   const parts = processedHtml.split('|||');

                   return (
                     <>
                       {parts.map((part, index) => {
                         if (part === 'WIDGET_MID') {
                           return midArticles.length > 0 ? (
                             <RelatedArticles key={`mid-${index}`} title="Read More" articles={midArticles} variant="mid" />
                           ) : null;
                         }
                         if (part === 'WIDGET_END') {
                           return endArticles.length > 0 ? (
                             <RelatedArticles key={`end-${index}`} title="WHAT TO READ NEXT" articles={endArticles} variant="end" />
                           ) : null;
                         }
                         return part ? (
                           <div 
                             key={`html-${index}`} 
                             className={index === 0 && part.trimStart().startsWith('<p') ? 'drop-cap-article' : ''} 
                             dangerouslySetInnerHTML={{ __html: part }} 
                           />
                         ) : null;
                       })}
                       {/* Render End widget at the bottom if not manually placed inside the text */}
                       {!usedEnd && endArticles.length > 0 && (
                         <RelatedArticles title="WHAT TO READ NEXT" articles={endArticles} variant="end" />
                       )}
                     </>
                   );
                 })()
              ) : (
                <>
                  {article.paragraphs?.map((p, idx) => (
                    <div key={idx}>
                      <p className={idx === 0 ? "text-xl text-slate-900 leading-relaxed font-medium mb-8 drop-cap-first" : "mb-6"}>{p}</p>
                      {idx === 2 && midArticles.length > 0 && (
                        <RelatedArticles
                          title={`Read More on ${article.category_label || "Immigration"}`}
                          articles={midArticles}
                          variant="mid"
                        />
                      )}
                    </div>
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

            {/* End of article recommendation widget has been moved to the rich text parsing logic */}
            
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
