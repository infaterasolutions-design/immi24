"use client";
import { useEffect, useState } from "react";
import { getAdminLiveEvents, saveLiveEvent, deleteLiveEvent } from "../../../lib/adminHelpers";
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
    const data = await getAdminLiveEvents();
    setEvents(data);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(formData) {
    const { error } = await saveLiveEvent(formData);
    if (error) { showToast("Failed to save event", "error"); return; }
    showToast(editEvent ? "Event updated" : "Event created");
    setShowModal(false);
    setEditEvent(null);
    fetchEvents();
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this live event?")) return;
    const { error } = await deleteLiveEvent(id);
    if (error) { showToast("Failed to delete event", "error"); return; }
    showToast("Event deleted");
    fetchEvents();
  }

  const columns = [
    { key: "title", label: "Title", render: (row) => (
      <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.title}</span>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`admin-badge ${row.status === "active" ? "admin-badge-active" : "admin-badge-inactive"}`}>
        {row.status === "active" ? "🟢 Active" : "⚫ Inactive"}
      </span>
    )},
    { key: "created_at", label: "Created", render: (row) => (
      <span style={{ color: "#71717a", fontSize: "0.8rem" }}>
        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
      </span>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading live events...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Live Updates</h1>
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
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    status: event?.status || "active",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (event?.id) payload.id = event.id;
    onSave(payload);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal-title">{event ? "Edit Live Event" : "Create Live Event"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Title</label>
            <input className="admin-form-input" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea className="admin-form-textarea" name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select className="admin-form-select" name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{event ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
