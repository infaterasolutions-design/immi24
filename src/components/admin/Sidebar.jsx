"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '../../lib/adminHelpers';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['super_admin', 'editor', 'viewer'], section: 'Overview' },
  { name: 'Articles', path: '/admin/articles', icon: '📰', roles: ['super_admin', 'editor', 'viewer'], section: 'Content' },
  { name: 'Categories', path: '/admin/categories', icon: '📂', roles: ['super_admin', 'editor'], section: 'Content' },
  { name: 'Live Updates', path: '/admin/live-updates', icon: '🔴', roles: ['super_admin', 'editor', 'viewer'], section: 'Content' },
  { name: 'Media Library', path: '/admin/media', icon: '🎬', roles: ['super_admin', 'editor', 'viewer'], section: 'Content' },
  { name: 'Subscribers', path: '/admin/subscribers', icon: '📧', roles: ['super_admin', 'editor'], section: 'Audience' },
  { name: 'Users', path: '/admin/users', icon: '👤', roles: ['super_admin'], section: 'Settings' },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // Group nav items by section
  const sections = {};
  NAV_ITEMS.forEach((item) => {
    if (user && item.roles && !item.roles.includes(user.role)) return;
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h1>Admin Panel</h1>
        <span>United States Immigration News</span>
      </div>

      <div className="admin-sidebar-user">
        <div className="admin-sidebar-avatar">
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="admin-sidebar-user-info">
          <p>{user?.email}</p>
          <p>{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName}>
            <div className="admin-nav-section-label">{sectionName}</div>
            {items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleLogout}>
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
