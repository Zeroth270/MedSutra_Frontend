import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage, selectedLanguage, LANGUAGES } = useLanguage();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 theme-bg theme-text-sub hover:theme-text border theme-border hover:border-teal-500/50 shadow-sm active:scale-95"
        title="Select Language"
      >
        <span className="text-base">🌐</span>
        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
          {selectedLanguage.code}
        </span>
        <svg 
          width="10" 
          height="10" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-[400px] overflow-y-auto theme-surface border theme-border rounded-2xl shadow-2xl z-[60] animate-fade-in">
          <div className="p-2 grid grid-cols-1 gap-1">
            <div className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] theme-text-sub border-b theme-border mb-1">
              Select Language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentLanguage === lang.code 
                    ? 'theme-bg theme-text' 
                    : 'hover:theme-bg theme-text-sub hover:theme-text'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black uppercase tracking-tight">{lang.name}</span>
                  <span className="text-[10px] opacity-60 font-bold">{lang.native}</span>
                </div>
                {currentLanguage === lang.code && (
                  <div className="w-2 h-2 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
