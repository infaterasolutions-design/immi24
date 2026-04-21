"use client";
import Link from "next/link";

export default function RecommendedPopup() {
  return (
    <div 
      className="fixed bottom-6 right-0 z-[60] w-[150px]"
      style={{ height: '46.1px' }}
    >
      <div className="bg-white rounded-l-md shadow-2xl overflow-hidden border-y border-l border-slate-200 h-full w-full flex items-center shadow-red-500/10">
         <Link href="/digital-nomad-visa-options-for-2024" className="flex w-full h-full group">
            <div className="w-[46px] h-full bg-slate-200 overflow-hidden flex-shrink-0 relative">
               <img src="/images/4.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="post" />
            </div>
            <div className="flex-grow p-1.5 flex items-center justify-center bg-slate-900 group-hover:bg-primary transition-colors">
               <h5 className="text-[9px] font-extrabold headline-font leading-tight line-clamp-2 text-white">Digital Nomad Visa Options for 2024</h5>
            </div>
         </Link>
      </div>
    </div>
  );
}
