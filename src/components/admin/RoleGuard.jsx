"use client";

/**
 * RoleGuard — renders children only if the current user's role is in the allowedRoles list.
 * @param {{ user: { role: string } | null, allowedRoles: string[], children: React.ReactNode, fallback?: React.ReactNode }} props
 */
export default function RoleGuard({ user, allowedRoles, children, fallback = null }) {
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
  return <>{children}</>;
}
