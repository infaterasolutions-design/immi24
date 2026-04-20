"use client";

export default function SEOPanel({ form, handleChange }) {
  // Safe fallbacks for potentially null database values
  const metaTitle = form.meta_title || "";
  const metaDesc = form.meta_description || "";
  const focusKeyword = form.focus_keyword || "";

  // Simple SEO score calculation based on character limits and keywords
  let seoScore = 0;
  if (metaTitle.length > 30 && metaTitle.length < 60) seoScore += 30;
  if (metaDesc.length > 100 && metaDesc.length < 160) seoScore += 40;
  if (focusKeyword && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase())) seoScore += 30;

  const scoreColor = seoScore > 75 ? "text-emerald-400" : seoScore > 40 ? "text-amber-400" : "text-rose-400";

  function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  const handleTitleChange = (e) => {
    handleChange(e);
    // Auto-generate slug if it's empty
    if (!form.slug && e.target.name === "meta_title") {
      handleChange({ target: { name: 'slug', value: slugify(e.target.value) } });
    }
  };

  return (
    <div className="bg-[#0d0d14] rounded-lg border border-[#1e1e2e] p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
          <span className="text-indigo-400">🔍</span> SEO Optimization
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Score:</span>
          <span className={`text-sm font-bold ${scoreColor}`}>{seoScore}/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Preview */}
        <div className="bg-[#1a1a24] border border-[#2a2a3a] p-3 rounded-md mb-4">
          <div className="text-[11px] text-zinc-500 mb-1 flex items-center gap-1">
            <span className="w-4 h-4 bg-zinc-700 rounded-full inline-block"></span>
            digitaldiplomat.com
          </div>
          <p className="text-[#8ab4f8] text-sm font-medium hover:underline cursor-pointer truncate">
            {metaTitle || "Your Meta Title Will Appear Here"}
          </p>
          <p className="text-[#bdc1c6] text-xs mt-1 line-clamp-2">
            {metaDesc || "Your meta description will appear here in search results. Make it compelling and include keywords."}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1 flex justify-between">
            Focus Keyword
          </label>
          <input 
            type="text" 
            name="focus_keyword" 
            value={focusKeyword} 
            onChange={handleChange} 
            placeholder="e.g. immigration, visa"
            className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded text-sm p-2 text-zinc-200 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1 flex justify-between">
            Meta Title
            <span className={metaTitle.length > 60 ? "text-rose-400" : "text-zinc-500"}>
              {metaTitle.length}/60
            </span>
          </label>
          <input 
            type="text" 
            name="meta_title" 
            value={metaTitle} 
            onChange={handleTitleChange} 
            className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded text-sm p-2 text-zinc-200 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1 flex justify-between">
            Meta Description
            <span className={metaDesc.length > 160 ? "text-rose-400" : "text-zinc-500"}>
              {metaDesc.length}/160
            </span>
          </label>
          <textarea 
            name="meta_description" 
            value={metaDesc} 
            onChange={handleChange} 
            rows={3}
            className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded text-sm p-2 text-zinc-200 outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        <div>
           <label className="block text-xs font-semibold text-zinc-400 mb-1 flex justify-between">
            URL Slug
          </label>
          <div className="flex items-center overflow-hidden bg-[#1a1a24] border border-[#2a2a3a] rounded focus-within:border-indigo-500 transition-colors">
            <span className="text-xs text-zinc-600 px-2 select-none border-r border-[#2a2a3a] bg-[#14141e]">/</span>
            <input 
              type="text" 
              name="slug" 
              value={form.slug || ""} 
              onChange={handleChange} 
              className="w-full bg-transparent text-sm p-2 text-zinc-200 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#1e1e2e]">
          <input 
            type="checkbox" 
            id="index_toggle"
            name="is_indexed" 
            checked={form.is_indexed !== false} 
            onChange={(e) => handleChange({ target: { name: 'is_indexed', value: e.target.checked } })}
            className="rounded border-[#2a2a3a] text-indigo-500 focus:ring-0 bg-[#1a1a24]" 
          />
          <label htmlFor="index_toggle" className="text-xs text-zinc-400 cursor-pointer">
            Allow search engines to index this page
          </label>
        </div>
      </div>
    </div>
  );
}
