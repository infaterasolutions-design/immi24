"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import DataTable from "../../../components/admin/DataTable";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    setLoading(true);
    let { data, error } = await supabase.from("articles").select("*").order("updated_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    if (error) {
      // Fallback if sorting fails
      const fallback = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      data = fallback.data;
    }
    setArticles(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) { showToast("Failed to delete", "error"); return; }
    showToast("Article deleted");
    fetchArticles();
  }

  async function toggleFeatured(article) {
    const { error } = await supabase.from("articles").update({ is_featured: !article.is_featured }).eq("id", article.id);
    if (error) { showToast("Failed to update", "error"); return; }
    showToast(article.is_featured ? "Removed from featured" : "Marked as featured");
    fetchArticles();
  }

  const filtered = filter === "all" ? articles :
    filter === "featured" ? articles.filter(a => a.is_featured) :
    articles.filter(a => a.category_label === filter);

  const categories = [...new Set(articles.map(a => a.category_label).filter(Boolean))];

  const columns = [
    { key: "title", label: "Title", render: (row) => (
      <div style={{ maxWidth: 300 }}>
        <span style={{ fontWeight: 600, color: "#1e293b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {row.title}
        </span>
        {row.is_featured && <span style={{ fontSize: "0.65rem", color: "#eab308", marginTop: 2, display: "inline-block" }}>⭐ Featured</span>}
      </div>
    )},
    { key: "category_label", label: "Category", render: (row) => (
      <span className="admin-badge admin-badge-active">{row.category_label || "—"}</span>
    )},
    { key: "author_name", label: "Author" },
    { key: "status", label: "Status", render: (row) => {
      const isScheduled = row.status === "published" && row.published_at && new Date(row.published_at) > new Date();
      return (
        <span className={`admin-badge ${row.status === "draft" ? "admin-badge-inactive" : isScheduled ? "admin-badge-scheduled" : "admin-badge-active"}`}>
          {row.status === "draft" ? "Draft" : isScheduled ? "Scheduled" : "Published"}
        </span>
      );
    }},
    { key: "published_at", label: "Go-Live", render: (row) => (
      <span style={{ color: "#71717a", fontSize: "0.8rem" }}>
        {row.published_at ? new Date(row.published_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "—"}
      </span>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading articles...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Articles</h1>
          <p className="admin-page-subtitle">{articles.length} total · {articles.filter(a => a.is_featured).length} featured</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => router.push('/admin/articles/new')}>
            + New Article
          </button>
        </RoleGuard>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button className={`admin-btn admin-btn-sm ${filter === "all" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("all")}>All ({articles.length})</button>
        <button className={`admin-btn admin-btn-sm ${filter === "featured" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("featured")}>⭐ Featured</button>
        {categories.map(cat => (
          <button key={cat} className={`admin-btn admin-btn-sm ${filter === cat ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter(cat)}>{cat}</button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No articles found. Create your first article!"
        actions={(row) => (
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleFeatured(row)} title="Toggle featured">
                {row.is_featured ? "★" : "☆"}
              </button>
              <a className="admin-btn admin-btn-ghost admin-btn-sm" href={`/${row.slug}`} target="_blank" rel="noopener noreferrer">
                View
              </a>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => router.push(`/admin/articles/${row.id}/edit`)}>
                Edit
              </button>
              <RoleGuard user={user} allowedRoles={["super_admin"]}>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(row.id)}>
                  Delete
                </button>
              </RoleGuard>
            </div>
          </RoleGuard>
        )}
      />

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
