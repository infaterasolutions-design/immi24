import Link from "next/link";
import ArticleSection from "./ArticleSection";
import SidebarWidgets from "./SidebarWidgets";

export default function InfiniteScrollContainer({ initialArticle, sidebarData, nextArticle }) {
  return (
    <>
      <div className="pt-4 md:pt-8 pb-0 px-3 md:px-4 lg:px-24 max-w-[1298px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
        <div className="lg:col-span-8 flex flex-col gap-2 md:gap-3">
          <ArticleSection article={initialArticle} isFirst={true} />
          
          {/* Next Story / Keep Reading — already loaded, shows instantly */}
          {nextArticle && (
            <div className="mt-12 pt-10 border-t border-slate-200">
              <h3 className="font-headline font-black text-2xl text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
                Keep Reading
              </h3>
              <Link href={`/${nextArticle.slug}`} className="group flex flex-col sm:flex-row bg-slate-50 hover:bg-slate-100 rounded-2xl overflow-hidden transition-colors border border-slate-200">
                {nextArticle.main_image && (
                  <div className="sm:w-1/3 aspect-[16/9] sm:aspect-square relative overflow-hidden shrink-0">
                    <img 
                      src={nextArticle.main_image} 
                      alt={nextArticle.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-2 block">
                    {nextArticle.category_label || "Next Article"}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold leading-tight group-hover:text-primary transition-colors text-slate-800 mb-2">
                    {nextArticle.title}
                  </h4>
                  {nextArticle.read_time && (
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {nextArticle.read_time} Min Read
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* End of Feed Message and Mobile Sidebar */}
          <div className="block lg:hidden mt-12 mb-16">
            <SidebarWidgets className="w-full" initialData={sidebarData} />
          </div>
        </div>

        {/* Sidebar Section (Desktop) */}
        <div className="hidden lg:block lg:col-span-4">
          <SidebarWidgets className="w-full" initialData={sidebarData} />
        </div>
      </div>
    </>
  );
}
