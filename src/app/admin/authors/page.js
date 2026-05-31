"use client";
import { useEffect, useState } from "react";
import { 
  getAllAuthors, 
  createAuthor, 
  updateAuthor, 
  deleteAuthor as removeAuthor 
} from "../../../app/actions/authorActions";
import { revalidateServerPath } from "../../../app/actions/revalidate";
import { uploadMediaToSupabase } from "../../../lib/adminHelpers";
import DataTable from "../../../components/admin/DataTable";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => {
    fetchAuthors();
  }, []);

  async function fetchAuthors() {
    setLoading(true);
    const data = await getAllAuthors();
    setAuthors(data || []);
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
      const res = await updateAuthor(id, updateData);
      error = res.error;
    } else {
      const res = await createAuthor(formData);
      error = res.error;
    }

    if (error) { 
      showToast(error, "error"); 
      return; 
    }
    
    // Revalidate paths since authors are used across the site
    await revalidateServerPath("/author/[slug]", "page");
    await revalidateServerPath("/", "layout");
    
    showToast(editItem ? "Author updated" : "Author created");
    setShowModal(false);
    setEditItem(null);
    fetchAuthors();
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this author?")) return;
    const { error } = await removeAuthor(id);
    if (error) { showToast(error, "error"); return; }
    showToast("Author deleted");
    fetchAuthors();
  }

  const columns = [
    { key: "name", label: "Author", render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {row.photo_url ? (
           <img src={row.photo_url} alt={row.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
           <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", color: "#fff" }}>
             {row.name?.charAt(0).toUpperCase()}
           </div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.name}</span>
          <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{row.role}</span>
        </div>
      </div>
    )},
    { key: "slug", label: "Slug", render: (row) => (
      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>/{row.slug}</span>
    )},
    { key: "social", label: "Socials", render: (row) => (
       <div style={{ display: "flex", gap: 8 }}>
         {row.twitter_url && <a href={row.twitter_url} target="_blank" rel="noreferrer" style={{ color: "#1da1f2", textDecoration: "none" }}>X</a>}
         {row.linkedin_url && <a href={row.linkedin_url} target="_blank" rel="noreferrer" style={{ color: "#0077b5", textDecoration: "none" }}>IN</a>}
       </div>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading authors...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Authors</h1>
          <p className="admin-page-subtitle">{authors.length} total authors</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            + New Author
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        data={authors}
        emptyMessage="No authors found."
        actions={(row) => (
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditItem(row); setShowModal(true); }}>
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
        <AuthorModal
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
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

function AuthorModal({ item, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: item?.name || "",
    slug: item?.slug || "",
    role: item?.role || "Immigration Analyst",
    bio: item?.bio || "",
    photo_url: item?.photo_url || "",
    twitter_url: item?.twitter_url || "",
    linkedin_url: item?.linkedin_url || "",
    email: item?.email || "",
    specialty: item?.specialty?.join(", ") || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const updates = { [name]: value };
      // Auto-generate slug if editing name and slug hasn't been manually set
      if (name === "name" && !item?.id) {
        updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
      if (url) setForm(prev => ({ ...prev, photo_url: url }));
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    // Process specialty string back to array
    const specialtiesArray = form.specialty
      ? form.specialty.split(",").map(s => s.trim()).filter(Boolean)
      : [];
      
    const payload = { 
      ...form,
      specialty: specialtiesArray
    };

    if (item?.id) payload.id = item.id;
    await onSave(payload);
    setSaving(false);
  }

  // Styles
  const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", color: "#1e293b", outline: "none", transition: "border-color 0.2s", background: "#fff" };
  const textareaStyle = { ...inputStyle, resize: "vertical", fontFamily: "inherit" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 820, maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
              {item ? "Edit Author" : "Create Author"}
            </h3>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: item ? "#dbeafe" : "#dcfce7", color: item ? "#1d4ed8" : "#15803d" }}>
              {item ? "Editing" : "New"}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Allen"
                />
              </div>

              <div>
                <label style={labelStyle}>Slug (URL Path) *</label>
                <input
                  style={{ ...inputStyle, fontFamily: "monospace", color: "#64748b" }}
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  placeholder="e.g. allen"
                />
              </div>

              <div>
                <label style={labelStyle}>Role *</label>
                <input
                  style={inputStyle}
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Senior Immigration Analyst"
                />
              </div>

              <div>
                <label style={labelStyle}>Specialties (comma separated)</label>
                <input
                  style={inputStyle}
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="e.g. H-1B Visa, Green Card, USCIS Updates"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                  style={{ ...textareaStyle, height: 120 }}
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Author biography..."
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Image Upload Area */}
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                <label style={labelStyle}>Profile Photo</label>
                
                {form.photo_url && (
                  <div style={{ marginBottom: "1rem", position: "relative", width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "2px solid #e2e8f0" }}>
                    <img src={form.photo_url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                
                <input
                  type="text"
                  name="photo_url"
                  value={form.photo_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={{ ...inputStyle, marginBottom: "0.75rem", fontSize: "0.85rem" }}
                />
                
                <div style={{ position: "relative" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                    disabled={uploading}
                  />
                  <div style={{ width: "100%", padding: "10px", background: "#fff", border: "1px dashed #cbd5e1", borderRadius: 8, textAlign: "center", fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </div>
                </div>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "1.25rem", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    style={inputStyle}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label style={labelStyle}>X (Twitter) URL</label>
                  <input
                    style={inputStyle}
                    name="twitter_url"
                    value={form.twitter_url}
                    onChange={handleChange}
                    placeholder="https://x.com/..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input
                    style={inputStyle}
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
            <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost" style={{ padding: "10px 20px" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="admin-btn admin-btn-primary" style={{ padding: "10px 24px" }}>
              {saving ? "Saving..." : (item ? "Save Changes" : "Create Author")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
