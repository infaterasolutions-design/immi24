"use client";

export default function ScrollToTopButton() {
  return (
    <button 
      className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:text-primary hover:bg-slate-100 transition-all cursor-pointer" 
      onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
    >
      <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
    </button>
  );
}
