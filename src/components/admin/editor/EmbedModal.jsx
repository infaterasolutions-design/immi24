"use client";
import { useState, useEffect, useRef } from "react";

const PLATFORM_ICONS = {
  youtube: { icon: "▶", color: "#FF0000", label: "YouTube Video" },
  twitter: { icon: "𝕏", color: "#000000", label: "Twitter / X Post" },
  instagram: { icon: "📷", color: "#E4405F", label: "Instagram Post" },
  facebook: { icon: "f", color: "#1877F2", label: "Facebook Post" },
  linkedin: { icon: "in", color: "#0A66C2", label: "LinkedIn Post" },
  generic: { icon: "🔗", color: "#64748b", label: "Website Link" },
};

function detectPlatform(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "youtu.be") return "youtube";
    if (host === "twitter.com" || host === "x.com") return "twitter";
    if (host === "instagram.com") return "instagram";
    if (host === "facebook.com" || host === "fb.com" || host === "fb.watch") return "facebook";
    if (host === "linkedin.com") return "linkedin";
    return "generic";
  } catch {
    return null;
  }
}

export default function EmbedModal({ isOpen, onClose, onInsert }) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setPlatform(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    if (val.startsWith("http")) {
      setPlatform(detectPlatform(val));
    } else {
      setPlatform(null);
    }
  };

  const handleInsert = () => {
    if (!url.trim()) return;
    const detectedPlatform = detectPlatform(url) || "generic";
    onInsert({ src: url.trim(), platform: detectedPlatform });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const info = platform ? PLATFORM_ICONS[platform] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4 overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500 text-[20px]">link</span>
            <h3 className="font-bold text-slate-900 text-sm">Embed Content</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Paste URL from any platform
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={handleUrlChange}
                onKeyDown={handleKeyDown}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-3 pl-10 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                link
              </span>
            </div>
          </div>

          {/* Platform Detection Badge */}
          {info && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-in">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: info.color }}
              >
                {info.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{info.label}</p>
                <p className="text-xs text-slate-500 truncate max-w-[300px]">{url}</p>
              </div>
              <span className="ml-auto text-emerald-500 material-symbols-outlined text-[18px]">check_circle</span>
            </div>
          )}

          {/* Supported Platforms */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Supported Platforms</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PLATFORM_ICONS).map(([key, val]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] text-slate-600 font-medium"
                >
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-bold"
                    style={{ backgroundColor: val.color }}
                  >
                    {val.icon}
                  </span>
                  {val.label.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!url.trim()}
            className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 shadow-sm"
          >
            Insert Embed
          </button>
        </div>
      </div>
    </div>
  );
}
