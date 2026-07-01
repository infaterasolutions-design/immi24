"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getHomepageLayout, revalidateHomepage } from "../../actions/homepageLayout";
import Link from "next/link";

export default function HomepageLayoutAdmin() {
  const [layout, setLayout] = useState({
    hero_article_id: "",
    grid1_article_id: "",
    grid2_article_id: "",
    grid3_article_id: "",
    grid4_article_id: "",
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      // Fetch articles
      const { data: arts } = await supabase
        .from("articles")
        .select("id, title, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      setArticles(arts || []);

      // Fetch layout
      const layoutData = await getHomepageLayout();
      if (layoutData) {
        setLayout({
          hero_article_id: layoutData.hero_article_id || "",
          grid1_article_id: layoutData.grid1_article_id || "",
          grid2_article_id: layoutData.grid2_article_id || "",
          grid3_article_id: layoutData.grid3_article_id || "",
          grid4_article_id: layoutData.grid4_article_id || "",
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    
    const payload = {
      id: 1, // Fixed ID for homepage layout
      hero_article_id: layout.hero_article_id || null,
      grid1_article_id: layout.grid1_article_id || null,
      grid2_article_id: layout.grid2_article_id || null,
      grid3_article_id: layout.grid3_article_id || null,
      grid4_article_id: layout.grid4_article_id || null,
    };

    // Use client-side supabase instance to ensure auth token is sent
    const { error } = await supabase.from('homepage_layout').upsert(payload);
    
    if (!error) {
      // Revalidate cache
      await revalidateHomepage();
      setMessage("Layout saved successfully! The homepage has been updated.");
    } else {
      console.error("Error updating layout:", error);
      setMessage("Error saving layout: " + error.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading layout settings...</div>;

  const SearchableSelect = ({ label, name, options }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const value = layout[name];
    const selectedOption = options.find(opt => opt.id === value);
    const displayValue = selectedOption ? selectedOption.title : "";

    const filteredOptions = options.filter(opt => 
      opt.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="mb-6 relative">
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-800 cursor-pointer flex justify-between items-center"
        >
          <span className="truncate">{displayValue || "-- Let system decide automatically --"}</span>
          <span className="text-xs text-slate-500">▼</span>
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-xl flex flex-col overflow-hidden" style={{ maxHeight: '350px' }}>
              <div className="p-2 border-b border-slate-100 bg-slate-50 relative z-30">
                <input 
                  type="text" 
                  autoFocus
                  className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-primary"
                  placeholder="Search article title..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="overflow-y-auto relative z-30 bg-white">
                <div 
                  className="p-3 hover:bg-primary/5 cursor-pointer text-sm text-slate-500 italic border-b border-slate-100"
                  onClick={() => { setLayout(prev => ({ ...prev, [name]: "" })); setIsOpen(false); setQuery(""); }}
                >
                  -- Let system decide automatically --
                </div>
                {filteredOptions.length === 0 ? (
                  <div className="p-3 text-sm text-slate-500 text-center">No articles found</div>
                ) : (
                  filteredOptions.map(opt => (
                    <div 
                      key={opt.id} 
                      className={`p-3 hover:bg-primary/5 cursor-pointer text-sm border-b border-slate-50 last:border-0 ${value === opt.id ? 'bg-primary/10 font-bold text-primary' : 'text-slate-700'}`}
                      onClick={() => { setLayout(prev => ({ ...prev, [name]: opt.id })); setIsOpen(false); setQuery(""); }}
                    >
                      {opt.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
        <p className="text-xs text-slate-500 mt-1">Leave blank to automatically fill this slot with the newest article.</p>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage Layout Control</h1>
          <p className="text-slate-500 mt-1">Manually select which articles appear at the top of the homepage.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-md font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-8 font-semibold ${message.includes("Error") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Hero Article (Main large card)</h2>
        <SearchableSelect label="Select Hero Article" name="hero_article_id" options={articles} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Grid Articles (4 smaller cards)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SearchableSelect label="Grid Slot 1 (Top Left)" name="grid1_article_id" options={articles} />
          <SearchableSelect label="Grid Slot 2 (Top Right)" name="grid2_article_id" options={articles} />
          <SearchableSelect label="Grid Slot 3 (Bottom Left)" name="grid3_article_id" options={articles} />
          <SearchableSelect label="Grid Slot 4 (Bottom Right)" name="grid4_article_id" options={articles} />
        </div>
      </div>
    </div>
  );
}
