"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getRecommendedPopupData } from "@/app/actions/popupAction";

export default function RecommendedPopup() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const isArticlePage = pathname !== "/" &&
    !pathname.startsWith("/category") &&
    !pathname.startsWith("/live-updates") &&
    !pathname.startsWith("/admin");

  useEffect(() => {
    async function fetchData() {
      const data = await getRecommendedPopupData();
      setArticle(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !article) return null;

  return (
    <div 
      className={`fixed ${isArticlePage ? 'bottom-16 sm:bottom-20' : 'bottom-6'} right-0 z-[60] w-[150px] hide-on-mobile-menu`}
      style={{ height: '46.1px' }}
    >
      <div className="bg-white rounded-l-md shadow-2xl overflow-hidden border-y border-l border-slate-200 h-full w-full flex items-center shadow-red-500/10">
         <Link prefetch={true} href={article.cluster_slug ? `/${article.cluster_slug}/${article.slug}` : (article.slug ? `/${article.slug}` : `/article/${article.id}`)} className="flex w-full h-full group">
            <div className="w-[46px] h-full bg-slate-200 overflow-hidden flex-shrink-0 relative">
               <img src={article.main_image || "/images/logo.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="post" />
            </div>
            <div className="flex-grow p-1.5 flex flex-col justify-center bg-white group-hover:bg-primary transition-colors">
               <span className="text-[6.5px] font-bold text-primary group-hover:text-white/90 uppercase tracking-widest mb-0.5 leading-none">Recommended</span>
               <h5 className="text-[9px] font-extrabold headline-font leading-tight line-clamp-2 text-slate-900 group-hover:text-white transition-colors">{article.title}</h5>
            </div>
         </Link>
      </div>
    </div>
  );
}
