import React, { useState, useEffect, useRef } from "react";
import { searchInternalArticles } from "@/app/actions/searchActions";
import { Search, Link as LinkIcon, ExternalLink, X } from "lucide-react";

export default function InternalLinkModal({ isOpen, onClose, onInsert, initialUrl = "", initialOpenInNewTab = true }) {
  const [query, setQuery] = useState(initialUrl);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      let displayUrl = initialUrl || "";
      // If the link was saved as a relative path (like '/'), show the full domain so it's not confusing
      if (displayUrl.startsWith('/')) {
        const domain = "https://unitedstatesimmigrationnews.com";
        displayUrl = displayUrl === '/' ? domain : domain + displayUrl;
      }
      setQuery(displayUrl);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen, initialUrl, initialOpenInNewTab]);

  // Extract slug from own-site URLs
  const extractSlugFromOwnUrl = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?unitedstatesimmigrationnews\.com\/([^?#]+)/i,
      /(?:https?:\/\/)?localhost:\d+\/([^?#]+)/i,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const path = match[1].replace(/^\/+/, '');
        const segments = path.split('/').filter(Boolean);
        return segments[segments.length - 1] || null;
      }
    }
    return null;
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query || query.length < 2) { setResults([]); return; }

      // If the user pasted their own site's URL, extract the slug and search by it
      const slug = extractSlugFromOwnUrl(query);
      // Clean query: strip leading slash for slug-style searches
      const cleanQuery = query.replace(/^\/+/, '');
      
      if (slug) {
        setIsLoading(true);
        try {
          const articles = await searchInternalArticles(slug);
          setResults(articles);
        } catch (error) {
          console.error("Failed to search articles:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!query.startsWith("http")) {
        setIsLoading(true);
        try {
          const articles = await searchInternalArticles(cleanQuery);
          setResults(articles);
        } catch (error) {
          console.error("Failed to search articles:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmitExternal = (e) => {
    e.preventDefault();
    if (query.trim()) {
      let url = query.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
        url = "https://" + url;
      }
      onInsert({ url, openInNewTab });
      onClose();
    }
  };

  const handleSelectArticle = (article) => {
    const url = article.cluster_slug 
      ? `/${article.cluster_slug}/${article.slug}`
      : `/${article.slug}`;
    onInsert({ url, openInNewTab });
    onClose();
  };

  const handleRemoveLink = () => {
    onInsert({ url: null });
    onClose();
  };

  if (!isOpen) return null;

  const isOwnSiteUrl = query.includes('unitedstatesimmigrationnews.com') || query.includes('localhost:');
  const isUrlOrPath = query.startsWith("http://") || query.startsWith("https://") || query.startsWith("/") || query.includes(".com") || query.includes(".org") || query.includes(".gov") || query.includes(".edu") || isOwnSiteUrl;

  const handleManualUrlSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    let url = query.trim();
    
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
      url = "https://" + url;
    }

    onInsert({ url, openInNewTab });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <LinkIcon size={18} className="text-indigo-600" />
            Add Link
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles or paste a URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleManualUrlSubmit(e);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Open in new tab
            </label>
            {initialUrl && (
              <button
                type="button"
                onClick={handleRemoveLink}
                className="text-sm text-red-600 hover:text-red-700 font-medium ml-auto"
              >
                Remove Link
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
          {isLoading && (
            <div className="p-4 text-center text-sm text-slate-500 animate-pulse">
              Searching articles...
            </div>
          )}

          {!isLoading && query && results.length === 0 && !isUrlOrPath && (
            <div className="p-4 text-center text-sm text-slate-500">
              No articles found. Try another search or paste a URL.
            </div>
          )}

          {!isLoading && isOwnSiteUrl && results.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              No matching article found for this URL. You can still use the manual link option below.
            </div>
          )}

          {!isLoading && isUrlOrPath && (
            <button
              onClick={handleManualUrlSubmit}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors group mb-3 border border-indigo-150"
            >
              <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <ExternalLink size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate">Use exact link address</h4>
                <p className="text-sm text-slate-500 truncate">{query}</p>
              </div>
            </button>
          )}

          {!isLoading && results.map((article) => (
            <button
              key={article.slug}
              onClick={() => handleSelectArticle(article)}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-slate-200 mb-1"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-semibold">
                    {article.category_label || 'Article'}
                  </span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  <span className="truncate flex-1 text-slate-400">/{article.slug}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
