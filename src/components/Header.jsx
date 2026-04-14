"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/lib/categoryConfig";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSlugs, setExpandedSlugs] = useState({});

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setExpandedSlugs({});
  }, []);

  const handleToggle = useCallback((slug) => {
    setExpandedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }, []);

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-2 md:py-3 min-h-[60px]">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMenu}>
            <img
              alt="Logo"
              className="h-10 md:h-14 w-auto object-contain"
              src="/images/logo.png"
            />
          </Link>

          {/* Right: Desktop Nav + Icons */}
          <div className="flex items-center gap-1">
            
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 mr-4 h-full">
              <div className="nav-item group relative flex items-center px-2 py-2">
                <Link href="/" className="text-[13px] font-semibold text-slate-600 hover:text-primary transition-colors whitespace-nowrap">Home</Link>
              </div>
              {CATEGORIES.map((cat) => (
                <div key={cat.slug} className="nav-item group relative flex items-center px-2 py-2">
                  <Link href={`/category/${cat.slug}`} className="text-[13px] font-semibold text-slate-600 hover:text-primary transition-colors flex items-center gap-0.5 whitespace-nowrap">
                    {cat.name}
                    {cat.subcategories?.length > 0 && (
                      <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                    )}
                  </Link>
                  {cat.subcategories?.length > 0 && (
                    <div className="nav-dropdown absolute top-full left-0 min-w-[220px] w-max bg-white border border-slate-200 shadow-xl py-2 z-[60]">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/category/${cat.slug}/${sub.slug}`}
                          className="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center bg-slate-100 px-3 py-1.5 border border-slate-200 rounded-md">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-28 outline-none ml-1" placeholder="Search..." type="text" />
            </div>

            {/* Mobile: Search Icon */}
            <button className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Mobile: Hamburger / Close */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>

            {/* Desktop Subscribe */}
            <button className="hidden lg:block bg-primary text-white px-5 py-2 ml-2 font-bold text-xs tracking-wide uppercase hover:opacity-90 transition-all rounded-md shadow-md active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-[998] bg-black/30" onClick={closeMenu} />
      )}

      {/* ===== MOBILE SLIDE-IN MENU ===== */}
      <div
        className={`lg:hidden fixed top-[60px] left-0 right-0 bottom-0 z-[999] bg-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
      >
        {/* Home */}
        <Link
          href="/"
          className="flex items-center gap-3 px-5 py-4 text-[15px] font-bold text-slate-900 border-b border-slate-100 active:bg-slate-50"
          onClick={closeMenu}
        >
          <span className="material-symbols-outlined text-primary text-[20px]">home</span>
          Home
        </Link>

        {/* Live Updates */}
        <Link
          href="/live-updates"
          className="flex items-center gap-3 px-5 py-4 text-[15px] font-bold text-slate-900 border-b border-slate-100 active:bg-slate-50"
          onClick={closeMenu}
        >
          <span className="material-symbols-outlined text-red-500 text-[20px]">stream</span>
          Live Updates
          <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </Link>

        {/* Section Divider */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Browse Categories</span>
        </div>

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const hasSubs = cat.subcategories && cat.subcategories.length > 0;
          const isExpanded = expandedSlugs[cat.slug] || false;

          return (
            <div key={cat.slug} className="border-b border-slate-100">
              {/* Category Row */}
              <div className="flex items-stretch">
                {/* Name — navigates */}
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex-1 flex items-center px-5 py-4 text-[15px] font-semibold text-slate-800 active:bg-slate-50 transition-colors"
                  onClick={closeMenu}
                >
                  {cat.name}
                </Link>

                {/* Arrow — toggles accordion */}
                {hasSubs && (
                  <button
                    type="button"
                    className="w-14 flex items-center justify-center text-slate-400 active:bg-slate-100 transition-colors border-l border-slate-100"
                    onClick={() => handleToggle(cat.slug)}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${cat.name}`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {hasSubs && (
                <div
                  style={{
                    maxHeight: isExpanded ? `${cat.subcategories.length * 48 + 20}px` : "0px",
                    opacity: isExpanded ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease, opacity 0.25s ease",
                  }}
                >
                  <div className="ml-4 mr-3 mb-3 border-l-2 border-primary/30 bg-slate-50/50">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="flex items-center gap-2 px-4 py-3 text-[14px] text-slate-600 font-medium active:bg-white hover:text-primary transition-colors"
                        onClick={closeMenu}
                      >
                        <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom safe area */}
        <div className="h-24" />
      </div>
    </>
  );
}
