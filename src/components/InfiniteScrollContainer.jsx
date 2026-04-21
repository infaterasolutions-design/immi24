"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ArticleSection from "./ArticleSection";
import ScrollToTopButton from "./ScrollToTopButton";
import SidebarWidgets from "./SidebarWidgets";
import { fetchNextArticleAction } from "@/app/actions/article";

const MAX_ARTICLES = 4;

export default function InfiniteScrollContainer({ initialArticle }) {
  const [articles, setArticles] = useState([initialArticle]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleArticle, setVisibleArticle] = useState(initialArticle.id);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const visibilityObserverRef = useRef(null);

  const fetchNextArticle = useCallback(async () => {
    if (isLoading || !hasMore || articles.length >= MAX_ARTICLES) return;

    try {
      setIsLoading(true);
      const currentLastId = articles[articles.length - 1].id;
      const nextArticle = await fetchNextArticleAction(currentLastId);

      if (nextArticle) {
        setArticles((prev) => [...prev, nextArticle]);
        if (articles.length + 1 >= MAX_ARTICLES) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load next article:", error);
    } finally {
      setIsLoading(false);
    }
  }, [articles, isLoading, hasMore]);

  // Observer for triggering fetch
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNextArticle();
      }
    }, { rootMargin: "200px" });

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchNextArticle, hasMore]);

  // Observer for URL updates based on visibility
  useEffect(() => {
    if (visibilityObserverRef.current) visibilityObserverRef.current.disconnect();

    visibilityObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleId = entry.target.getAttribute("data-article-id");
            const articleSlug = entry.target.getAttribute("data-article-slug");
            if (articleId && articleId !== visibleArticle) {
              setVisibleArticle(articleId);
              // Update URL without a page reload
              if (articleSlug) {
                window.history.replaceState(null, "", `/${articleSlug}`);
              } else {
                window.history.replaceState(null, "", `/article/${articleId}`);
              }
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the article wrapper is visible
    );

    const wrappers = document.querySelectorAll(".article-wrapper");
    wrappers.forEach((wrapper) => {
      visibilityObserverRef.current.observe(wrapper);
    });

    return () => {
      if (visibilityObserverRef.current) visibilityObserverRef.current.disconnect();
    };
  }, [articles, visibleArticle]);

  return (
    <>
      {articles.map((article, index) => (
        <ArticleSection key={`article-${article.id}`} article={article} isFirst={index === 0} />
      ))}
      
      {/* Loading Indicator / Sentinel */}
      {hasMore && articles.length < MAX_ARTICLES && (
        <div ref={loaderRef} className="py-20 flex justify-center items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Next Story...</span>
        </div>
      )}

      {/* End of Feed Message and Mobile Sidebar */}
      {(!hasMore || articles.length >= MAX_ARTICLES) && (
        <>
          <div className="block lg:hidden px-4 md:px-8 max-w-[1298px] mx-auto mt-12 mb-16">
            <SidebarWidgets className="w-full" />
          </div>
          <div className="py-20 text-center text-slate-400 text-sm font-medium">
            You've reached the end of the feed.
          </div>
        </>
      )}

      {/* Fixed Bottom "Up Next" Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:block hidden">
        <div className="max-w-[1298px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">Currently Reading</div>
              <div className="text-sm font-bold max-w-xs truncate text-slate-800">
                {articles.find((a) => a.id === visibleArticle)?.title || articles[0].title}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">Article {articles.findIndex((a) => a.id === visibleArticle) + 1} of {hasMore ? "4" : articles.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:scale-105 transition-transform opacity-50 cursor-not-allowed"
               disabled
             >
               Next Story
             </button>
             <ScrollToTopButton />
          </div>
        </div>
      </div>
    </>
  );
}
