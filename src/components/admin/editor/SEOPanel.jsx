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

  const scoreColor = seoScore > 75 ? "text-emerald-600" : seoScore > 40 ? "text-amber-600" : "text-rose-500";

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
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <span className="text-indigo-500">🔍</span> SEO Optimization
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Score:</span>
          <span className={`text-sm font-bold ${scoreColor}`}>{seoScore}/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Preview */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-md mb-4">
          <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
            <span className="w-4 h-4 bg-slate-300 rounded-full inline-block"></span>
            digitaldiplomat.com
          </div>
          <p className="text-blue-700 text-sm font-medium hover:underline cursor-pointer truncate">
            {metaTitle || "Your Meta Title Will Appear Here"}
          </p>
          <p className="text-slate-600 text-xs mt-1 line-clamp-2">
            {metaDesc || "Your meta description will appear here in search results. Make it compelling and include keywords."}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 flex justify-between">
            Focus Keyword
          </label>
          <input 
            type="text" 
            name="focus_keyword" 
            value={focusKeyword} 
            onChange={handleChange} 
            placeholder="e.g. immigration, visa"
            className="w-full bg-slate-50 border border-slate-200 rounded text-sm p-2 text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 flex justify-between">
            Meta Title
            <span className={metaTitle.length > 60 ? "text-rose-500" : "text-slate-500"}>
              {metaTitle.length}/60
            </span>
          </label>
          <input 
            type="text" 
            name="meta_title" 
            value={metaTitle} 
            onChange={handleTitleChange} 
            className="w-full bg-slate-50 border border-slate-200 rounded text-sm p-2 text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 flex justify-between">
            Meta Description
            <span className={metaDesc.length > 160 ? "text-rose-500" : "text-slate-500"}>
              {metaDesc.length}/160
            </span>
          </label>
          <textarea 
            name="meta_description" 
            value={metaDesc} 
            onChange={handleChange} 
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded text-sm p-2 text-slate-800 outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        <div>
           <label className="block text-xs font-semibold text-slate-500 mb-1 flex justify-between">
            URL Slug
          </label>
          <div className="flex items-center overflow-hidden bg-slate-50 border border-slate-200 rounded focus-within:border-indigo-500 transition-colors">
            <span className="text-xs text-slate-500 px-2 select-none border-r border-slate-200 bg-slate-100">/</span>
            <input 
              type="text" 
              name="slug" 
              value={form.slug || ""} 
              onChange={handleChange} 
              className="w-full bg-transparent text-sm p-2 text-slate-800 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
          <input 
            type="checkbox" 
            id="index_toggle"
            name="is_indexed" 
            checked={form.is_indexed !== false} 
            onChange={(e) => handleChange({ target: { name: 'is_indexed', value: e.target.checked } })}
            className="rounded border-slate-300 text-indigo-500 focus:ring-0 bg-white" 
          />
          <label htmlFor="index_toggle" className="text-xs text-slate-600 cursor-pointer">
            Allow search engines to index this page
          </label>
        </div>
      </div>
    </div>
  );
}
