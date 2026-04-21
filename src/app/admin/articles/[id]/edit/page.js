"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import TiptapEditor from "../../../../../components/admin/editor/TiptapEditor";
import SEOPanel from "../../../../../components/admin/editor/SEOPanel";
import SettingsPanel from "../../../../../components/admin/editor/SettingsPanel";
import RoleGuard from "../../../../../components/admin/RoleGuard";

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    author_name: "",
    author_role: "",
    read_time: "",
    main_image: "",
    image_caption: "",
    status: "draft",
    is_featured: false,
    is_indexed: true,
  });

  useEffect(() => {
    async function fetchData() {
      const [{ data: catData }, { data: articleData, error }] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("articles").select("*").eq("id", params.id).single()
      ]);

      if (catData) setCategories(catData);
      
      if (error || !articleData) {
        alert("Article not found.");
        router.push("/admin/articles");
        return;
      }

      const isRichHtml = Array.isArray(articleData.paragraphs) && articleData.paragraphs.length === 1 && articleData.paragraphs[0].includes('<');

      let legacyHtml = "";
      if (!isRichHtml) {
        if (Array.isArray(articleData.paragraphs)) {
          legacyHtml += articleData.paragraphs.map(p => `<p>${p}</p>`).join("");
        }
        if (articleData.quote) {
          legacyHtml += `<blockquote><p>${articleData.quote}</p></blockquote>`;
        }
        if (Array.isArray(articleData.sub_paragraphs)) {
          legacyHtml += articleData.sub_paragraphs.map(p => `<p>${p}</p>`).join("");
        }
      }

      setForm({
        ...articleData,
        // Pull the HTML out of the paragraphs array, or fallback to compiling the legacy fields
        content_html: isRichHtml ? articleData.paragraphs[0] : legacyHtml
      });
      setLoading(false);
    }
    
    if (params.id) fetchData();
  }, [params.id, router]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (statusOverride) => {
    setSaving(true);
    const finalStatus = statusOverride || form.status;
    
    const payload = { 
      ...form, 
      status: finalStatus,
      paragraphs: [form.content_html], // Wrap HTML inside existing DB array column
      quote: form.quote || "",
      sub_paragraphs: form.sub_paragraphs || [],
      author_image: form.author_image || "",
      tags: form.tags || [],
      category_slug: form.category_slug || "",
      sub_category_slug: form.sub_category_slug || ""
    };
    
    // Remove the virtual column so Supabase doesn't reject it
    delete payload.content_html;

    const { error } = await supabase.from("articles").update(payload).eq("id", params.id);
    setSaving(false);

    if (error) {
      alert("Failed to update: " + error.message);
    } else {
      router.push(`/admin/articles`);
    }
  };

  if (loading) return <div className="text-zinc-500 py-10 text-center">Loading editor...</div>;

  return (
    <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
      <div className="flex flex-col h-[calc(100vh-60px)] -mt-2">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e1e2e] mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/admin/articles')} className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer text-sm font-medium flex items-center gap-1">
              ← Back
            </button>
            <div className="h-4 w-px bg-[#2a2a3a]" />
            <h1 className="text-lg font-bold text-white">Edit Post</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${form.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
              {form.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2 rounded-md text-sm font-medium border border-[#2a2a3a] text-zinc-300 hover:bg-[#1a1a24] transition-colors"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button 
              onClick={() => handleSave('published')}
              disabled={saving || !form.title}
              className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              🚀 Update Post
            </button>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
          
          {/* Main Editor Area (Left) */}
          <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
            
            <div className="bg-[#0d0d14] p-8 border border-[#1e1e2e] rounded-lg">
              <input 
                type="text" 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Post Title..."
                className="w-full bg-transparent text-4xl font-extrabold text-white outline-none placeholder:text-zinc-700 mb-4"
              />
              <input 
                type="text" 
                name="sub_title" 
                value={form.sub_title} 
                onChange={handleChange} 
                placeholder="Add a subtitle (optional)..."
                className="w-full bg-transparent text-lg text-zinc-400 outline-none placeholder:text-zinc-600 mb-8 font-serif"
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
