"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { getCategories } from "@/lib/categoryConfig";
import { subscribeEmail } from "@/app/actions/subscribe";
import MegaMenu from "./MegaMenu";
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const openMenu = () => {
    setMenuOpen(true);
    setSearchOpen(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [CATEGORIES, setCATEGORIES] = useState([]);
  const mobileSearchInputRef = useRef(null);
  
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const subscribedEmail = email.trim();
    if (subscribedEmail) {
      const result = await subscribeEmail(subscribedEmail);
      if (result.success) {
        setIsSubscribed(true);
        localStorage.setItem('user_subscribed', 'true');
        sessionStorage.setItem('popup_shown_this_session', 'true');
        sessionStorage.setItem('user_email', subscribedEmail);
        setTimeout(() => {
          setIsSubscribed(false);
          setShowSubscribeModal(false);
        }, 2000);
        setEmail("");
      }
    }
  };

  // Auto-trigger subscribe popup for new visitors
  useEffect(() => {
    const shownThisSession = sessionStorage.getItem('popup_shown_this_session');
    if (shownThisSession) return;
    if (pathname.startsWith('/admin')) return;

    let timer;

    const checkAndShow = async () => {
      // Layer 1: check localStorage first (fast)
      const localSubscribed = localStorage.getItem('user_subscribed');
      if (localSubscribed) return;

      // Layer 2: check sessionStorage email flag
      const sessionEmail = sessionStorage.getItem('user_email');

      // Layer 3: check Supabase if email known
      if (sessionEmail) {
        try {
          const res = await fetch(`/api/check-subscription?email=${encodeURIComponent(sessionEmail)}`);
          const data = await res.json();
          if (data.subscribed) {
            // Re-save to localStorage so next check is instant
            localStorage.setItem('user_subscribed', 'true');
            return;
          }
        } catch (err) {
          console.error('Subscription check failed:', err);
        }
      }

      // Show popup after 3 seconds
      timer = setTimeout(() => {
        sessionStorage.setItem('popup_shown_this_session', 'true');
        setShowSubscribeModal(true);
      }, 3000);
    };

    checkAndShow();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  // Load categories on mount
  useEffect(() => {
    getCategories().then(cats => setCATEGORIES(cats));
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };



  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!headerRef.current?.contains(e.target) &&
          !dropdownRef.current?.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAll();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        if (window.innerWidth >= 1024) {
          searchInputRef.current?.focus();
        } else {
          mobileSearchInputRef.current?.focus();
        }
      }, 100);
    }
  }, [searchOpen]);

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header ref={headerRef} className={`sticky top-0 z-50 w-full bg-white border-b border-slate-200 ${searchOpen ? 'search-open' : ''}`}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-2 md:py-3 min-h-[60px]">
          
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img
                alt="Logo"
                className="object-contain"
                src="/images/logo.png"
                width={155}
                height={48}
              />
            </Link>
          </div>

          {/* Center: Desktop + Mobile Navigation */}
          <MegaMenu categories={CATEGORIES} menuOpen={menuOpen} onClose={closeMenu} />

          {/* Right: Search + Subscribe */}
          <div className="right-section flex items-center gap-3 flex-shrink-0">
            
            {/* Reuters-style Inline Search (Desktop Only) */}
            <div className="hidden lg:flex reuters-search-container" ref={dropdownRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      if (searchQuery.length > 0) {
                        setSearchQuery('');
                      } else {
                        closeAll();
                      }
                    }
                  }}
                  className={`reuters-search-input ${searchOpen ? 'expanded' : ''}`}
                  placeholder="Search news, updates..." 
                  type="text" 
                />
                
                <button 
                  type="button" 
                  className="reuters-search-icon" 
                  onClick={() => {
                    if (!searchOpen) openSearch();
                    else if (searchQuery.trim()) handleSearchSubmit(new Event('submit'));
                  }} 
                  aria-label="Search"
                >
                  <span className="material-symbols-outlined text-[22px]">search</span>
                </button>
                
                <button 
                  type="button" 
                  className={`reuters-close-btn ${searchOpen ? 'visible' : ''}`} 
                  onClick={() => {
                    setSearchQuery('');
                    closeAll();
                  }}
                  aria-label="Close search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </form>

              {/* Live Suggestions Dropdown */}
              {searchOpen && (suggestions.length > 0 || (searchQuery.length >= 2 && !isSearching)) && (
                <div className="reuters-search-dropdown" onMouseDown={(e) => e.preventDefault()}>
                  {isSearching && (
                    <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
                  )}
                  
                  {!isSearching && suggestions.length > 0 && (
                    <ul>
                      {suggestions.map((item) => (
                        <li key={item.id}>
                          <Link 
                            href={`/${item.slug}`} 
                            onClick={closeAll}
                            className="flex justify-between items-center px-5 py-2.5 cursor-pointer transition-colors hover:bg-slate-50 border-b border-slate-100 last:border-0"
                          >
                            <span className="text-[14px] text-primary font-normal truncate pr-4">{item.title}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 text-slate-500 whitespace-nowrap ml-3">{item.category_label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {!isSearching && searchQuery.length >= 2 && suggestions.length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-sm">No results for &quot;{searchQuery}&quot;</div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: Search Icon */}
            <div className="flex lg:hidden items-center gap-1">
              <button 
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-full hover:bg-slate-50 transition-colors"
                onClick={searchOpen ? closeAll : openSearch}
              >
                <span className="material-symbols-outlined text-[22px]">{searchOpen ? "close" : "search"}</span>
              </button>
            </div>

            {/* Mobile: Hamburger / Close */}
            <button
              className="hamburger-btn lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-lg transition-colors"
              onClick={menuOpen ? closeAll : openMenu}
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>

            {/* Desktop Subscribe */}
            <button 
              onClick={() => setShowSubscribeModal(true)}
              className="hidden lg:block bg-primary text-white px-5 py-2 font-bold text-xs tracking-wide uppercase hover:opacity-90 transition-all rounded-full shadow-sm active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* ===== SEARCH DROPDOWN ===== */}
      <div 
        ref={dropdownRef}
        className="fixed left-0 right-0 z-40 bg-white shadow-xl border-b border-slate-200 lg:hidden"
        style={{
          top: '60px',
          maxHeight: searchOpen ? '400px' : '0',
          opacity: searchOpen ? '1' : '0',
          transform: searchOpen ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: searchOpen ? 'all' : 'none',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto">
          {/* Search Input Row */}
          <div className="w-full bg-white border-b border-black/5 p-[12px_20px] flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-slate-400 select-none">search</span>
            <input
              ref={mobileSearchInputRef}
              type="text"
              className="w-full border-none outline-none bg-transparent text-[16px] text-slate-900 placeholder-slate-400"
              placeholder="Search immigration news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Live Suggestions List */}
          <div className="border-t border-black/5 max-h-[320px] overflow-y-auto py-2">
            {isSearching && (
              <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
            )}
            
            {!isSearching && suggestions.length > 0 && (
              <ul>
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <Link 
                      href={`/${item.slug}`} 
                      onClick={closeAll}
                      className="flex justify-between items-center px-5 py-2.5 cursor-pointer transition-colors hover:bg-slate-50"
                    >
                      <span className="text-[14px] text-primary font-normal truncate pr-4">{item.title}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 text-slate-500 whitespace-nowrap ml-3">{item.category_label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            
            {!isSearching && searchQuery.length >= 2 && suggestions.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-sm">No results for "{searchQuery}"</div>
            )}
          </div>
        </div>
      </div>

      {/* ===== SEARCH BACKDROP OVERLAY ===== */}
      <div 
        className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden"
        style={{
          top: '60px',
          opacity: searchOpen ? '1' : '0',
          pointerEvents: searchOpen ? 'all' : 'none'
        }}
        onClick={closeAll}
      />

      {/* Mobile overlay and slide-in menu are now handled by <MegaMenu /> */}

      {/* ===== GLOBAL SUBSCRIBE MODAL ===== */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSubscribeModal(false)}></div>
          <div className="bg-primary p-8 md:p-10 text-white shadow-2xl rounded-2xl relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            
            <span className="material-symbols-outlined text-4xl mb-6 opacity-90" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
            <h3 className="text-2xl font-extrabold headline-font mb-3">Global Briefing</h3>
            <p className="text-sm mb-8 opacity-90 leading-relaxed">Get the week's most critical immigration news and policy analysis directly in your inbox.</p>
            
            <form onSubmit={handleSubscribe} className="space-y-4 relative">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 px-4 py-3.5 text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white outline-none rounded-xl text-white transition-all" 
                placeholder="Your professional email" 
                type="email" 
              />
              <button type="submit" className="w-full bg-white text-primary font-bold py-3.5 text-[12px] tracking-widest hover:bg-slate-50 transition-all uppercase rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl">
                {isSubscribed ? "Subscribed!" : "Subscribe Document"}
              </button>
              {isSubscribed && (
                <p className="text-xs text-green-300 text-center font-bold absolute -bottom-6 left-0 right-0">Success! Welcome to the briefing.</p>
              )}
            </form>
          </div>
        </div>
      )}

    </>
  );
}
