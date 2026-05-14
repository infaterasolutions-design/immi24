"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { getCategories } from "@/lib/categoryConfig";
import { subscribeEmail } from "@/app/actions/subscribe";
import { FaXTwitter, FaLinkedinIn, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa6';
export default function Header() {
  const router = useRouter();
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
  const [expandedSlugs, setExpandedSlugs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [CATEGORIES, setCATEGORIES] = useState([]);
  const [showDictationGuide, setShowDictationGuide] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const recognitionRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      const result = await subscribeEmail(email.trim());
      if (result.success) {
        setIsSubscribed(true);
        setTimeout(() => {
          setIsSubscribed(false);
          setShowSubscribeModal(false);
        }, 2000);
        setEmail("");
      }
    }
  };

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

  // Check voice search support and detect iOS on mount
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setVoiceSearchSupported(supported);
    
    // Detect iOS devices
    const isiOSDevice = typeof navigator !== 'undefined' && 
      (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    setIsIOS(isiOSDevice);

    // Load categories from Supabase
    getCategories().then(cats => setCATEGORIES(cats));
    
    // Cleanup recognition on unmount
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) {}
      }
    };
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
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

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startVoiceSearch = () => {
    // If already listening, stop
    if (isListening) {
      stopVoiceSearch();
      return;
    }

    // iOS Safari fallback: use built-in keyboard dictation
    if (!voiceSearchSupported) {
      if (isIOS) {
        // Open mobile menu if not open, focus search input, show guide
        if (!searchOpen) openSearch();
        setShowDictationGuide(true);
        setTimeout(() => {
          if (mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
          }
        }, 400);
        // Auto-hide the guide after 5 seconds
        setTimeout(() => setShowDictationGuide(false), 5000);
        return;
      }
      alert("Voice search is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Show interim results in real-time
      if (interimTranscript) {
        setSearchQuery(interimTranscript);
      }
      
      if (finalTranscript) {
        setSearchQuery(finalTranscript);
        setIsListening(false);
        recognitionRef.current = null;
        // Auto-submit after hearing final result
        setTimeout(() => {
          router.push(`/search?q=${encodeURIComponent(finalTranscript)}`);
          closeMenu();
        }, 600);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      recognitionRef.current = null;
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone permissions in your browser settings and try again.');
      } else if (event.error === 'no-speech') {
        // Silently handle no speech detected
      } else if (event.error === 'network') {
        alert('Network error during voice search. Please check your internet connection.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start error:', e);
      setIsListening(false);
      recognitionRef.current = null;
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
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header ref={headerRef} className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
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

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-4 h-full whitespace-nowrap px-4">
            <div className="nav-item group relative flex items-center py-2">
              <Link href="/" className="text-[13px] font-semibold text-slate-600 hover:text-primary transition-colors">Home</Link>
            </div>
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} className="nav-item group relative flex items-center py-2">
                <Link href={`/category/${cat.slug}`} className="text-[13px] font-semibold text-slate-600 hover:text-primary transition-colors flex items-center gap-0.5">
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

          {/* Right: Search + Subscribe */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* Desktop Advanced Search */}
            <div className="hidden lg:block relative">
              <form 
                onSubmit={handleSearchSubmit} 
                className={`flex items-center bg-slate-100 px-3 py-1.5 border transition-all duration-300 ease-in-out rounded-full shadow-inner ${isSearchFocused ? 'border-primary ring-2 ring-primary/20 w-80' : 'border-slate-200 w-64'}`}
              >
                <button type="submit" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">search</span>
                </button>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
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

              {/* Desktop Live Suggestions Dropdown */}
              {isSearchFocused && (suggestions.length > 0 || (searchQuery.length >= 2 && !isSearching)) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl z-[60] py-2 max-h-[360px] overflow-y-auto" onMouseDown={(e) => e.preventDefault()}>
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
                    <div className="p-4 text-center text-slate-500 text-sm">No results for &quot;{searchQuery}&quot;</div>
                  )}
                </div>
              )}
            </div>

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
                onClick={searchOpen ? closeAll : openSearch}
              >
                <span className="material-symbols-outlined text-[22px]">{searchOpen ? "close" : "search"}</span>
              </button>
            </div>

            {/* Mobile: Hamburger / Close */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-lg transition-colors"
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
              ref={searchInputRef}
              type="text"
              className="w-full border-none outline-none bg-transparent text-[16px] text-slate-900 placeholder-slate-400"
              placeholder="Search immigration news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 0 && (
              <button 
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
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

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-[998] bg-black/30 backdrop-blur-sm" onClick={closeAll} />
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



        {/* Mobile Navbar Social Media Links */}
        <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <hr className="border-t border-slate-200 opacity-60 my-4" />
          <p className="text-[11px] uppercase tracking-[0.1em] text-slate-500 mb-3 font-bold">Follow Us</p>
          <div className="flex flex-row gap-2.5 items-center">
            {[
              { name: "X", url: "https://x.com/usimminews", icon: FaXTwitter, bgColor: "#000000" },
              { name: "LinkedIn", url: "https://www.linkedin.com/company/united-states-immigration-news", icon: FaLinkedinIn, bgColor: "#0077B5" },
              { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61580097382101", icon: FaFacebook, bgColor: "#1877F2" },
              { name: "YouTube", url: "https://www.youtube.com/@unitedstatesimmigrationnews", icon: FaYoutube, bgColor: "#FF0000" },
              { name: "Instagram", url: "https://www.instagram.com/unitedstatesimmigrationnews/", icon: FaInstagram, bgColor: "#E1306C" }
            ].map((social) => (
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
      {/* ===== VOICE SEARCH LISTENING OVERLAY ===== */}
      {isListening && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 flex flex-col items-center gap-4 shadow-2xl w-[90%] max-w-sm">
            <div className="w-20 h-20 bg-red-50 flex items-center justify-center animate-pulse" style={{ borderRadius: '50% !important' }}>
              <span className="material-symbols-outlined text-red-500 text-4xl">mic</span>
            </div>
            <p className="text-lg font-bold text-slate-900 headline-font">Listening...</p>
            <p className="text-sm text-slate-500 text-center">Speak now to search for news</p>
            {searchQuery && (
              <p className="text-base font-medium text-primary text-center mt-2 italic">"{searchQuery}"</p>
            )}
            <button 
              onClick={stopVoiceSearch}
              className="mt-2 px-6 py-2 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
