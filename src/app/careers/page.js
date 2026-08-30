import Link from "next/link";

export const metadata = {
  title: "Careers - United States Immigration News",
  description: "Join the team at United States Immigration News. We are always looking for passionate journalists, editors, and immigration experts.",
  alternates: {
    canonical: "https://www.unitedstatesimmigrationnews.com/careers",
  },
};

export default function Careers() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 md:py-32 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Careers</span>
          <h1 className="text-4xl md:text-6xl font-extrabold headline-font mb-6 leading-tight">
            Help Us Decode <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">U.S. Immigration</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            We are on a mission to provide millions of immigrants, expats, and professionals with accurate, real-time news that impacts their lives and futures.
          </p>
          <a href="#open-roles" className="inline-block bg-primary text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all uppercase tracking-widest text-sm">
            View Open Roles
          </a>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-16 md:py-24 bg-slate-50 px-4 md:px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold headline-font text-slate-900 mb-4">Why Join Us?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We offer a dynamic, fast-paced environment where your work directly impacts millions of readers worldwide.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <span className="material-symbols-outlined text-5xl text-primary mb-6 block">public</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3 headline-font">100% Remote</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Work from anywhere in the world. We care about the quality of your reporting, not where you sit.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <span className="material-symbols-outlined text-5xl text-primary mb-6 block">health_and_safety</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3 headline-font">Health & Wellness</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Comprehensive health stipends and flexible time off to ensure you stay healthy and rested.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <span className="material-symbols-outlined text-5xl text-primary mb-6 block">trending_up</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3 headline-font">Massive Reach</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Your articles and analysis will be read by millions of people navigating the U.S. immigration system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="py-16 md:py-24 px-4 md:px-6 max-w-screen-md mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold headline-font text-slate-900 mb-4">Open Positions</h2>
          <p className="text-slate-600">We are always on the lookout for incredible talent. Don't see a role that fits? Email us anyway.</p>
        </div>

        <div className="space-y-6">
          {/* Role 1 */}
          <div className="border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 headline-font group-hover:text-primary transition-colors">Senior Immigration Reporter</h3>
                <p className="text-slate-500 text-sm mt-1">Full-time • Remote (US Timezones)</p>
              </div>
              <a href="mailto:careers@unitedstatesimmigrationnews.com?subject=Application: Senior Immigration Reporter" className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide hover:underline">
                Apply Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              We are seeking an experienced journalist with deep knowledge of USCIS policy changes, visa bulletins, and immigration law to lead our daily news coverage.
            </p>
          </div>

          {/* Role 2 */}
          <div className="border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 headline-font group-hover:text-primary transition-colors">Legal Researcher (Part-time)</h3>
                <p className="text-slate-500 text-sm mt-1">Part-time • Remote (Global)</p>
              </div>
              <a href="mailto:careers@unitedstatesimmigrationnews.com?subject=Application: Legal Researcher" className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide hover:underline">
                Apply Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Help our editorial team verify facts, decipher dense legal texts from the Federal Register, and translate complex policies into readable updates for our audience.
            </p>
          </div>
          
          {/* General Application */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mt-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 headline-font mb-3">Don't see your perfect fit?</h3>
            <p className="text-slate-600 text-sm mb-6">
              We are growing fast and always looking for talented writers, editors, and SEO specialists. Send us your resume and let us know how you can contribute.
            </p>
            <a href="mailto:careers@unitedstatesimmigrationnews.com?subject=General Application" className="inline-block bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-colors text-sm uppercase tracking-widest">
              Email Your Resume
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
