"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminUser } from "../../lib/adminHelpers";
import AdminSidebar from "../../components/admin/Sidebar";
import "./admin.css";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      const adminUser = await getAdminUser();
      if (!adminUser && pathname !== "/admin/login") {
        router.push("/admin/login");
        return;
      }
      setUser(adminUser);
      setLoading(false);
    }
    checkAuth();
  }, [pathname, router]);

  // For the login page, render without the admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="admin-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "3px solid #1e1e2e",
            borderTopColor: "#6366f1", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px"
          }} />
          <p style={{ color: "#71717a", fontSize: "0.85rem" }}>Loading admin panel...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="admin-shell">
      <AdminSidebar user={user} />
      <div className="admin-main">
        <div className="admin-topbar">
          <h2>{pageTitle}</h2>
          <span className="admin-topbar-badge">{user?.role?.replace("_", " ")}</span>
        </div>
        <div className="admin-content">
          {/* Clone children and pass user prop */}
          {typeof children === "object" && children !== null
            ? (() => {
                // We wrap children in a context-like div and pass user via a global ref
                // Instead, we use a simple approach: store user in window for child pages
                if (typeof window !== "undefined") {
                  window.__adminUser = user;
                }
                return children;
              })()
            : children}
        </div>
      </div>
    </div>
  );
}

function getPageTitle(pathname) {
  const map = {
    "/admin": "Dashboard",
    "/admin/articles": "Articles",
    "/admin/categories": "Categories",
    "/admin/live-updates": "Live Updates",
    "/admin/media": "Media Library",
    "/admin/subscribers": "Subscribers",
    "/admin/users": "User Management",
  };
  return map[pathname] || "Admin";
}
