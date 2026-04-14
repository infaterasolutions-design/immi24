export default function AdSidebar({ position = "left" }) {
  // `position` can be used later if different styling is needed for left vs right
  return (
    <aside className="hidden xl:block w-[160px] flex-shrink-0">
      <div className="sticky top-24 w-[160px] h-[600px] bg-surface-container-low border border-slate-200 flex flex-col items-center justify-center p-4">
        <span className="text-[10px] uppercase tracking-widest text-outline mb-4">Advertisement</span>
        <div className="w-full h-full bg-slate-100 flex items-center justify-center italic text-[10px] text-slate-400 text-center">
          Premium Placement Space
        </div>
      </div>
    </aside>
  );
}
