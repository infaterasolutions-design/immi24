"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { CATEGORIES } from "@/lib/categoryConfig";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSlugs, setExpandedSlugs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Voice Search. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      // Auto-submit after hearing
      setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(transcript)}`);
        closeMenu();
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-2 md:py-3 min-h-[60px]">
          
          {/* Left: Logo + Navigation (Shifted Left!) */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMenu}>
              <img
                alt="Logo"
                className="w-[155px] h-[48px] object-contain"
                src="/images/logo.png"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 h-full">
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
          </div>

          {/* Right: Search + Subscribe */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Advanced Search */}
            <form 
              onSubmit={handleSearchSubmit} 
              className={`hidden lg:flex items-center bg-slate-100 px-3 py-1.5 border transition-all duration-300 ease-in-out rounded-full shadow-inner ${isSearchFocused ? 'border-primary ring-2 ring-primary/20 w-80' : 'border-slate-200 w-64'}`}
            >
              <button type="submit" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none mx-2 text-slate-700" 
                placeholder="Search news, updates..." 
                type="text" 
              />
              <button 
                type="button" 
                onClick={startVoiceSearch}
                title="Search by Voice"
                className={`flex items-center justify-center transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
            </form>

            {/* Mobile: Search / Mic Icons */}
            <div className="flex lg:hidden items-center gap-1">
              <button 
                type="button" 
                onClick={startVoiceSearch}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <button 
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-full hover:bg-slate-50 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)} // Opens menu where mobile search bar is
              >
                <span className="material-symbols-outlined text-[22px]">search</span>
              </button>
            </div>

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

            {/* Desktop Subscribe (Uses existing visual style, but acts as a quick alert hook) */}
            <button 
              onClick={() => alert('Global Subscription modal triggers here!')}
              className="hidden lg:block bg-primary text-white px-5 py-2 font-bold text-xs tracking-wide uppercase hover:opacity-90 transition-all rounded-full shadow-sm active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-[998] bg-black/30 backdrop-blur-sm" onClick={closeMenu} />
      )}

      {/* ===== MOBILE SLIDE-IN MENU ===== */}
      <div
        className={`lg:hidden fixed top-[60px] left-0 right-0 bottom-0 z-[999] bg-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
      >
        
        {/* Mobile Search Bar inside Menu */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <form 
            onSubmit={handleSearchSubmit} 
            className={`flex items-center bg-white px-3 py-2 border transition-all duration-300 ease-in-out rounded-full shadow-inner ${isSearchFocused ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'}`}
          >
            <button type="submit" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none mx-2 text-slate-700" 
              placeholder="Search..." 
              type="text" 
            />
            <button 
              type="button" 
              onClick={startVoiceSearch}
              className={`flex items-center justify-center transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </form>
        </div>

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
          className="flex items-center gap-3 px-5 py-4 text-[15px] font-bold text-slate-900 border-b border-slate-100 active:bg-slate-50 relative group"
          onClick={closeMenu}
        >
          <span className="absolute left-6 w-2 h-2 bg-red-500 rounded-full animate-pulse-red"></span>
          <span className="material-symbols-outlined text-transparent text-[20px]"></span> {/* spacing */}
          <span className="ml-1">Live Updates</span>
        </Link>

        {/* Categories */}
        {CATEGORIES.map((cat) => (
          <div key={cat.slug} className="border-b border-slate-100">
            <div className="flex items-center justify-between px-5 py-4 active:bg-slate-50">
              <Link
                href={`/category/${cat.slug}`}
                className="text-[15px] font-bold text-slate-900 flex-grow py-1"
                onClick={closeMenu}
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
            
            {/* Subcategories Accordion */}
            {cat.subcategories?.length > 0 && expandedSlugs[cat.slug] && (
              <div className="bg-slate-50 px-5 py-2 border-t border-slate-100/50 shadow-inner">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/category/${cat.slug}/${sub.slug}`}
                    className="block py-3 pl-4 text-[14px] font-medium text-slate-600 active:text-primary"
                    onClick={closeMenu}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
