"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLocation, setEditLocation] = useState(null);
  const [toast, setToast] = useState(null);
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => { fetchLocations(); }, []);

  async function fetchLocations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    } else {
      // Structure the data into parent -> children
      const topLevel = data.filter(loc => !loc.parent_id);
      const withChildren = topLevel.map(parent => {
        return {
          ...parent,
          children: data.filter(loc => loc.parent_id === parent.id).sort((a, b) => a.name.localeCompare(b.name))
        };
      });
      setLocations(withChildren);
    }
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(formData) {
    if (editLocation) {
      const { error } = await supabase.from("locations").update(formData).eq("id", editLocation.id);
      if (error) { showToast("Failed to update: " + error.message, "error"); return; }
      showToast("Location updated");
    } else {
      const { error } = await supabase.from("locations").insert([formData]);
      if (error) { showToast("Failed to create: " + error.message, "error"); return; }
      showToast("Location created");
    }
    setShowModal(false);
    setEditLocation(null);
    fetchLocations();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this location? Articles using it won't be affected but they will lose their location tag.")) return;
    
    // Check if it has children first
    const { data: children } = await supabase.from("locations").select("id").eq("parent_id", id).limit(1);
    if (children && children.length > 0) {
      showToast("Cannot delete a location that has sub-locations. Delete or move them first.", "error");
      return;
    }

    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) { showToast("Failed to delete", "error"); return; }
    showToast("Location deleted");
    fetchLocations();
  }

  if (loading) return <p style={{ color: "#71717a" }}>Loading locations...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Locations</h1>
          <p className="admin-page-subtitle">{locations.length} States / Regions</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditLocation(null); setShowModal(true); }}>
            + New Location
          </button>
        </RoleGuard>
      </div>

      {locations.length === 0 ? (
        <div className="admin-empty-state">No locations found. Create your first state or region!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {locations.map((loc) => (
            <div key={loc.id} className="admin-section" style={{ marginBottom: 0, display: "flex", alignItems: "flex-start", gap: 16 }}>
              
              {/* Location info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.2rem" }}>📍</span>
                  <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>{loc.name}</span>
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>/{loc.slug}</span>
                  <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ padding: "2px 6px", fontSize: "0.7rem", marginLeft: "10px" }} onClick={() => { setEditLocation(loc); setShowModal(true); }}>
                      Edit
                    </button>
                    <RoleGuard user={user} allowedRoles={["super_admin"]}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ padding: "2px 6px", fontSize: "0.7rem", color: "#ef4444" }} onClick={() => handleDelete(loc.id)}>
                        Delete
                      </button>
                    </RoleGuard>
                  </RoleGuard>
                </div>

                {/* Sub-locations (Cities/Counties) */}
                {loc.children && loc.children.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", paddingLeft: "32px" }}>
                    {loc.children.map((child) => (
                      <div key={child.id} style={{ display: "flex", alignItems: "center", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                        <span style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#334155", fontWeight: 500 }}>
                          {child.name} <span style={{ color: "#94a3b8", fontWeight: 400 }}>/{child.slug}</span>
                        </span>
                        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
                          <button 
                            onClick={() => { setEditLocation(child); setShowModal(true); }}
                            style={{ padding: "4px 8px", background: "#e2e8f0", border: "none", borderLeft: "1px solid #cbd5e1", cursor: "pointer", fontSize: "0.75rem", color: "#475569" }}
                          >
                            ✎
                          </button>
                          <RoleGuard user={user} allowedRoles={["super_admin"]}>
                            <button 
                              onClick={() => handleDelete(child.id)}
                              style={{ padding: "4px 8px", background: "#fee2e2", border: "none", borderLeft: "1px solid #fca5a5", cursor: "pointer", fontSize: "0.75rem", color: "#ef4444" }}
                            >
                              ✕
                            </button>
                          </RoleGuard>
                        </RoleGuard>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <LocationModal
          location={editLocation}
          parentOptions={locations.map(l => ({ id: l.id, name: l.name }))}
          onClose={() => { setShowModal(false); setEditLocation(null); }}
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

function LocationModal({ location, parentOptions, onClose, onSave }) {
  const [form, setForm] = useState({
    name: location?.name || "",
    slug: location?.slug || "",
    parent_id: location?.parent_id || null,
  });

  function handleChange(e) {
    const value = e.target.value === "none" ? null : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  function autoSlug(label) {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleLabelChange(e) {
    const nameStr = e.target.value;
    setForm({ ...form, name: nameStr, slug: form.slug || autoSlug(nameStr) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal-title">{location ? "Edit Location" : "Create Location"}</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Location Name *</label>
            <input className="admin-form-input" name="name" value={form.name} onChange={handleLabelChange} required placeholder="e.g. Texas or Houston" />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Slug</label>
            <input className="admin-form-input" name="slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="auto-generated" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Parent State (Optional)</label>
            <select className="admin-form-input" name="parent_id" value={form.parent_id || "none"} onChange={handleChange}>
              <option value="none">No Parent (Top-Level State)</option>
              {parentOptions.map((opt) => {
                // Prevent a location from being its own parent
                if (location && opt.id === location.id) return null;
                return <option key={opt.id} value={opt.id}>{opt.name}</option>;
              })}
            </select>
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
              Leave blank to create a State. Select a State to create a City/County.
            </p>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{location ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
