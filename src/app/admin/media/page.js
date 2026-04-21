"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminMediaLibrary() {
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => { fetchMedia(); }, []);

  async function fetchMedia() {
    setLoading(true);
    const [{ data: videoData }, { data: articleData }] = await Promise.all([
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("articles").select("id, title, main_image, image_caption, created_at").order("created_at", { ascending: false }),
    ]);
    setVideos(videoData || []);
    // Extract images from articles that have main_image
    setImages((articleData || []).filter(a => a.main_image));
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSaveVideo(formData) {
    if (editItem) {
      const { error } = await supabase.from("videos").update(formData).eq("id", editItem.id);
      if (error) { showToast("Failed to update: " + error.message, "error"); return; }
      showToast("Video updated");
    } else {
      const { error } = await supabase.from("videos").insert([formData]);
      if (error) { showToast("Failed to add: " + error.message, "error"); return; }
      showToast("Video added");
    }
    setShowModal(false);
    setEditItem(null);
    fetchMedia();
  }

  async function handleDeleteVideo(id) {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) { showToast("Failed to delete", "error"); return; }
    showToast("Video deleted");
    fetchMedia();
  }

  if (loading) return <p style={{ color: "#71717a" }}>Loading media library...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">{videos.length} videos · {images.length} article images</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            + Add Video
          </button>
        </RoleGuard>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        <button
          className={`admin-btn admin-btn-sm ${activeTab === "videos" ? "admin-btn-primary" : "admin-btn-ghost"}`}
          onClick={() => setActiveTab("videos")}
        >🎬 Videos ({videos.length})</button>
        <button
          className={`admin-btn admin-btn-sm ${activeTab === "images" ? "admin-btn-primary" : "admin-btn-ghost"}`}
          onClick={() => setActiveTab("images")}
        >🖼️ Images ({images.length})</button>
      </div>

      {/* Videos Grid */}
      {activeTab === "videos" && (
        videos.length === 0 ? (
          <div className="admin-empty-state">No videos found. Add your first video!</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {videos.map((video) => (
              <div key={video.id} className="admin-section" style={{ padding: 0, overflow: "hidden", marginBottom: 0 }}>
                {/* Thumbnail */}
                <div style={{ height: 160, background: "#f1f5f9", position: "relative", overflow: "hidden" }}>
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "2rem" }}>
                      🎬
                    </div>
                  )}
                  {video.category_label && (
                    <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(30,41,59,0.8)", color: "#fff", padding: "3px 10px", fontSize: "0.68rem", fontWeight: 600, borderRadius: "4px" }}>
                      {video.category_label}
                    </span>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: 16 }}>
                  <p style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {video.title}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {video.created_at ? new Date(video.created_at).toLocaleDateString() : ""}
                  </p>
                  <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ flex: 1 }} onClick={() => { setEditItem(video); setShowModal(true); }}>Edit</button>
                      <RoleGuard user={user} allowedRoles={["super_admin"]}>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteVideo(video.id)}>🗑</button>
                      </RoleGuard>
                    </div>
                  </RoleGuard>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Images Grid */}
      {activeTab === "images" && (
        images.length === 0 ? (
          <div className="admin-empty-state">No article images found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {images.map((img) => (
              <div key={img.id} className="admin-section" style={{ padding: 0, overflow: "hidden", marginBottom: 0 }}>
                <div style={{ height: 150, background: "#f1f5f9", overflow: "hidden" }}>
                  <img src={img.main_image} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }} />
                </div>
                <div style={{ padding: 12 }}>
                  <p style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {img.title}
                  </p>
                  {img.image_caption && (
                    <p style={{ fontSize: "0.7rem", color: "#64748b", marginTop: 4 }}>{img.image_caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {showModal && (
        <VideoModal
          video={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSaveVideo}
        />
      )}

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

function VideoModal({ video, onClose, onSave }) {
  const [form, setForm] = useState({
    title: video?.title || "",
    description: video?.description || "",
    video_url: video?.video_url || "",
    thumbnail: video?.thumbnail || "",
    category_label: video?.category_label || "",
    article_id: video?.article_id || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal-title">{video ? "Edit Video" : "Add Video"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Title *</label>
            <input className="admin-form-input" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Video URL *</label>
            <input className="admin-form-input" name="video_url" value={form.video_url} onChange={handleChange} required placeholder="https://..." />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Thumbnail URL</label>
            <input className="admin-form-input" name="thumbnail" value={form.thumbnail} onChange={handleChange} />
          </div>
          {form.thumbnail && (
            <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", padding: 8, background: "#f8fafc", borderRadius: "8px" }}>
              <img src={form.thumbnail} alt="Preview" style={{ width: "100%", maxHeight: 150, objectFit: "cover", borderRadius: "4px" }}
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Category Label</label>
              <input className="admin-form-input" name="category_label" value={form.category_label} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Linked Article ID</label>
              <input className="admin-form-input" name="article_id" value={form.article_id} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea className="admin-form-textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{video ? "Update" : "Add Video"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
