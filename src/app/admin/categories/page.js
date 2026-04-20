"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) console.error("Error fetching categories:", error);
    setCategories(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(formData) {
    if (editCategory) {
      const { error } = await supabase.from("categories").update(formData).eq("id", editCategory.id);
      if (error) { showToast("Failed to update: " + error.message, "error"); return; }
      showToast("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert([formData]);
      if (error) { showToast("Failed to create: " + error.message, "error"); return; }
      showToast("Category created");
    }
    setShowModal(false);
    setEditCategory(null);
    fetchCategories();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category? Articles using it won't be affected.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { showToast("Failed to delete", "error"); return; }
    showToast("Category deleted");
    fetchCategories();
  }

  async function handleReorder(category, direction) {
    const currentIndex = categories.findIndex(c => c.id === category.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= categories.length) return;

    const current = categories[currentIndex];
    const swap = categories[swapIndex];

    await Promise.all([
      supabase.from("categories").update({ sort_order: swap.sort_order }).eq("id", current.id),
      supabase.from("categories").update({ sort_order: current.sort_order }).eq("id", swap.id),
    ]);

    showToast("Category reordered");
    fetchCategories();
  }

  if (loading) return <p style={{ color: "#71717a" }}>Loading categories...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">{categories.length} categories · Drag to reorder navigation</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditCategory(null); setShowModal(true); }}>
            + New Category
          </button>
        </RoleGuard>
      </div>

      {categories.length === 0 ? (
        <div className="admin-empty-state">No categories found. Create your first category!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((cat, idx) => (
            <div key={cat.id || idx} className="admin-section" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: 16 }}>
              {/* Reorder buttons */}
              <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button
                    onClick={() => handleReorder(cat, "up")}
                    disabled={idx === 0}
                    style={{
                      background: "none", border: "1px solid #1e1e2e", color: idx === 0 ? "#2a2a3a" : "#71717a",
                      padding: "2px 8px", cursor: idx === 0 ? "default" : "pointer", fontSize: "0.8rem"
                    }}
                  >▲</button>
                  <button
                    onClick={() => handleReorder(cat, "down")}
                    disabled={idx === categories.length - 1}
                    style={{
                      background: "none", border: "1px solid #1e1e2e",
                      color: idx === categories.length - 1 ? "#2a2a3a" : "#71717a",
                      padding: "2px 8px", cursor: idx === categories.length - 1 ? "default" : "pointer", fontSize: "0.8rem"
                    }}
                  >▼</button>
                </div>
              </RoleGuard>

              {/* Category info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.7rem", color: "#52525b", background: "#1a1a24", padding: "2px 8px", minWidth: 24, textAlign: "center" }}>
                    #{cat.sort_order}
                  </span>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>{cat.label}</span>
                  <span style={{ color: "#52525b", fontSize: "0.8rem" }}>/{cat.slug}</span>
                </div>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {cat.subcategories.map((sub, si) => (
                      <span key={si} className="admin-badge admin-badge-editor" style={{ fontSize: "0.68rem" }}>
                        {sub.label || sub.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditCategory(cat); setShowModal(true); }}>
                    Edit
                  </button>
                  <RoleGuard user={user} allowedRoles={["super_admin"]}>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(cat.id)}>
                      Delete
                    </button>
                  </RoleGuard>
                </div>
              </RoleGuard>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CategoryModal
          category={editCategory}
          nextOrder={categories.length + 1}
          onClose={() => { setShowModal(false); setEditCategory(null); }}
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

function CategoryModal({ category, nextOrder, onClose, onSave }) {
  const [form, setForm] = useState({
    label: category?.label || "",
    slug: category?.slug || "",
    sort_order: category?.sort_order ?? nextOrder,
    subcategories: category?.subcategories || [],
  });
  const [newSub, setNewSub] = useState({ label: "", slug: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function autoSlug(label) {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleLabelChange(e) {
    const label = e.target.value;
    setForm({ ...form, label, slug: form.slug || autoSlug(label) });
  }

  function addSubcategory() {
    if (!newSub.label) return;
    setForm({
      ...form,
      subcategories: [...form.subcategories, { label: newSub.label, slug: newSub.slug || autoSlug(newSub.label) }],
    });
    setNewSub({ label: "", slug: "" });
  }

  function removeSub(idx) {
    setForm({ ...form, subcategories: form.subcategories.filter((_, i) => i !== idx) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal-title">{category ? "Edit Category" : "Create Category"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Label *</label>
              <input className="admin-form-input" name="label" value={form.label} onChange={handleLabelChange} required placeholder="e.g. Green Card" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Sort Order</label>
              <input className="admin-form-input" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Slug</label>
            <input className="admin-form-input" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" />
          </div>

          {/* Subcategories */}
          <div className="admin-form-group">
            <label className="admin-form-label">Subcategories</label>
            {form.subcategories.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {form.subcategories.map((sub, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d0d14", padding: "8px 12px", border: "1px solid #1e1e2e" }}>
                    <span style={{ flex: 1, color: "#e4e4e7", fontSize: "0.85rem" }}>{sub.label} <span style={{ color: "#52525b" }}>/{sub.slug}</span></span>
                    <button type="button" onClick={() => removeSub(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <input className="admin-form-input" placeholder="Subcategory label" value={newSub.label}
                onChange={(e) => setNewSub({ ...newSub, label: e.target.value, slug: autoSlug(e.target.value) })} style={{ flex: 1 }} />
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addSubcategory}>+ Add</button>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{category ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
