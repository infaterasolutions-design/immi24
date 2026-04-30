import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 md:py-12 px-4 md:px-6 bg-[#F9FAFB] text-slate-600 border-t border-slate-200 mt-12 md:mt-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-extrabold tracking-tighter headline-font block mb-4 md:mb-6 text-slate-900">
              <img
                alt="United States Immigration News Logo"
                className="w-auto object-contain mb-4 md:mb-6 h-10 md:h-14"
                src="/images/logo.png"
              />
            </span>
            <p className="text-sm leading-relaxed text-slate-600">
              The premier destination for accurate, real-time news and analysis regarding US immigration policy and global mobility.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 text-slate-900">RESOURCES</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">Visa Fee Calculator</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">USCIS Processing Times</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">Visa Bulletin Archive</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">H1B Lottery Data</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 text-slate-900">COMPANY</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">Editorial Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors py-1 block">Advertising</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 text-slate-900">CONNECT</h4>
            <div className="flex gap-4 mb-6">
              <Link href="#" className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors bg-slate-200">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </Link>
              <Link href="#" className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors bg-slate-200">
                <span className="material-symbols-outlined text-sm">share</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full-width bottom bar */}
      <div className="border-t border-slate-200 py-6 md:py-8 px-4 md:px-6 text-center text-slate-400 text-xs mt-8 md:mt-12 w-full">
        © 2024 United States Immigration News Editorial. All rights reserved.
      </div>
    </footer>
  );
}
