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
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showDictationGuide, setShowDictationGuide] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const recognitionRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setShowSubscribeModal(false);
      }, 2000);
      setEmail("");
    }
  };

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
    
    // Cleanup recognition on unmount
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) {}
      }
    };
  }, []);

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
        if (!menuOpen) setMenuOpen(true);
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

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-2 md:py-3 min-h-[60px]">
          
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img
                alt="Logo"
                className="w-[155px] h-[48px] object-contain"
                src="/images/logo.png"
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
          
          {/* iOS Dictation Guide */}
          {showDictationGuide && (
            <div className="mb-3 bg-blue-50 border border-blue-200 p-3 flex items-start gap-3 animate-in fade-in duration-300">
              <span className="material-symbols-outlined text-blue-600 text-xl mt-0.5">info</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900">Tap the microphone on your keyboard</p>
                <p className="text-xs text-blue-700 mt-1">Look for the 🎙️ icon on your iOS keyboard to use voice dictation</p>
              </div>
              <button onClick={() => setShowDictationGuide(false)} className="text-blue-400 hover:text-blue-600">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
          
          <form 
            onSubmit={handleSearchSubmit} 
            className={`flex items-center bg-white px-3 py-2 border transition-all duration-300 ease-in-out rounded-full shadow-inner ${isSearchFocused ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'}`}
          >
            <button type="submit" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <input 
              ref={mobileSearchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent border-none focus:ring-0 text-[16px] w-full outline-none mx-2 text-slate-700" 
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

        {/* Mobile Navbar Subscribe Block */}
        <div className="p-5 mt-4 mx-4 mb-20 bg-primary text-white rounded-xl shadow-lg border border-primary-container/20">
            <h3 className="text-lg font-extrabold headline-font mb-2">Global Briefing</h3>
            <p className="text-sm mb-4 opacity-90 leading-relaxed">Get critical immigration news delivered to your inbox weekly.</p>
            <form onSubmit={handleSubscribe} className="space-y-3 relative">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none rounded-md text-white" 
                placeholder="Email address" 
                type="email" 
              />
              <button type="submit" className="w-full bg-white text-primary font-bold py-3 text-[11px] tracking-widest hover:bg-slate-50 transition-all uppercase rounded-md relative overflow-hidden">
                <span className={`transition-transform duration-300 ${isSubscribed ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>Subscribe Now</span>
                <span className={`transition-transform duration-300 flex items-center justify-center gap-1.5 ${isSubscribed ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`}><span className="material-symbols-outlined text-[16px]">check_circle</span> Subscribed!</span>
              </button>
            </form>
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
