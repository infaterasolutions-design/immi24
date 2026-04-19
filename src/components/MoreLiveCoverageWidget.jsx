import Link from "next/link";

export default function MoreLiveCoverageWidget() {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 mb-6">
      <h3 className="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse-red"></span>
        More Live Coverage
      </h3>
      <div className="space-y-6">
        <Link href="#" className="group block">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">HEARING</span>
          <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">Senate Hearing on Immigration Reform Expected to Start at 3PM EST</h4>
          <span className="text-[10px] font-bold text-rose-600 tracking-widest mt-1 uppercase block flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse-red inline-block"></span> Live Now
          </span>
        </Link>
        <Link href="#" className="group block">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">SYSTEM ALERT</span>
          <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">USCIS Portal Crash: Verification Outage Expected to Last Another Hour</h4>
          <span className="text-xs text-slate-500 mt-1 block">10 mins ago</span>
        </Link>
        <Link href="#" className="group block">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">COURTS</span>
          <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">Emergency Asylum Injunction Blocked by Appeals Court</h4>
          <span className="text-xs text-slate-500 mt-1 block">45 mins ago</span>
        </Link>
        <Link href="#" className="group block">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">WHITE HOUSE</span>
          <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">President to Address Border Security in Evening Briefing</h4>
          <span className="text-xs text-slate-500 mt-1 block">1 hour ago</span>
        </Link>
      </div>
    </div>
  );
}
