"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLiveEventById } from "../../../../app/actions/liveEventsActions";
import { getUpdatesByEvent, addLiveUpdate, updateLiveUpdate, deleteLiveUpdate } from "../../../../app/actions/liveUpdatesActions";
import { uploadMediaToSupabase } from "../../../../lib/adminHelpers";
import RoleGuard from "../../../../components/admin/RoleGuard";
import Link from "next/link";

export default function AdminLiveEventDetail() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  const [event, setEvent] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      if (!eventId) return;
      const { data, error } = await getLiveEventById(eventId);
      if (error || !data) {
        showToast("Event not found", "error");
        setTimeout(() => router.push("/admin/live-updates"), 2000);
      } else {
        setEvent(data);
      }
      setEventLoading(false);
    }
    fetchEventDetails();
  }, [eventId, router]);

  useEffect(() => {
    async function fetchUpdates() {
      if (!eventId) return;
      const { data } = await getUpdatesByEvent(eventId);
      setUpdates(data || []);
      setUpdatesLoading(false);
    }
    fetchUpdates();
  }, [eventId]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAddUpdate(formData) {
    const res = await addLiveUpdate({ event_id: eventId, ...formData });
    if (res.error) {
      showToast(res.error, "error");
    } else {
      showToast("Update posted!");
      // Refresh updates list
      const { data } = await getUpdatesByEvent(eventId);
      setUpdates(data || []);
    }
  }

  async function handleEditUpdate(id, formData) {
    const res = await updateLiveUpdate(id, formData);
    if (res.error) {
      showToast(res.error, "error");
    } else {
      showToast("Update edited");
      const { data } = await getUpdatesByEvent(eventId);
      setUpdates(data || []);
    }
  }

  async function handleDeleteUpdate(id) {
    if (!confirm("Are you sure you want to delete this update?")) return;
    const res = await deleteLiveUpdate(id);
    if (res.error) {
      showToast(res.error, "error");
    } else {
      showToast("Update deleted");
      const { data } = await getUpdatesByEvent(eventId);
      setUpdates(data || []);
    }
  }

  if (eventLoading) return <p style={{ color: "#71717a", padding: 20 }}>Loading event details...</p>;
  if (!event) return <p style={{ color: "red", padding: 20 }}>Event not found.</p>;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div className="admin-page-header" style={{ marginBottom: 20 }}>
        <div>
          <Link href="/admin/live-updates" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem", marginBottom: 8, display: "inline-block" }}>
            ← Back to Events
          </Link>
          <h1 className="admin-page-title">Manage: {event.title}</h1>
          <p className="admin-page-subtitle">
            Status: <span style={{ fontWeight: "bold", color: event.status === "active" ? "green" : "gray" }}>{(event.status || "inactive").toUpperCase()}</span>
            {" · "}{updates.length} updates
          </p>
        </div>
      </div>

      <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
        <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>

          {/* Add New Update Form */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Post New Update</h3>
            <UpdateForm onSubmit={handleAddUpdate} />
          </div>

          {/* Updates Feed */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
              Updates Feed ({updates.length})
            </h3>
            {updatesLoading ? (
              <p style={{ color: "#71717a" }}>Loading updates...</p>
            ) : updates.length === 0 ? (
              <p style={{ color: "#71717a" }}>No updates yet. Post one above.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {updates.map((update) => (
                  <UpdateItem
                    key={update.id}
                    update={update}
                    onEdit={handleEditUpdate}
                    onDelete={handleDeleteUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </RoleGuard>

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ─── Update Form Component ─── */
function UpdateForm({ onSubmit, initialData = null, onCancel = null }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [isFirst, setIsFirst] = useState(initialData?.is_first || false);
  const [isPinned, setIsPinned] = useState(initialData?.is_pinned || false);
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaToSupabase(file);
      if (url) setImages(prev => [...prev, url]);
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ title, content, time, is_first: isFirst, is_pinned: isPinned, images });
    if (!initialData) {
      setTitle("");
      setContent("");
      setTime("");
      setIsFirst(false);
      setIsPinned(false);
      setImages([]);
    }
    setSaving(false);
  };

  const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", color: "#1e293b", outline: "none", background: "#fff" };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Update Title</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline for this update..." />
        </div>
        <div>
          <label style={labelStyle}>Time Label</label>
          <input style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 2:30 PM (Just now)" />
          <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 4 }}>Leave empty to auto-generate.</p>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Content *</label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          rows={4}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write the update content..."
        />
      </div>

      <div>
        <label style={labelStyle}>Images</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img src={img} alt={`img-${idx}`} style={{ height: 80, width: 80, objectFit: "cover", borderRadius: 8 }} />
              <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: "0.7rem", cursor: "pointer" }}>×</button>
            </div>
          ))}
          <label style={{ width: 80, height: 80, border: "2px dashed #cbd5e1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: uploading ? "wait" : "pointer", fontSize: "1.5rem", color: "#94a3b8" }}>
            {uploading ? "⏳" : "+"}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#334155", cursor: "pointer" }}>
          <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
          📌 Pin to top
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#334155", cursor: "pointer" }}>
          <input type="checkbox" checked={isFirst} onChange={(e) => setIsFirst(e.target.checked)} />
          ⭐ Mark as "First Update"
        </label>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={saving || uploading} className="admin-btn admin-btn-primary">
          {saving ? "Posting..." : initialData ? "💾 Save Changes" : "🚀 Post Update"}
        </button>
        {onCancel && (
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

/* ─── Update Item Component ─── */
function UpdateItem({ update, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div style={{ border: "1px solid #e2e8f0", padding: "1rem", borderRadius: 8, background: "#f8fafc" }}>
        <UpdateForm
          initialData={update}
          onSubmit={async (data) => {
            await onEdit(update.id, data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", padding: "1rem", borderRadius: 8, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>{update.time || "—"}</span>
          {update.is_pinned && <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "0.7rem", padding: "2px 6px", borderRadius: 4, fontWeight: "bold" }}>📌 PINNED</span>}
          {update.is_first && <span style={{ background: "#e0f2fe", color: "#0284c7", fontSize: "0.7rem", padding: "2px 6px", borderRadius: 4, fontWeight: "bold" }}>⭐ FIRST</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIsEditing(true)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Edit</button>
          <button onClick={() => onDelete(update.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Delete</button>
        </div>
      </div>
      {update.title && <h4 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>{update.title}</h4>}
      <p style={{ margin: 0, color: "#334155", whiteSpace: "pre-wrap", fontSize: "0.95rem", lineHeight: 1.6 }}>{update.content}</p>
      {update.images && update.images.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {update.images.map((img, idx) => (
            <img key={idx} src={img} alt={`media-${idx}`} style={{ height: 80, borderRadius: 8, objectFit: "cover" }} />
          ))}
        </div>
      )}
    </div>
  );
}
