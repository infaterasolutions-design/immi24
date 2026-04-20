"use client";

export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorMap = {
    blue: "from-blue-600 to-blue-500",
    green: "from-emerald-600 to-emerald-500",
    purple: "from-purple-600 to-purple-500",
    orange: "from-orange-600 to-orange-500",
    red: "from-red-600 to-red-500",
    cyan: "from-cyan-600 to-cyan-500",
  };

  return (
    <div className="admin-stats-card">
      <div className={`admin-stats-icon bg-gradient-to-br ${colorMap[color] || colorMap.blue}`}>
        <span>{icon}</span>
      </div>
      <div>
        <p className="admin-stats-label">{title}</p>
        <p className="admin-stats-value">{value}</p>
      </div>
    </div>
  );
}
