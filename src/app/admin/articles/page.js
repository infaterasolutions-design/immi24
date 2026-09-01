"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import DataTable from "../../../components/admin/DataTable";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => { fetchArticles(); }, []);

  // Reset page to 1 when any filter or search changes
  useEffect(() => { setCurrentPage(1); }, [statusFilter, authorFilter, categoryFilter, reviewFilter, sortFilter, searchQuery]);

  async function fetchArticles() {
    setLoading(true);
    const selectCols = "id, title, is_featured, category_label, last_reviewed_date, published_at, author_name, status, likes_count, saves_count, shares_count, slug";
    let { data, error } = await supabase.from("articles").select(selectCols).order("published_at", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("Error fetching articles:", error);
      const fallback = await supabase.from("articles").select(selectCols);
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
    if (!confirm("Are you sure you want to delete this article? It will be moved to the Recycle Bin.")) return;

    // First, delete any linked videos to avoid foreign key constraint violations
    // We do this before moving to recycle bin so the hard delete of the article succeeds
    await supabase.from("videos").delete().eq("article_id", id);
    
    // Move the article to recycle bin
    const { moveToRecycleBin } = await import("@/app/actions/recycleBin");
    const { success, error } = await moveToRecycleBin("articles", id, "title");

    if (!success) {
      console.error("Delete error:", error);
      showToast(`Failed to move to recycle bin: ${error}`, "error"); 
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("Article moved to Recycle Bin");
    }
  }

  async function toggleFeatured(article) {
    const { error } = await supabase.from("articles").update({ is_featured: !article.is_featured }).eq("id", article.id);
    if (error) { showToast("Failed to update", "error"); return; }
    showToast(article.is_featured ? "Removed from featured" : "Marked as featured");
    fetchArticles();
  }

  const filtered = (() => {
    let result = articles;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.title?.toLowerCase().includes(q) || a.author_name?.toLowerCase().includes(q));
    }

    // Status / Featured
    if (statusFilter === "featured") result = result.filter(a => a.is_featured);
    else if (statusFilter === "scheduled") result = result.filter(a => a.status === "published" && a.published_at && new Date(a.published_at) > new Date());
    else if (statusFilter === "published") result = result.filter(a => a.status === "published" && (!a.published_at || new Date(a.published_at) <= new Date()));
    else if (statusFilter !== "all") result = result.filter(a => a.status === statusFilter);

    // Author
    if (authorFilter !== "all") result = result.filter(a => a.author_name === authorFilter);

    // Category
    if (categoryFilter !== "all") result = result.filter(a => a.category_label === categoryFilter);

    // Review Status
    if (reviewFilter !== "all") {
      const now = new Date();
      result = result.filter(a => {
        if (!a.last_reviewed_date && !a.published_at) return false;
        const refDate = a.last_reviewed_date ? new Date(a.last_reviewed_date) : new Date(a.published_at);
        const diffDays = (now - refDate) / (1000 * 60 * 60 * 24);
        
        if (reviewFilter === "needs_review") return diffDays >= 180;
        if (reviewFilter === "recently_reviewed") return diffDays < 180;
        if (reviewFilter === "overdue") return diffDays >= 365;
        return true;
      });
    }

    // Sorting
    result = [...result]; // Prevent mutating original array
    if (sortFilter === "likes") result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    else if (sortFilter === "saves") result.sort((a, b) => (b.saves_count || 0) - (a.saves_count || 0));
    else if (sortFilter === "shares") result.sort((a, b) => (b.shares_count || 0) - (a.shares_count || 0));
    else if (sortFilter === "oldest") result.sort((a, b) => new Date(a.published_at || 0) - new Date(b.published_at || 0));
    else if (sortFilter === "newest") result.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
    
    return result;
  })();

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = [...new Set(articles.map(a => a.category_label).filter(Boolean))];
  const authors = [...new Set(articles.map(a => a.author_name).filter(Boolean))];

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
    { key: "review_status", label: "Review Status", render: (row) => {
      if (!row.last_reviewed_date && !row.published_at) return <span style={{ color: "#94a3b8" }}>—</span>;
      const refDate = row.last_reviewed_date ? new Date(row.last_reviewed_date) : new Date(row.published_at);
      const diffDays = (new Date() - refDate) / (1000 * 60 * 60 * 24);
      
      if (diffDays >= 365) return <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "12px" }}>🚨 Overdue</span>;
      if (diffDays >= 180) return <span style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "12px" }}>⚠️ Due Soon</span>;
      return <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "12px" }}>✅ Good</span>;
    }},
    { key: "author_name", label: "Author" },
    { key: "status", label: "Status", render: (row) => {
      const isScheduled = row.status === "published" && row.published_at && new Date(row.published_at) > new Date();
      return (
        <span className={`admin-badge ${row.status === "draft" ? "admin-badge-inactive" : isScheduled ? "admin-badge-scheduled" : "admin-badge-active"}`}>
          {row.status === "draft" ? "Draft" : isScheduled ? "Scheduled" : "Published"}
        </span>
      );
    }},
    { key: "likes_count", label: "Likes", render: (row) => (
      <span style={{ fontWeight: "bold", color: "#64748b" }}>{row.likes_count || 0}</span>
    )},
    { key: "saves_count", label: "Saves", render: (row) => (
      <span style={{ fontWeight: "bold", color: "#64748b" }}>{row.saves_count || 0}</span>
    )},
    { key: "shares_count", label: "Shares", render: (row) => (
      <span style={{ fontWeight: "bold", color: "#64748b" }}>{row.shares_count || 0}</span>
    )},
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
          <p className="admin-page-subtitle">{filtered.length} matching articles out of {articles.length} total</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Search articles by title or author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-form-input"
            style={{ width: '300px', padding: '8px 12px' }}
          />
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <button className="admin-btn admin-btn-primary" onClick={() => router.push('/admin/articles/new')}>
              + New Article
            </button>
          </RoleGuard>
        </div>
      </div>

      {/* Advanced Dropdown Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        
        <select className="admin-form-select" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="featured">Featured (⭐)</option>
        </select>

        <select className="admin-form-select" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }} value={authorFilter} onChange={e => setAuthorFilter(e.target.value)}>
          <option value="all">All Authors</option>
          {authors.map(author => <option key={author} value={author}>{author}</option>)}
        </select>

        <select className="admin-form-select" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select className="admin-form-select" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }} value={reviewFilter} onChange={e => setReviewFilter(e.target.value)}>
          <option value="all">All Review Status</option>
          <option value="recently_reviewed">✅ Recently Reviewed</option>
          <option value="needs_review">⚠️ Needs Review</option>
          <option value="overdue">🚨 Overdue</option>
        </select>

        <select className="admin-form-select" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }} value={sortFilter} onChange={e => setSortFilter(e.target.value)}>
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="likes">Sort: Most Liked</option>
          <option value="saves">Sort: Most Saved</option>
          <option value="shares">Sort: Most Shared</option>
        </select>

        {(statusFilter !== "all" || authorFilter !== "all" || categoryFilter !== "all" || reviewFilter !== "all" || sortFilter !== "newest" || searchQuery !== "") && (
          <button 
            className="admin-btn admin-btn-ghost admin-btn-sm" 
            onClick={() => {
              setStatusFilter("all"); setAuthorFilter("all"); setCategoryFilter("all"); setReviewFilter("all"); setSortFilter("newest"); setSearchQuery("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No articles found. Create your first article!"
        actions={(row) => (
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleFeatured(row)} title="Toggle featured">
                {row.is_featured ? "★" : "☆"}
              </button>
              <a 
                className="admin-btn admin-btn-ghost admin-btn-sm" 
                href={row.status === "published" && row.published_at && new Date(row.published_at) > new Date() ? `/${row.slug}?preview=true` : `/${row.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View
              </a>
              <a className="admin-btn admin-btn-ghost admin-btn-sm" href={`/admin/articles/${row.id}/edit`}>
                Edit
              </a>
              <RoleGuard user={user} allowedRoles={["super_admin"]}>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(row.id)}>
                  Delete
                </button>
              </RoleGuard>
            </div>
          </RoleGuard>
        )}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 mb-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white border border-indigo-600 shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
