"use client";
import { useState, useRef } from "react";
import { uploadMediaToSupabase } from "../../../lib/adminHelpers";

export default function SettingsPanel({ form, handleChange, categories }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadMediaToSupabase(file);
      handleChange({ target: { name: "main_image", value: url } });
    } catch (err) {
      console.error(err);
      alert("Failed to upload featured image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Featured Image */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Featured Image</h3>
        {form.main_image ? (
          <div className="relative rounded-md overflow-hidden border border-slate-200 group">
            <img src={form.main_image} alt="Featured" className="w-full h-auto object-cover max-h-48" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => handleChange({ target: { name: "main_image", value: "" } })}
                className="bg-rose-500 text-white text-xs px-3 py-1.5 rounded shadow"
              >
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer"
          >
            <span className="text-2xl mb-2">🖼️</span>
            <p className="text-xs font-medium text-center">
              {isUploading ? "Uploading..." : "Click to upload featured image"}
            </p>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        
        {/* Caption */}
        {form.main_image && (
          <input 
            type="text" 
            name="image_caption" 
            value={form.image_caption || ""} 
            onChange={handleChange} 
            placeholder="Image caption (optional)"
            className="w-full mt-2 bg-transparent border-b border-slate-200 text-xs p-1 text-slate-700 outline-none focus:border-indigo-500 transition-colors"
          />
        )}
      </div>

      {/* Organization */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Organization</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Category</label>
            <select 
              value={form.category_slug || ""} 
              onChange={(e) => {
                const selectedCat = categories.find(c => c.slug === e.target.value);
                handleChange({ target: { name: "category_slug", value: selectedCat ? selectedCat.slug : "" } });
                handleChange({ target: { name: "category_label", value: selectedCat ? selectedCat.name : "" } });
                // Reset subcategory when category changes
                handleChange({ target: { name: "sub_category_slug", value: "" } });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
            >
              <option value="">Select a category...</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Subcategory Select */
          (() => {
            const selectedCatObj = categories.find(c => c.slug === form.category_slug);
            if (!selectedCatObj || !selectedCatObj.subcategories || selectedCatObj.subcategories.length === 0) return null;

            return (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Subcategory</label>
                <select 
                  name="sub_category_slug"
                  value={form.sub_category_slug || ""} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
                >
                  <option value="">No subcategory...</option>
                  {selectedCatObj.subcategories.map((sub, idx) => (
                    <option key={idx} value={sub.slug}>{sub.name || sub.label}</option>
                  ))}
                </select>
              </div>
            );
          })()}

          <div>
            <label className="block text-xs text-slate-500 mb-1">Author</label>
            <input 
              type="text" 
              name="author_name" 
              value={form.author_name || ""} 
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-xs text-slate-500 mb-1">Author Role</label>
            <input 
              type="text" 
              name="author_role" 
              value={form.author_role || ""} 
              onChange={handleChange}
              placeholder="e.g. Immigration Analyst"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>
          
          <div>
             <label className="block text-xs text-slate-500 mb-1">Read Time</label>
            <input 
              type="text" 
              name="read_time" 
              value={form.read_time || ""} 
              onChange={handleChange}
              placeholder="e.g. 5 min read"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Status Toggle */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Visibility</h3>
        <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-md bg-slate-50 hover:border-indigo-400 transition-colors mb-4">
          <input 
            type="checkbox" 
            name="is_featured" 
            checked={form.is_featured || false} 
            onChange={(e) => handleChange({ target: { name: 'is_featured', value: e.target.checked } })}
            className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-0 bg-white"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">Featured Article</p>
            <p className="text-xs text-slate-500">Pin strictly to the homepage</p>
          </div>
        </label>
      </div>

      {/* Publishing Schedule */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Schedule</h3>
        <div className="space-y-2 p-3 border border-slate-200 rounded-md bg-slate-50">
          <label className="block text-xs text-slate-500 font-medium">Go-live date (Your Local Time)</label>
          <input 
            type="datetime-local" 
            name="published_at_local" 
            value={form.published_at_local || ""} 
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
          {form.published_at_local ? (
            <div className="mt-2 text-[11px] font-medium p-2 bg-white rounded border border-indigo-200">
              <span className="text-indigo-600 font-bold block mb-1">🌎 Global World Time (UTC)</span>
              <span className="text-slate-700">{new Date(form.published_at_local).toUTCString()}</span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 mt-1">
              Leave blank to publish immediately globally.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
