"use client";

import Link from "next/link";
import { useState } from "react";

export default function SidebarWidgets({ className = "" }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      // Simulate API call
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };
  return (
    <aside className={`space-y-12 ${className}`}>
      {/* Sticky Sidebar Content wrapper */}
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
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-sm placeholder:text-white/40 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all text-white" 
                placeholder="Email address" 
                type="email" 
              />
              <button type="submit" className="w-full bg-white text-primary font-bold py-3 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                {isSubscribed ? "Subscribed!" : "Subscribe Now"}
              </button>
              {isSubscribed && (
                <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Check your inbox.</p>
              )}
            </form>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </aside>
  );
}
