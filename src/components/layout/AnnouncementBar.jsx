import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Phone } from 'lucide-react';
import { LayoutContainer } from './LayoutContainer';

export function AnnouncementBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0E2A5A] text-white text-xs py-2 border-b border-[#0A1E42] select-none">
      <LayoutContainer className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Sparkles size={13} className="animate-pulse shrink-0" />
          <span className="truncate">{t('announcement') || 'Authentic Korean Groceries Delivered Across Abu Dhabi!'}</span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-slate-200 text-[11px] shrink-0 font-medium">
          <span className="bg-[#5A3418] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            Abu Dhabi 🇦🇪
          </span>
          <a href="tel:+971561549027" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone size={12} className="text-amber-400" />
            <span>+971 56 154 9027</span>
          </a>
          <span>•</span>
          <span>9:00 AM - 10:00 PM</span>
        </div>
      </LayoutContainer>
    </div>
  );
}
