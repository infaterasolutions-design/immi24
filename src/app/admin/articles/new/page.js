"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import TiptapEditor from "../../../../components/admin/editor/TiptapEditor";
import SEOPanel from "../../../../components/admin/editor/SEOPanel";
import SettingsPanel from "../../../../components/admin/editor/SettingsPanel";
import RoleGuard from "../../../../components/admin/RoleGuard";

export default function NewArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = typeof window !== "undefined" ? window.__adminUser : null;
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    sub_title: "",
    content_html: "",
    meta_title: "",
    meta_description: "",
    slug: "",
    focus_keyword: "",
    category_label: "",
    author_name: user?.email || "",
    author_role: "",
    read_time: "",
    main_image: "",
    image_caption: "",
    status: "draft",
    is_featured: false,
    is_most_viewed: false,
    is_recommended_popup: false,
    is_indexed: true,
    published_at_local: "",
  });

  useEffect(() => {
    async function fetchCats() {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    }
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setForm(prev => {
      const updates = { [name]: finalValue };
      
      // Auto-generate slug and meta title when title changes
      if (name === "title" && !prev.slug_manually_edited) {
        updates.slug = finalValue.toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-")
          .trim();
        updates.meta_title = finalValue;
      }
      
      // Track if user manually edits slug so we don't overwrite it
      if (name === "slug") {
        updates.slug_manually_edited = true;
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleSave = async (statusOverride) => {
    setLoading(true);
    const finalStatus = statusOverride || form.status;
    const payload = { 
      ...form, 
      status: finalStatus,
      paragraphs: [form.content_html],
      quote: "",
      sub_paragraphs: [],
      author_image: form.author_image || "",
      tags: form.tags || [],
      category_slug: form.category_slug || "",
      sub_category_slug: form.sub_category_slug || ""
    };
    
    // Remove virtual/internal columns so Supabase doesn't reject them
    delete payload.content_html;
    delete payload.slug_manually_edited;

    // Convert Local Scheduled Time to UTC for the database, or default to immediate
    if (payload.published_at_local) {
      payload.published_at = new Date(payload.published_at_local).toISOString();
    } else {
      payload.published_at = new Date().toISOString();
    }
    delete payload.published_at_local;

    // Satisfy legacy required ID and Date properties for CSV-imported tables
    payload.id = Date.now().toString(); 
    payload.date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const { data, error } = await supabase.from("articles").insert([payload]).select().single();
    setLoading(false);

    if (error) {
      alert("Failed to save: " + error.message);
    } else {
      router.push(`/admin/articles`);
    }
  };

  return (
    <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
      <div className="flex flex-col h-[calc(100vh-60px)] -mt-2">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/admin/articles')} className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-sm font-medium flex items-center gap-1">
              ← Back
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="text-lg font-bold text-slate-900">Create New Post</h1>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>
            <button 
              onClick={() => handleSave('published')}
              disabled={loading || !form.title}
              className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              🚀 Publish
            </button>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
          
          {/* Main Editor Area (Left) */}
          <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
            
            <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
              <input 
                type="text" 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Post Title..."
                className="w-full bg-transparent text-4xl font-extrabold text-slate-900 outline-none placeholder:text-slate-400 mb-4"
              />
              <input 
                type="text" 
                name="sub_title" 
                value={form.sub_title} 
                onChange={handleChange} 
                placeholder="Add a subtitle (optional)..."
                className="w-full bg-transparent text-lg text-slate-600 outline-none placeholder:text-slate-400 mb-8 font-serif"
              />

              {/* Tiptap Integration */}
              <TiptapEditor 
                content={form.content_html} 
                onChange={(html) => setForm(prev => ({ ...prev, content_html: html }))} 
              />
            </div>
          </div>

          {/* Settings Sidebar (Right) */}
          <div className="lg:col-span-4 overflow-y-auto pr-2 custom-scrollbar space-y-6">
            <SettingsPanel form={form} handleChange={handleChange} categories={categories} />
            <SEOPanel form={form} handleChange={handleChange} />
          </div>

        </div>
      </div>
    </RoleGuard>
  );
}
