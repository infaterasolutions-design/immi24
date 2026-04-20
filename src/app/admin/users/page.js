"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import DataTable from "../../../components/admin/DataTable";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const currentUser = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => {
    // Only Super Admin can access this page
    if (currentUser && currentUser.role !== "super_admin") {
      router.push("/admin");
      return;
    }
    fetchUsers();
  }, [currentUser, router]);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(formData) {
    if (editUser) {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: formData.role })
        .eq("id", editUser.id);
      if (error) { showToast("Failed to update role", "error"); return; }
      showToast("User role updated");
    } else {
      // For adding a new user role, we need the user_id from their Supabase auth account
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: formData.user_id, role: formData.role }]);
      if (error) {
        if (error.code === "23505") {
          showToast("This user already has a role assigned", "error");
        } else {
          showToast("Failed to add user: " + error.message, "error");
        }
        return;
      }
      showToast("User role assigned successfully");
    }
    setShowModal(false);
    setEditUser(null);
    fetchUsers();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this user's admin role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) { showToast("Failed to remove user", "error"); return; }
    showToast("User role removed");
    fetchUsers();
  }

  const columns = [
    { key: "user_id", label: "User ID", render: (row) => (
      <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#a1a1aa" }}>
        {row.user_id?.slice(0, 8)}...
      </span>
    )},
    { key: "role", label: "Role", render: (row) => (
      <span className={`admin-badge admin-badge-${row.role}`}>
        {row.role === "super_admin" ? "👑 Super Admin" : row.role === "editor" ? "🧑‍💻 Editor" : "👀 Viewer"}
      </span>
    )},
    { key: "created_at", label: "Assigned", render: (row) => (
      <span style={{ color: "#71717a", fontSize: "0.8rem" }}>
        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
      </span>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading users...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">User Management</h1>
          <p className="admin-page-subtitle">Manage admin users and their role assignments</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditUser(null); setShowModal(true); }}>
          + Assign Role
        </button>
      </div>

      <div className="admin-section" style={{ marginBottom: 24 }}>
        <h3 className="admin-section-title">Role Reference</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div style={{ padding: 16, background: "#0d0d14", border: "1px solid #1e1e2e" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#eab308", marginBottom: 4 }}>👑 Super Admin</p>
            <p style={{ fontSize: "0.75rem", color: "#71717a" }}>Full control: users, articles, settings, delete</p>
          </div>
          <div style={{ padding: 16, background: "#0d0d14", border: "1px solid #1e1e2e" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#3b82f6", marginBottom: 4 }}>🧑‍💻 Editor</p>
            <p style={{ fontSize: "0.75rem", color: "#71717a" }}>Create & edit articles, live updates</p>
          </div>
          <div style={{ padding: 16, background: "#0d0d14", border: "1px solid #1e1e2e" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#a1a1aa", marginBottom: 4 }}>👀 Viewer</p>
            <p style={{ fontSize: "0.75rem", color: "#71717a" }}>Read-only access to dashboard & data</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        emptyMessage="No users assigned yet."
        actions={(row) => (
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditUser(row); setShowModal(true); }}>
              Change Role
            </button>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(row.id)}>
              Remove
            </button>
          </div>
        )}
      />

      {showModal && (
        <UserRoleModal
          user={editUser}
          onClose={() => { setShowModal(false); setEditUser(null); }}
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

function UserRoleModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    user_id: user?.user_id || "",
    role: user?.role || "viewer",
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
        <h3 className="admin-modal-title">{user ? "Change User Role" : "Assign Role to User"}</h3>
        <form onSubmit={handleSubmit}>
          {!user && (
            <div className="admin-form-group">
              <label className="admin-form-label">User ID (UUID from Supabase Auth)</label>
              <input
                className="admin-form-input"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                placeholder="e.g. a1b2c3d4-e5f6-..."
                required
              />
              <p style={{ fontSize: "0.72rem", color: "#52525b", marginTop: 6 }}>
                Find this in Supabase Dashboard → Authentication → Users
              </p>
            </div>
          )}
          <div className="admin-form-group">
            <label className="admin-form-label">Role</label>
            <select className="admin-form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="super_admin">👑 Super Admin</option>
              <option value="editor">🧑‍💻 Editor</option>
              <option value="viewer">👀 Viewer</option>
            </select>
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{user ? "Update Role" : "Assign"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
