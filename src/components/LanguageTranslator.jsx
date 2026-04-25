"use client";
import { useEffect, useState, useCallback } from 'react';

export default function LanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicLanguages, setDynamicLanguages] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Only load Google Translate when user clicks the button
  const loadTranslateScript = useCallback(() => {
    if (scriptLoaded) return;

    // Set up the init callback before loading the script
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
      }, 'google_translate_element');
    };

    // Inject the script on demand
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    setScriptLoaded(true);
  }, [scriptLoaded]);

  // After script loads, scrape languages from Google's native select
  useEffect(() => {
    if (!scriptLoaded) return;

    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select && select.options.length > 0) {
        const extractedLangs = Array.from(select.options)
          .filter(opt => opt.value !== '')
          .map(opt => ({
            code: opt.value,
            name: opt.text
          }));
        setDynamicLanguages(extractedLangs);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [scriptLoaded]);

  const changeLanguage = (code) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (!scriptLoaded) {
      loadTranslateScript();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      {/* Hidden Native Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* Floating Custom Options Dropdown */}
      <div 
        className={`absolute bottom-[72px] left-0 bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-slate-200/50 min-w-[220px] mb-2 origin-bottom-left transition-all duration-500 ease-out ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="p-3 border-b border-slate-100/60 mb-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-800 flex items-center gap-2">
             <span className="material-symbols-outlined text-[16px] text-primary">g_translate</span>
             Select Language
          </h4>
        </div>
        <div className="max-h-[400px] overflow-y-auto space-y-1 px-1 custom-scrollbar">
           {dynamicLanguages.length === 0 && <div className="text-center p-4 text-xs text-slate-400">Loading languages...</div>}
           {dynamicLanguages.map(lang => (
             <button 
               key={lang.code}
               onClick={() => changeLanguage(lang.code)}
               className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-primary rounded-xl transition-all shadow-sm shadow-transparent text-left"
             >
               {lang.name}
             </button>
           ))}
        </div>
      </div>
      
      {/* Trigger Button — loads Google Translate only on first click */}
      <button 
        onClick={handleToggle}
        title="Translate Page"
        className="w-[36px] h-[44px] flex items-center justify-center hover:scale-110 hover:-rotate-12 transition-all duration-300 focus:outline-none group animate-in zoom-in"
      >
        <img 
          src="/translate.png" 
          alt="Translate" 
          className="w-full h-full object-contain drop-shadow-xl z-10"
          width={36}
          height={44}
          loading="lazy"
        />
      </button>
    </div>
  );
}
