"use client";
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function LanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicLanguages, setDynamicLanguages] = useState([]);

  useEffect(() => {
    // Provide initialization function for the Google Script
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
      }, 'google_translate_element');
    };

    // Scrape loaded list of ALL supported languages from Google's native select element
    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select && select.options.length > 0) {
        const extractedLangs = Array.from(select.options)
          .filter(opt => opt.value !== '') // exclude default empty
          .map(opt => ({
            code: opt.value,
            name: opt.text
          }));
        setDynamicLanguages(extractedLangs);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (code) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      setIsOpen(false);
    }
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
      
      {/* Trigger Button with translate.png transparent logo directly */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        title="Translate Page"
        className="w-[36px] h-[44px] flex items-center justify-center hover:scale-110 hover:-rotate-12 transition-all duration-300 focus:outline-none group animate-in zoom-in"
      >
        <img 
          src="/translate.png" 
          alt="Translate" 
          className="w-full h-full object-contain drop-shadow-xl z-10" 
        />
      </button>

      {/* Google Translate External Script */}
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </div>
  );
}
