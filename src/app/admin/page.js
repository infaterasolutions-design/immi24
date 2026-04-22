"use client";
import { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    subscribers: 0,
    liveEvents: 0,
    videos: 0,
    users: 0,
    activeLive: 0,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: articleCount },
          { count: subscriberCount },
          { count: liveEventCount },
          { count: videoCount },
          { count: userCount },
          { count: activeLiveCount },
        ] = await Promise.all([
          supabase.from("articles").select("*", { count: "exact", head: true }),
          supabase.from("subscribers").select("*", { count: "exact", head: true }),
          supabase.from("live_events").select("*", { count: "exact", head: true }),
          supabase.from("videos").select("*", { count: "exact", head: true }),
          supabase.from("user_roles").select("*", { count: "exact", head: true }),
          supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "active"),
        ]);
        
        let recentFetched = [];
        const { data: orderedRecent, error: recentErr } = await supabase.from("articles").select("id, title, category_label, published_at").order("published_at", { ascending: false }).limit(5);
        if (recentErr) {
          const { data: unorderedRecent } = await supabase.from("articles").select("id, title, category_label, published_at").limit(5);
          recentFetched = unorderedRecent || [];
        } else {
          recentFetched = orderedRecent || [];
        }

        setStats({
          articles: articleCount || 0,
          subscribers: subscriberCount || 0,
          liveEvents: liveEventCount || 0,
          videos: videoCount || 0,
          users: userCount || 0,
          activeLive: activeLiveCount || 0,
        });
        setRecentArticles(recentFetched || []);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p style={{ color: "#71717a" }}>Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back. Here&apos;s what&apos;s happening with your content.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <StatsCard title="Total Articles" value={stats.articles} icon="📰" color="blue" />
        <StatsCard title="Subscribers" value={stats.subscribers} icon="📧" color="green" />
        <StatsCard title="Live Events" value={stats.liveEvents} icon="🔴" color="red" />
        <StatsCard title="Active Live" value={stats.activeLive} icon="⚡" color="orange" />
        <StatsCard title="Videos" value={stats.videos} icon="🎬" color="purple" />
        <StatsCard title="Admin Users" value={stats.users} icon="👤" color="cyan" />
      </div>

      <div className="admin-section">
        <h3 className="admin-section-title">Recent Articles</h3>
        {recentArticles.length === 0 ? (
          <p style={{ color: "#52525b", fontSize: "0.85rem" }}>No articles yet.</p>
        ) : (
          <table className="admin-table" style={{ background: "transparent" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: "#1e293b", maxWidth: 350, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.title}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-active">{a.category_label || "—"}</span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {a.published_at ? new Date(a.published_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
