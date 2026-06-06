"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { FaXTwitter, FaLinkedinIn, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa6";

const SOCIALS = [
  { name: "X", url: "https://x.com/usimminews", icon: FaXTwitter, bgColor: "#000000" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/united-states-immigration-news", icon: FaLinkedinIn, bgColor: "#0077B5" },
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61580097382101", icon: FaFacebook, bgColor: "#1877F2" },
  { name: "YouTube", url: "https://www.youtube.com/@unitedstatesimmigrationnews", icon: FaYoutube, bgColor: "#FF0000" },
  { name: "Instagram", url: "https://www.instagram.com/unitedstatesimmigrationnews/", icon: FaInstagram, bgColor: "#E1306C" },
];

/**
 * MegaMenu — Desktop hover dropdowns + Mobile accordion.
 *
 * Props:
 *  - categories: Array of parent category objects, each with a `subcategories` array
 *  - menuOpen: boolean — whether the mobile slide-in panel is visible
 *  - onClose: () => void — called when a link is clicked (closes the menu)
 */
export default function MegaMenu({ categories, menuOpen, onClose }) {
  const pathname = usePathname();
  const [expandedSlugs, setExpandedSlugs] = useState({});

  const handleToggle = useCallback((slug) => {
    setExpandedSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }, []);

  // Determine active parent from current URL
  const activeParent = categories.find((cat) =>
    pathname === `/${cat.slug}` ||
    pathname === `/${cat.slug}/` ||
    pathname.startsWith(`/${cat.slug}/`)
  );

  const isSubActive = (parentSlug, subSlug) =>
    pathname === `/${parentSlug}/${subSlug}` ||
    pathname === `/${parentSlug}/${subSlug}/`;

  return (
    <>
      {/* ═══════════════════════════════════════════
          DESKTOP NAV — horizontal bar with hover dropdowns
          ═══════════════════════════════════════════ */}
      <nav className="nav-links hidden lg:flex flex-1 justify-center items-center gap-1.5 h-full whitespace-nowrap px-2">
        {/* Category items with dropdowns */}
        {categories.map((cat) => {
          const isActive = activeParent?.slug === cat.slug;
          return (
            <div key={cat.slug} className="nav-item group relative flex items-center py-2">
              <Link
                href={`/${cat.slug}/`}
                className={`text-[12px] font-semibold transition-colors flex items-center gap-0.5 ${
                  isActive ? "text-primary" : "text-black hover:text-primary"
                }`}
              >
                {cat.name}
                {cat.subcategories?.length > 0 && (
                  <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-primary transition-colors">
                    expand_more
                  </span>
                )}
              </Link>

              {/* Dropdown panel */}
              {cat.subcategories?.length > 0 && (
                <div className="nav-dropdown absolute top-full left-1/2 -translate-x-1/2 min-w-[240px] w-max bg-white border border-slate-200 shadow-xl rounded-lg py-2 z-[60]">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${cat.slug}/${sub.slug}/`}
                      className={`block px-5 py-2.5 text-sm transition-colors ${
                        isSubActive(cat.slug, sub.slug)
                          ? "text-primary bg-indigo-50 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ═══════════════════════════════════════════
          MOBILE OVERLAY (backdrop)
          ═══════════════════════════════════════════ */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[60px] z-[998] bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* ═══════════════════════════════════════════
          MOBILE SLIDE-IN MENU — full-screen accordion
          ═══════════════════════════════════════════ */}
      <div
        className={`lg:hidden fixed top-[60px] left-0 right-0 bottom-0 z-[999] bg-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
      >
        {/* Live Updates */}
        <Link
          href="/live-updates"
          className={`flex items-center gap-3 px-5 py-4 text-[15px] font-bold border-b border-slate-100 active:bg-slate-50 relative group ${
            pathname.startsWith("/live-updates") ? "text-primary" : "text-slate-900"
          }`}
          onClick={onClose}
        >
          <span className="absolute left-6 w-2 h-2 bg-red-500 rounded-full animate-pulse-red"></span>
          <span className="material-symbols-outlined text-transparent text-[20px]"></span>
          <span className="ml-1">Live Updates</span>
        </Link>

        {/* Category accordion items */}
        {categories.map((cat) => {
          const isActive = activeParent?.slug === cat.slug;
          return (
            <div key={cat.slug} className="border-b border-slate-100">
              <div className="flex items-center justify-between px-5 py-4 active:bg-slate-50">
                <Link
                  href={`/${cat.slug}/`}
                  className={`text-[15px] font-bold flex-grow py-1 ${
                    isActive ? "text-primary" : "text-slate-900"
                  }`}
                  onClick={onClose}
                >
                  {cat.name}
                </Link>
                {cat.subcategories?.length > 0 && (
                  <button
                    className="p-2 -mr-2 text-slate-500 transition-transform duration-300"
                    style={{ transform: expandedSlugs[cat.slug] ? "rotate(180deg)" : "rotate(0deg)" }}
                    onClick={() => handleToggle(cat.slug)}
                    aria-label="Toggle subcategories"
                  >
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </button>
                )}
              </div>

              {/* Subcategories accordion */}
              {cat.subcategories?.length > 0 && expandedSlugs[cat.slug] && (
                <div className="bg-slate-50 px-5 py-2 border-t border-slate-100/50 shadow-inner">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${cat.slug}/${sub.slug}/`}
                      className={`block py-3 pl-4 text-[14px] font-medium ${
                        isSubActive(cat.slug, sub.slug)
                          ? "text-primary font-semibold"
                          : "text-slate-600 active:text-primary"
                      }`}
                      onClick={onClose}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Social media links */}
        <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <hr className="border-t border-slate-200 opacity-60 my-4" />
          <p className="text-[11px] uppercase tracking-[0.1em] text-slate-500 mb-3 font-bold">Follow Us</p>
          <div className="flex flex-row gap-2.5 items-center">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-opacity duration-200 active:opacity-80"
                style={{ backgroundColor: social.bgColor }}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
