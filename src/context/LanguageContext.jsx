import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/config';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const languageList = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh', label: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭', dir: 'ltr' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', dir: 'ltr' }
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // 1. Saved user preference
    const saved = localStorage.getItem('i18nextLng') || localStorage.getItem('korea_mart_lang');
    if (saved && languageList.some((l) => l.code === saved)) {
      return saved;
    }

    // 2. Auto-detect browser language on first visit
    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase();
      const matched = languageList.find((l) => l.code === browserLang);
      if (matched) return matched.code;
    }

    return 'en';
  });

  const currentLangObj = languageList.find((l) => l.code === lang) || languageList[0];

  useEffect(() => {
    localStorage.setItem('korea_mart_lang', lang);
    localStorage.setItem('i18nextLng', lang);
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = currentLangObj.dir;
  }, [lang, currentLangObj]);

  const t = (key, params = {}) => {
    let dict = translations[lang] || translations['en'];
    let text = dict[key] || translations['en'][key] || key;

    Object.keys(params).forEach((paramKey) => {
      text = text.replace(`{${paramKey}}`, params[paramKey]);
    });

    return text;
  };

  const setLanguage = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, isRtl: currentLangObj.dir === 'rtl', currentLangObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
