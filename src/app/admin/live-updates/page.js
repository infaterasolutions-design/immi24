"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllLiveEvents, createLiveEvent, updateLiveEvent, deleteLiveEvent as removeLiveEvent } from "../../../app/actions/liveEventsActions";
import { uploadMediaToSupabase } from "../../../lib/adminHelpers";
import DataTable from "../../../components/admin/DataTable";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminLiveUpdates() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data } = await getAllLiveEvents();
    setEvents(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(formData) {
    let error;
    if (formData.id) {
      const { id, ...updateData } = formData;
      const res = await updateLiveEvent(id, updateData);
      error = res.error;
    } else {
      const res = await createLiveEvent(formData);
      error = res.error;
    }

    if (error) { 
      showToast(error, "error"); 
      return; 
    }
    showToast(editEvent ? "Event updated" : "Event created");
    setShowModal(false);
    setEditEvent(null);
    fetchEvents();
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this live event and ALL its updates?")) return;
    const { error } = await removeLiveEvent(id);
    if (error) { showToast(error, "error"); return; }
    showToast("Event deleted");
    fetchEvents();
  }

  const columns = [
    { key: "title", label: "Title", render: (row) => (
      <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.title}</span>
    )},
    { key: "slug", label: "Slug", render: (row) => (
      <span style={{ color: "#64748b", fontSize: "0.8rem", fontFamily: "monospace" }}>{row.slug || "—"}</span>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`admin-badge ${row.status === "active" ? "admin-badge-active" : "admin-badge-inactive"}`}>
        {row.status === "active" ? "🟢 Active" : "⚫ Inactive"}
      </span>
    )},
    { key: "date", label: "Date", render: (row) => (
      <span style={{ color: "#71717a", fontSize: "0.8rem" }}>
        {row.date || "—"}
      </span>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading live events...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Live Events</h1>
          <p className="admin-page-subtitle">{events.length} events · {events.filter(e => e.status === "active").length} active</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditEvent(null); setShowModal(true); }}>
            + New Event
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        data={events}
        emptyMessage="No live events found."
        actions={(row) => (
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Link href={`/admin/live-updates/${row.id}`} className="admin-btn admin-btn-primary admin-btn-sm" style={{textDecoration: "none"}}>
                Manage Updates
              </Link>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditEvent(row); setShowModal(true); }}>
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

      {showModal && (
        <LiveEventModal
          event={editEvent}
          onClose={() => { setShowModal(false); setEditEvent(null); }}
          onSave={handleSave}
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

function LiveEventModal({ event, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!event?.slug);

  const [form, setForm] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    description: event?.description || "",
    status: event?.status || "active",
    date: event?.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    hero_image: event?.hero_image || "",
    image_caption: event?.image_caption || "",
    header_context: event?.header_context || "",
  });

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => {
      const updates = { [name]: value };

      // Auto-generate slug when title changes (unless manually edited)
      if (name === "title" && !slugManuallyEdited) {
        updates.slug = generateSlug(value);
      }

      // Track if user manually edits slug
      if (name === "slug") {
        setSlugManuallyEdited(true);
        updates.slug = generateSlug(value);
      }

      return { ...prev, ...updates };
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaToSupabase(file);
      if (url) setForm(prev => ({ ...prev, hero_image: url }));
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (event?.id) payload.id = event.id;
    await onSave(payload);
    setSaving(false);
  }

  // Styles
  const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", color: "#1e293b", outline: "none", transition: "border-color 0.2s", background: "#fff" };
  const textareaStyle = { ...inputStyle, resize: "vertical", fontFamily: "inherit" };
  const sectionStyle = { background: "#f8fafc", borderRadius: 10, padding: "1.25rem", border: "1px solid #e2e8f0" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 820, maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
              {event ? "Edit Live Event" : "Create Live Event"}
            </h3>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: event ? "#dbeafe" : "#dcfce7", color: event ? "#1d4ed8" : "#15803d" }}>
              {event ? "Editing" : "New"}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Title */}
              <div>
                <label style={labelStyle}>Event Title *</label>
                <input
                  style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter event title..."
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label style={labelStyle}>URL Slug</label>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <span style={{ padding: "10px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRight: "none", borderRadius: "8px 0 0 8px", fontSize: "0.85rem", color: "#64748b", whiteSpace: "nowrap" }}>/live-updates/</span>
                  <input
                    style={{ ...inputStyle, borderRadius: "0 8px 8px 0", fontFamily: "monospace", fontSize: "0.9rem" }}
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto-generated-slug"
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>Auto-generated from title. Edit to customize.</p>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={textareaStyle}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the event..."
                />
              </div>

              {/* Header Context */}
              <div>
                <label style={labelStyle}>Header Context / Intro Paragraph</label>
                <textarea
                  style={textareaStyle}
                  name="header_context"
                  value={form.header_context}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Context paragraph shown above the live feed..."
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Status & Date Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
                    <option value="active">🟢 Active</option>
                    <option value="inactive">⚫ Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Event Date</label>
                  <input
                    style={inputStyle}
                    type="date"
                    name="date_picker"
                    value={form.date_picker || ""}
                    onChange={(e) => {
                      const dateVal = e.target.value;
                      const formatted = new Date(dateVal + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                      setForm(prev => ({ ...prev, date: formatted, date_picker: dateVal }));
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>
                    Stored as: <strong>{form.date || "Today's date"}</strong>
                  </p>
                </div>
              </div>

              {/* Hero Image */}
              <div style={sectionStyle}>
                <label style={labelStyle}>Hero Image</label>
                {form.hero_image ? (
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    <img src={form.hero_image} alt="Hero" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }} />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, hero_image: "" }))}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: "0.9rem" }}
                    >×</button>
                  </div>
                ) : (
                  <div style={{ border: "2px dashed #cbd5e1", borderRadius: 8, padding: "2rem 1rem", textAlign: "center", cursor: "pointer", position: "relative" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                    />
                    <div style={{ fontSize: "2rem", marginBottom: 4 }}>📷</div>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                      {uploading ? "Uploading..." : "Click or drag to upload"}
                    </p>
                  </div>
                )}
              </div>

              {/* Image Caption */}
              <div>
                <label style={labelStyle}>Image Caption</label>
                <input
                  style={inputStyle}
                  name="image_caption"
                  value={form.image_caption}
                  onChange={handleChange}
                  placeholder="e.g., AP Photo / Reuters"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #e2e8f0" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 24px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", background: "#fff", color: "#64748b" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading || !form.title}
              style={{ padding: "10px 28px", border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", background: saving ? "#94a3b8" : "#4f46e5", color: "#fff", boxShadow: "0 4px 14px rgba(79,70,229,0.3)", transition: "all 0.2s" }}
            >
              {saving ? "Saving..." : event ? "💾 Update Event" : "🚀 Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
