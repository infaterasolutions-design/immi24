"use client";

import { useState } from "react";
import { subscribeEmail } from "@/app/actions/subscribe";

export default function NewsletterWidget({ isMobile = false }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      const result = await subscribeEmail(email.trim());
      if (result.success) {
        setIsSubscribed(true);
        setTimeout(() => setIsSubscribed(false), 3000);
        setEmail("");
      }
    }
  };

  if (isMobile) {
    return (
      <div className="lg:hidden">
        <div className="bg-primary p-5 text-white shadow-lg rounded-xl">
          <h3 className="text-lg font-extrabold headline-font mb-2">Global Briefing</h3>
          <p className="text-sm mb-4 opacity-90 leading-relaxed">Get critical immigration news delivered to your inbox weekly.</p>
          <form onSubmit={handleSubscribe} className="space-y-3 relative">
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none rounded-md text-white transition-all" 
              placeholder="Email address" 
              type="email" 
            />
            <button type="submit" className="w-full bg-white text-primary font-bold py-3 text-[11px] tracking-widest hover:bg-slate-50 transition-all uppercase rounded-md relative overflow-hidden">
              <span className={`transition-transform duration-300 ${isSubscribed ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>Subscribe Now</span>
              <span className={`transition-transform duration-300 flex items-center justify-center gap-1.5 ${isSubscribed ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`}><span className="material-symbols-outlined text-[16px]">check_circle</span> Subscribed!</span>
            </button>
            {isSubscribed && (
              <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Welcome aboard.</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary p-6 text-white shadow-lg rounded-xl">
      <h3 className="text-xl font-extrabold headline-font mb-2">Global Briefing</h3>
      <p className="text-sm mb-6 opacity-90 leading-relaxed">Get the week&apos;s most critical immigration news and policy analysis directly in your inbox.</p>
      <form onSubmit={handleSubscribe} className="space-y-3 relative">
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm md:text-[15px] placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none rounded-md transition-all text-white" 
          placeholder="Email address" 
          type="email" 
        />
        <button type="submit" className="w-full bg-white text-primary font-bold py-2.5 text-[11px] tracking-widest hover:bg-slate-50 transition-all uppercase rounded-md relative overflow-hidden">
          <span className={`transition-transform duration-300 ${isSubscribed ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>Subscribe Now</span>
          <span className={`transition-transform duration-300 flex items-center justify-center gap-1.5 ${isSubscribed ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`}><span className="material-symbols-outlined text-[16px]">check_circle</span> Subscribed!</span>
        </button>
        {isSubscribed && (
          <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Welcome aboard.</p>
        )}
      </form>
    </div>
  );
}
