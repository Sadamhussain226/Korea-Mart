import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../../data/products';

export const categoryList = [
  { id: 'all', name: 'All Categories', emoji: '🏬', bg: 'from-amber-500/10 to-orange-500/10' },
  { id: 'ramen', name: 'Ramen & Noodles', emoji: '🍜', bg: 'from-red-500/10 to-amber-500/10' },
  { id: 'halal-meat', name: 'Halal Meat', emoji: '🥩', bg: 'from-[#5A3418]/15 to-[#0E2A5A]/10' },
  { id: 'kimchi', name: 'Kimchi & Side Dishes', emoji: '🥬', bg: 'from-emerald-500/10 to-teal-500/10' },
  { id: 'mandu', name: 'Dumplings & Mandu', emoji: '🥟', bg: 'from-orange-500/10 to-amber-500/10' },
  { id: 'rice', name: 'Rice & Grains', emoji: '🍚', bg: 'from-amber-400/10 to-yellow-400/10' },
  { id: 'drinks', name: 'Drinks & Beverages', emoji: '🧃', bg: 'from-sky-500/10 to-blue-500/10' },
  { id: 'snacks', name: 'Snacks & Sweets', emoji: '🍿', bg: 'from-pink-500/10 to-rose-500/10' },
  { id: 'sauces', name: 'Sauces & Condiments', emoji: '🌶️', bg: 'from-red-600/10 to-rose-600/10' },
  { id: 'beauty', name: 'Beauty & Skincare', emoji: '✨', bg: 'from-purple-500/10 to-indigo-500/10' },
  { id: 'ready-to-eat', name: 'Ready-to-Eat', emoji: '🍱', bg: 'from-amber-600/10 to-orange-600/10' },
  { id: 'seafood', name: 'Seafood', emoji: '🐟', bg: 'from-blue-600/10 to-cyan-500/10' },
  { id: 'non-muslim', name: 'Non-Muslim', emoji: '🥓', bg: 'from-rose-500/10 to-pink-600/10' },
  { id: 'traditional', name: 'Korean Cooking & Traditional', emoji: '🍶', bg: 'from-emerald-600/10 to-teal-600/10' },
  { id: 'frozen', name: 'Frozen Foods', emoji: '🧊', bg: 'from-cyan-500/10 to-blue-400/10' }
];

export function CategoryPills({ selectedCategory, setSelectedCategory }) {
  const { t } = useLanguage();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    if (catId === 'halal-meat') return products.filter((p) => p.category === 'halal-meat' || (p.category === 'frozen' && p.isHalal && (p.id.includes('meat') || p.name.toLowerCase().includes('beef') || p.name.toLowerCase().includes('galbi') || p.name.toLowerCase().includes('ribs')))).length;
    if (catId === 'non-muslim') return products.filter((p) => p.category === 'non-muslim' || p.isHalal === false || p.isNonMuslim).length;
    if (catId === 'mandu') return products.filter((p) => p.category === 'mandu' || p.id.includes('mandu') || p.name.toLowerCase().includes('mandu') || p.name.toLowerCase().includes('gyoza')).length;
    if (catId === 'seafood') return products.filter((p) => p.category === 'seafood' || p.name.toLowerCase().includes('shrimp') || p.name.toLowerCase().includes('seaweed') || p.name.toLowerCase().includes('fish')).length;
    if (catId === 'ready-to-eat') return products.filter((p) => p.category === 'ready-to-eat' || p.name.toLowerCase().includes('cup') || p.name.toLowerCase().includes('hetbahn') || p.name.toLowerCase().includes('instant')).length;
    if (catId === 'traditional') return products.filter((p) => p.category === 'traditional' || p.name.toLowerCase().includes('tea') || p.name.toLowerCase().includes('oil') || p.name.toLowerCase().includes('paste')).length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <section className="ds-container my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#0E2A5A]">Shop By Categories</h2>
          <p className="text-xs text-[#666666]">Explore authentic Korean essentials imported directly to Abu Dhabi</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-[#ECECEC] bg-white hover:bg-[#F7F7F7] text-[#0E2A5A] shadow-sm transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-[#ECECEC] bg-white hover:bg-[#F7F7F7] text-[#0E2A5A] shadow-sm transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
      >
        {categoryList.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 w-44 p-4 rounded-2xl border text-left rtl:text-right transition-all group ${
                isActive
                  ? 'bg-[#0E2A5A] text-white border-[#0E2A5A] shadow-lg scale-105'
                  : 'bg-white text-[#222222] border-[#ECECEC] hover:border-[#0E2A5A] hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 bg-gradient-to-br ${cat.bg} group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <h3 className={`font-extrabold text-sm leading-tight truncate mb-1 ${isActive ? 'text-white' : 'text-[#0E2A5A]'}`}>
                {cat.name}
              </h3>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-amber-300' : 'text-[#666666]'}`}>
                {count} items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
