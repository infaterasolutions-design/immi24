import React, { useState, useEffect, useRef } from "react";
import { searchInternalArticles } from "@/app/actions/searchActions";
import { Search, Link as LinkIcon, ExternalLink, X } from "lucide-react";

export default function InternalLinkModal({ isOpen, onClose, onInsert, initialUrl = "" }) {
  const [query, setQuery] = useState(initialUrl);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialUrl);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen, initialUrl]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query && query.length >= 2 && !query.startsWith("http")) {
        setIsLoading(true);
        try {
          const articles = await searchInternalArticles(query);
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
    const url = `/${article.slug}`;
    onInsert({ url, openInNewTab });
    onClose();
  };

  const handleRemoveLink = () => {
    onInsert({ url: null });
    onClose();
  };

  if (!isOpen) return null;

  const isExternalLikely = query.startsWith("http") || query.includes(".com") || query.includes(".org");

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
        <form onSubmit={handleSubmitExternal} className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles or paste a URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
          {isLoading && (
            <div className="p-4 text-center text-sm text-slate-500 animate-pulse">
              Searching articles...
            </div>
          )}

          {!isLoading && query && results.length === 0 && !isExternalLikely && (
            <div className="p-4 text-center text-sm text-slate-500">
              No articles found. Try another search or paste a URL.
            </div>
          )}

          {!isLoading && isExternalLikely && (
            <button
              onClick={handleSubmitExternal}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-indigo-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <ExternalLink size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate">Link to external URL</h4>
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
