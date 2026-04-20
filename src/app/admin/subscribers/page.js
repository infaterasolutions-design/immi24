"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import DataTable from "../../../components/admin/DataTable";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleExport() {
    if (subscribers.length === 0) return;
    const csvContent = "Email,Subscribed Date\n" +
      subscribers.map(s => `${s.email},${s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported " + subscribers.length + " subscribers");
  }

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "email", label: "Email", render: (row) => (
      <span style={{ fontWeight: 500, color: "#fff" }}>{row.email}</span>
    )},
    { key: "created_at", label: "Subscribed On", render: (row) => (
      <span style={{ color: "#71717a", fontSize: "0.8rem" }}>
        {row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
      </span>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading subscribers...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Subscribers</h1>
          <p className="admin-page-subtitle">{subscribers.length} total subscribers</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleExport}>
          ⬇ Export CSV
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          className="admin-form-input"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No subscribers found."
      />

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
