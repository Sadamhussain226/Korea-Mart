import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languageList } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSelector({ align = 'right' }) {
  const { lang, setLanguage, currentLangObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-1.5 bg-[#F7F7F7] hover:bg-[#ECECEC] text-[#0E2A5A] px-3 py-1.5 rounded-full text-xs font-bold border border-[#ECECEC] transition-all cursor-pointer shadow-2xs select-none active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe size={14} className="text-[#0E2A5A] shrink-0" />
        <span className="font-extrabold flex items-center gap-1">
          <span>{currentLangObj.flag}</span>
          <span>{currentLangObj.label}</span>
        </span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#0E2A5A]' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${
              align === 'left' ? 'left-0 rtl:left-auto rtl:right-0' : 'right-0 rtl:right-auto rtl:left-0'
            } top-full mt-2 w-44 max-w-[calc(100vw-2.5rem)] bg-white border border-[#ECECEC] rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden divide-y divide-[#ECECEC]/40`}
          >
            <div className="px-3 py-1.5 text-[10px] font-black text-[#0E2A5A] uppercase tracking-wider bg-[#F7F7F7] rounded-xl mb-1">
              Select Language / اختر اللغة
            </div>

            <div className="space-y-0.5 pt-1">
              {languageList.map((item) => {
                const isActive = item.code === lang;

                return (
                  <button
                    key={item.code}
                    type="button"
                    className={`w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#0E2A5A] text-white shadow-xs'
                        : 'hover:bg-[#F7F7F7] text-[#222222]'
                    }`}
                    onClick={() => {
                      setLanguage(item.code);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm leading-none">{item.flag}</span>
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <Check size={12} className="text-amber-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
