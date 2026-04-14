import Link from "next/link";
import Image from "next/image";

export default function LiveUpdatesPage() {
  return (
    <div className="pt-4 md:pt-8 pb-24 min-h-screen flex justify-center px-3 md:px-4 lg:px-0">
      {/* Main Content Container (1200px) */}
      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Article Header & Feed Section */}
        <section className="col-span-1 lg:col-span-8">
          {/* Top Section */}
          <header className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse-red"></span>
                LIVE UPDATES
              </span>
              <span className="text-[10px] md:text-xs text-outline font-medium tracking-wide uppercase">Breaking News • 12 mins ago</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter text-slate-900 mb-6 md:mb-8 leading-[1.1]">
              Global Mobility Shift: European Union Proposes Streamlined Digital Nomad Visa Framework
            </h1>
            
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10 text-on-surface-variant flex-wrap">
              <div className="flex items-center gap-2">
                <img 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
                  loading="lazy"
                  src="/images/u1.jpg" 
                  alt="Julian Thorne" 
                />
                <div>
                  <span className="block text-sm font-bold font-headline text-slate-900">Julian Thorne</span>
                  <span className="block text-[10px] md:text-xs uppercase tracking-tight">Chief Policy Correspondent</span>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/30 hidden sm:block"></div>
              <div className="text-xs md:text-sm font-medium">
                Updated October 24, 2023 — 14:20 GMT
              </div>
            </div>

            <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl">
              <img 
                className="w-full h-full object-cover" 
                loading="lazy"
                src="/images/1.jpg" 
                alt="European Parliament" 
              />
              <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-on-surface/80 backdrop-blur-sm text-white px-2 md:px-3 py-1 text-[9px] md:text-[10px] uppercase font-bold tracking-widest rounded-sm">
                Photo: Getty Images / European Press Agency
              </div>
            </div>
          </header>

          {/* Live Feed: Vertical Chronological Timeline */}
          <div className="space-y-10 md:space-y-16 relative mt-10 md:mt-16">
            {/* Vertical Line Anchor */}
            <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-primary/10"></div>
            
            {/* Feed Item 1 */}
            <article className="relative pl-8 md:pl-10 group">
              <div className="absolute left-0 top-2 w-4 h-4 bg-primary rounded-full ring-4 ring-surface"></div>
              <div className="flex flex-col gap-3 md:gap-4">
                <header className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-primary font-extrabold text-base md:text-lg font-headline tracking-tighter">14:12 GMT</span>
                  <h3 className="text-xl md:text-2xl font-bold font-headline tracking-tight text-on-surface group-hover:text-primary transition-colors cursor-pointer text-slate-900">Draft resolution reveals 48-hour approval target</h3>
                </header>
                <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl">
                  The leaked document suggests a unified portal for all member states. This would eliminate the current patchwork of individual nation requirements, aiming for a 48-hour automated initial eligibility check.
                </p>
                <div className="bg-surface-container-low border-l-4 border-primary p-4 md:p-6 mt-2 italic text-sm md:text-base text-on-surface font-medium rounded-r-xl">
                  "This represents the most significant shift in European labor mobility since the creation of the Schengen Area." — EU Migration Commissioner
                </div>
              </div>
            </article>

            {/* Feed Item 2 */}
            <article className="relative pl-8 md:pl-10 group">
              <div className="absolute left-[2px] top-2 w-3 h-3 bg-primary/40 rounded-full ring-4 ring-surface"></div>
              <div className="flex flex-col gap-3 md:gap-4">
                <header className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-outline font-extrabold text-base md:text-lg font-headline tracking-tighter">13:45 GMT</span>
                  <h3 className="text-xl md:text-2xl font-bold font-headline tracking-tight text-on-surface text-slate-900 cursor-pointer">Member states react to tax reciprocity clause</h3>
                </header>
                <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl">
                  Spain and Italy have expressed concerns regarding the tax implications for remote workers staying longer than 180 days. Negotiations are currently focusing on a 'Dual Residence Recognition' model.
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                  <img className="aspect-square object-cover rounded-xl shadow-md" loading="lazy" src="/images/2.jpg" alt="Document" />
                  <img className="aspect-square object-cover rounded-xl shadow-md" loading="lazy" src="/images/3.jpg" alt="Meeting" />
                </div>
              </div>
            </article>

            {/* Feed Item 3 */}
            <article className="relative pl-8 md:pl-10 group">
              <div className="absolute left-[2px] top-2 w-3 h-3 bg-primary/40 rounded-full ring-4 ring-surface"></div>
              <div className="flex flex-col gap-3 md:gap-4">
                <header className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-outline font-extrabold text-base md:text-lg font-headline tracking-tighter">13:10 GMT</span>
                  <h3 className="text-xl md:text-2xl font-bold font-headline tracking-tight text-on-surface text-slate-900 cursor-pointer">Tech Hubs in Berlin and Lisbon support the move</h3>
                </header>
                <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl">
                  Major European technology associations have released a joint statement welcoming the streamlined digital nomad visa, citing a projected 15% boost in local innovation ecosystems.
                </p>
              </div>
            </article>
          </div>

          {/* Load More Button */}
          <div className="mt-12 md:mt-16 flex justify-center">
            <button className="bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 font-headline font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-blue-800 transition-all flex items-center gap-3 rounded-full w-full sm:w-auto justify-center">
              Load Older Updates
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
          </div>
        </section>

        {/* Sidebar Content — hidden on mobile */}
        <aside className="col-span-1 lg:col-span-4 space-y-8 md:space-y-12 hidden lg:block">
          {/* More Live Updates Suggestion */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 border-b border-primary/20 pb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse-red"></span>
              More Live Updates
            </h4>
            <div className="space-y-8">
              <Link href="#" className="group block">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-2 block">Hearing</span>
                <h5 className="text-xl font-bold font-headline leading-snug group-hover:text-primary transition-colors text-slate-900">Senate Hearing on Immigration Reform Expected to Start at 3PM EST</h5>
                <span className="text-xs text-slate-500 mt-2 block">Live Now</span>
              </Link>
              <Link href="#" className="group block">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-2 block">System Alert</span>
                <h5 className="text-xl font-bold font-headline leading-snug group-hover:text-primary transition-colors text-slate-900">USCIS Portal Crash: Verification Outage Expected to Last Another Hour</h5>
                <span className="text-xs text-slate-500 mt-2 block">10 mins ago</span>
              </Link>
              <Link href="#" className="group block">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-2 block">Courts</span>
                <h5 className="text-xl font-bold font-headline leading-snug group-hover:text-primary transition-colors text-slate-900">Emergency Asylum Injunction Blocked by Appeals Court</h5>
                <span className="text-xs text-slate-500 mt-2 block">45 mins ago</span>
              </Link>
            </div>
          </div>

          {/* Trending Topics (Chips) */}
          <div className="bg-surface-container rounded-xl p-6 md:p-8">
            <h4 className="text-sm font-bold tracking-[0.2em] uppercase text-on-surface mb-6 text-slate-900">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              <Link href="#" className="bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#DIGITALNOMAD</Link>
              <Link href="#" className="bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#EU_VISA</Link>
              <Link href="#" className="bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#MOBILITY</Link>
              <Link href="#" className="bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#WORKREMOTE</Link>
              <Link href="#" className="bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#IMMIGRATION_LAW</Link>
              <Link href="#" className="bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#SCHENGEN</Link>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="bg-primary p-8 md:p-10 text-on-primary rounded-xl shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-3xl md:text-4xl mb-4" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
            <h4 className="text-xl md:text-2xl font-extrabold font-headline leading-tight mb-4 text-white">The Daily Diplomat Intelligence</h4>
            <p className="text-sm opacity-90 leading-relaxed mb-6 md:mb-8 text-white/80">Get the latest immigration law updates and policy shifts delivered to your inbox every morning.</p>
            <form className="space-y-4">
              <input className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 border-0 rounded-lg p-3 md:p-4 font-headline text-sm outline-none" placeholder="Your professional email" type="email" />
              <button type="button" className="w-full bg-white text-primary font-bold font-headline text-xs tracking-widest uppercase py-3 md:py-4 rounded-lg hover:bg-surface-container-lowest transition-colors">
                Subscribe Now
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile-only: Trending & Newsletter below feed */}
        <div className="lg:hidden space-y-6 col-span-1">
          {/* Trending Topics Mobile */}
          <div className="bg-surface-container rounded-xl p-5">
            <h4 className="text-sm font-bold tracking-[0.2em] uppercase text-on-surface mb-4 text-slate-900">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              <Link href="#" className="bg-surface-container-lowest px-3 py-2 text-[11px] font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#DIGITALNOMAD</Link>
              <Link href="#" className="bg-surface-container-lowest px-3 py-2 text-[11px] font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#EU_VISA</Link>
              <Link href="#" className="bg-surface-container-lowest px-3 py-2 text-[11px] font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#MOBILITY</Link>
              <Link href="#" className="bg-surface-container-lowest px-3 py-2 text-[11px] font-bold text-on-surface-variant border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all">#WORKREMOTE</Link>
            </div>
          </div>
          {/* Newsletter Mobile */}
          <div className="bg-primary p-5 text-on-primary rounded-xl shadow-xl shadow-primary/20">
            <h4 className="text-lg font-extrabold font-headline leading-tight mb-2 text-white">Daily Diplomat Intelligence</h4>
            <p className="text-sm opacity-90 leading-relaxed mb-4 text-white/80">Immigration updates delivered daily.</p>
            <form className="space-y-3">
              <input className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 border-0 rounded-lg p-3 font-headline text-sm outline-none" placeholder="Your email" type="email" />
              <button type="button" className="w-full bg-white text-primary font-bold font-headline text-xs tracking-widest uppercase py-3 rounded-lg hover:bg-surface-container-lowest transition-colors">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
