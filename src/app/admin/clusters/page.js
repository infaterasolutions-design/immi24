"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({ slug: "", name: "" });
  const [editingSlug, setEditingSlug] = useState(null);

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    setLoading(true);
    const { data } = await supabase.from("clusters").select("*").order("name", { ascending: true });
    setClusters(data || []);
    setLoading(false);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.slug || !form.name) return alert("Slug and Name are required");
    
    // Auto-format slug
    const cleanSlug = form.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    setSaving(true);
    
    if (editingSlug && editingSlug !== cleanSlug) {
      // If slug changed, delete old one and insert new (since slug is PK)
      await supabase.from("clusters").delete().eq("slug", editingSlug);
    }
    
    const { error } = await supabase.from("clusters").upsert({
      slug: cleanSlug,
      name: form.name
    });
    
    setSaving(false);
    
    if (error) {
      alert("Error saving cluster: " + error.message);
    } else {
      setForm({ slug: "", name: "" });
      setEditingSlug(null);
      fetchClusters();
    }
  };

  const handleEdit = (cluster) => {
    setForm({ slug: cluster.slug, name: cluster.name });
    setEditingSlug(cluster.slug);
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this cluster?")) return;
    await supabase.from("clusters").delete().eq("slug", slug);
    fetchClusters();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Topic Clusters</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-min">
          <h2 className="text-lg font-bold mb-4">{editingSlug ? "Edit Cluster" : "Add New Cluster"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input 
                type="text" 
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-indigo-500 outline-none"
                placeholder="e.g. ICE News"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input 
                type="text" 
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-indigo-500 outline-none"
                placeholder="e.g. ice-news"
              />
              <p className="text-xs text-slate-500 mt-1">Must match exactly the cluster slug used in articles.</p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 w-full"
              >
                {saving ? "Saving..." : (editingSlug ? "Update Cluster" : "Create Cluster")}
              </button>
              {editingSlug && (
                <button 
                  type="button" 
                  onClick={() => { setForm({ slug: "", name: "" }); setEditingSlug(null); }}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading clusters...</div>
          ) : clusters.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No clusters found.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {clusters.map((cluster) => (
                  <tr key={cluster.slug} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {cluster.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <code>{cluster.slug}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(cluster)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(cluster.slug)} className="text-rose-600 hover:text-rose-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
