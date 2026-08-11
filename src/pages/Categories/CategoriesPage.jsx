import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutContainer } from '../../components/layout/LayoutContainer';
import { SEOMeta } from '../../components/common/SEOMeta';
import { getProductImage } from '../../utils/assets';
import { products } from '../../data/products';
import { useLanguage } from '../../context/LanguageContext';
import { MobileCardCarousel } from '../../components/ui/MobileCardCarousel';
import { Search, Grid, ArrowRight, Sparkles, Filter, ShieldCheck, ChevronRight, Home, ArrowLeft } from 'lucide-react';

export const categoriesData = [
  {
    id: 'ramen',
    name: 'Noodles & Instant Ramen',
    nameKo: '라면 & 국수',
    nameAr: 'معكرونة ورامن كوري',
    group: 'pantry',
    imageFile: 'SHIN.jpg',
    description: 'World-famous Shin Ramyun, spicy Buldak, Jin Ramen, Chapagetti, and veggie noodle cups.',
    featuredBadge: '🍜 Most Popular'
  },
  {
    id: 'halal-meat',
    name: 'Halal Korean BBQ Meats',
    nameKo: '할랄 정육 & 갈비',
    nameAr: 'لحوم كورية حلال للشواء',
    group: 'meats',
    imageFile: 'Untitled-design-(24).png',
    description: '100% Halal certified prime LA Short Ribs, Saeng Galbi, Chadolbagi brisket rolls, and minced beef.',
    featuredBadge: '🥩 100% Halal'
  },
  {
    id: 'kimchi',
    name: 'Kimchi & Side Dishes',
    nameKo: '김치 & 반찬',
    nameAr: 'كيمتشي ومقبلات كورية',
    group: 'chilled',
    imageFile: '550a89ae722f6e80587b8582ae78905a_1200x1200.jpg.webp',
    description: 'Naturally fermented Jongga Mat Kimchi, crispy Kkakdugi radish, and seasoned side dishes.',
    featuredBadge: '🥬 Fresh Import'
  },
  {
    id: 'mandu',
    name: 'Dumplings & Mandu',
    nameKo: '만두 & 교자',
    nameAr: 'زلابية ماندو كورية',
    group: 'chilled',
    imageFile: 'gyoza-mandu-w-chive-leek-40pcs-540g-allgroo.jpg',
    description: 'Crispy Allgroo chive leek mandu, kimchi dumplings, and Yoppoki rice cakes.',
    featuredBadge: '🥟 Ready to Cook'
  },
  {
    id: 'rice',
    name: 'Rice & Premium Grains',
    nameKo: '쌀 & 잡곡',
    nameAr: 'أرز كوري وحبوب فاخرة',
    group: 'pantry',
    imageFile: 'Rice.jpg',
    description: 'Premium sticky short-grain Akitakomachi rice 5kg and CJ Hetbahn microwave rice bowls.',
    featuredBadge: '🍚 Sticky Rice'
  },
  {
    id: 'drinks',
    name: 'Drinks & Beverages',
    nameKo: '음료 & 유제품',
    nameAr: 'مشروبات وحليب كوري',
    group: 'beverages',
    imageFile: '71TlHoNnegL.jpg',
    description: 'Iconic Binggrae Banana & Melon Milk packs, Milkis fizzy sodas, and Yuja citron tea jars.',
    featuredBadge: '🧃 Chilled Drinks'
  },
  {
    id: 'snacks',
    name: 'Snacks & Sweets',
    nameKo: '과자 & 스낵',
    nameAr: 'وجبات خفيفة وحلويات',
    group: 'beverages',
    imageFile: 'Buldak-Original.png',
    description: 'Haitai Honey Butter Chips, Orion Choco Pies, and Nongshim Shrimp Saewookang crackers.',
    featuredBadge: '🍿 K-Snacks'
  },
  {
    id: 'sauces',
    name: 'Sauces & Condiments',
    nameKo: '양념 & 장류',
    nameAr: 'صلصات وتوابل كورية',
    group: 'pantry',
    imageFile: 'Habanero.jpg',
    description: 'Authentic Sunchang Gochujang, Doenjang soybean paste, Ssamjang BBQ sauce, and sesame oil.',
    featuredBadge: '🌶️ Korean Sauces'
  },
  {
    id: 'beauty',
    name: 'Beauty & Skincare',
    nameKo: '뷰티 & 스킨케어',
    nameAr: 'عناية بالبشرة والتجميل',
    group: 'care',
    imageFile: '36-pads-Plant-Derived-Sanitary Pad Medium.jpg',
    description: 'Korean plant-derived sanitary pads, COSRX Snail Mucin, and Relief Sun rice sunscreen.',
    featuredBadge: '✨ K-Beauty'
  },
  {
    id: 'ready-to-eat',
    name: 'Ready-to-Eat',
    nameKo: '간편식 & 떡볶이',
    nameAr: 'وجبات جاهزة للأكل',
    group: 'chilled',
    imageFile: 'Rice.jpg',
    description: 'Instant CJ Hetbahn rice bowls, Yoppoki Tteokbokki rice cake cups, and Ottogi curry.',
    featuredBadge: '🍱 Fast & Fresh'
  },
  {
    id: 'seafood',
    name: 'Seafood & Dried Seaweed',
    nameKo: '해산물 & 건어물',
    nameAr: 'مأكولات بحرية وأعشاب',
    group: 'chilled',
    imageFile: '53bd20f8f28b7576920aafc782124092.jpg',
    description: 'Korean roasted seasoned laver seaweed packs, dried Miyeok, and squid rings.',
    featuredBadge: '🐟 Fresh Ocean'
  },
  {
    id: 'non-muslim',
    name: 'Non-Muslim / Non-Halal',
    nameKo: '논할랄 & 삼겹살',
    nameAr: 'منتجات غير حلال',
    group: 'meats',
    imageFile: 'Untitled-design-(24).png',
    description: 'Traditional fresh pork Samgyeopsal belly cut, Dongwon Spam, and Chamisul Soju.',
    featuredBadge: '🥓 Non-Halal'
  },
  {
    id: 'traditional',
    name: 'Korean Traditional Cooking',
    nameKo: '전통 식재료',
    nameAr: 'أغذية كورية تقليدية',
    group: 'pantry',
    imageFile: 'f0299f45-43aa-4c53-bf61-c1fbbeefae8a.png',
    description: 'Pure roasted sesame oil, Yuja citron honey tea jar, and sweet potato glass noodles.',
    featuredBadge: '🍶 Traditional'
  },
  {
    id: 'frozen',
    name: 'Frozen Foods & Eomuk',
    nameKo: '냉동 식품 & 어묵',
    nameAr: 'أغذية مجمدة وأوموك',
    group: 'meats',
    imageFile: 'd7bba86d-d7cc-497b-bde3-c2933cefc6be.jpg',
    description: 'Busan fish cake sheet packs (Eomuk), frozen mandu dumplings, and tteokbokki kits.',
    featuredBadge: '🧊 Deep Frozen'
  }
];

export function CategoriesPage() {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const navigate = useNavigate();

  const filterGroups = [
    { id: 'all', label: t('allCategories') },
    { id: 'pantry', label: t('ramen') },
    { id: 'meats', label: t('frozen') },
    { id: 'chilled', label: t('kimchi') },
    { id: 'beverages', label: t('drinks') },
    { id: 'care', label: t('beauty') }
  ];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categoriesData.filter((cat) => {
      // Group filter
      if (activeGroup !== 'all' && cat.group !== activeGroup) return false;

      // Search filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesDesc = cat.description.toLowerCase().includes(query);
        const matchesKo = cat.nameKo.includes(query);
        return matchesName || matchesDesc || matchesKo;
      }

      return true;
    });
  }, [activeGroup, searchTerm]);

  // Helper to count products in category
  const getItemCount = (catId) => {
    const count = products.filter((p) => p.category === catId || (catId === 'mandu' && p.id.includes('frozen'))).length;
    return count > 0 ? `${count} Items` : '10+ Items';
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen py-8">
      <SEOMeta title="All Product Categories | Korea Mart UAE Abu Dhabi" />

      <LayoutContainer className="space-y-8">
        
        {/* Page Banner Header */}
        <div className="relative bg-gradient-to-r from-[#0E2A5A] via-[#1E3A6A] to-[#5A3418] rounded-3xl overflow-hidden shadow-xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#5A3418] text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full uppercase border border-amber-500/20 shadow-md">
              <Sparkles size={14} className="text-amber-400" />
              <span>Direct Korean Import Department</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t('featuredCategories')}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              {t('handpickedImports')}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0E2A5A] bg-white hover:bg-amber-300 px-5 py-3 rounded-full shadow-lg transition-all active:scale-95 border-0 cursor-pointer"
              title="Go back to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-white/15 hover:bg-white/25 border border-white/20 px-5 py-3 rounded-full shadow-lg transition-all active:scale-95 no-underline"
              title="Go to Home"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input Bar */}
            <div className="w-full md:w-96 relative flex items-center bg-[#F7F7F7] border border-[#ECECEC] rounded-full px-4 py-2.5 focus-within:border-[#0E2A5A] focus-within:bg-white transition-all shadow-inner">
              <Search size={18} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                className="w-full text-xs font-medium text-[#222222] bg-transparent focus:outline-none placeholder:text-slate-400"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
              {filterGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                    activeGroup === group.id
                      ? 'bg-[#0E2A5A] text-white border-[#0E2A5A] shadow-md'
                      : 'bg-[#F7F7F7] text-[#222222] border-[#ECECEC] hover:border-[#0E2A5A]'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Category Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-[#ECECEC] rounded-2xl p-12 text-center"
            >
              <span className="text-4xl mb-2 block">🔍</span>
              <h3 className="text-lg font-black text-[#0E2A5A] mb-1">No category matches "{searchTerm}"</h3>
              <p className="text-xs text-slate-500 mb-4">Try searching for another keyword or reset active filter tabs.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveGroup('all');
                }}
                className="bg-[#0E2A5A] text-white font-bold text-xs px-6 py-2.5 rounded-full"
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            <>
              {/* Mobile 1-by-1 Touch Swipe Carousel */}
              <MobileCardCarousel
                items={filteredCategories}
                renderItem={(cat) => {
                  const imgUrl = getProductImage(cat.imageFile);
                  const catName = lang === 'ko' ? cat.nameKo :
                                  lang === 'ar' ? cat.nameAr :
                                  t(cat.id) || cat.name;

                  return (
                    <div
                      onClick={() => navigate(`/products?category=${cat.id}`)}
                      className="group bg-white border border-[#ECECEC] hover:border-[#0E2A5A]/40 rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden w-full max-w-[280px]"
                    >
                      <div>
                        {/* Image Box */}
                        <div className="relative w-full h-44 rounded-2xl bg-[#F7F7F7] p-4 flex items-center justify-center mb-4 overflow-hidden">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={catName}
                              className="max-h-36 max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-4xl">🏬</div>
                          )}

                          {/* Top Badge */}
                          <span className="absolute top-3 left-3 bg-[#0E2A5A] text-white text-[11px] font-black px-3 py-1 rounded-md shadow-md">
                            {cat.featuredBadge}
                          </span>
                        </div>

                        {/* Title & Korean Subtitle */}
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-base font-black text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors leading-tight">
                            {catName}
                          </h3>
                          <span className="text-xs font-bold text-[#5A3418] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            {cat.nameKo}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#666666] leading-relaxed mb-4 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-dashed border-[#ECECEC] flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0E2A5A]">
                          {getItemCount(cat.id)}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#5A3418] group-hover:translate-x-1 transition-transform">
                          <span>Explore Products</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                }}
              />

              {/* Desktop Grid Layout */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {filteredCategories.map((cat, idx) => {
                  const imgUrl = getProductImage(cat.imageFile);
                  const catName = lang === 'ko' ? cat.nameKo :
                                  lang === 'ar' ? cat.nameAr :
                                  t(cat.id) || cat.name;

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ y: -8 }}
                      onClick={() => navigate(`/products?category=${cat.id}`)}
                      className="group bg-white border border-[#ECECEC] hover:border-[#0E2A5A]/40 rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        {/* Image Box */}
                        <div className="relative w-full h-48 rounded-2xl bg-[#F7F7F7] p-4 flex items-center justify-center mb-4 overflow-hidden">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={catName}
                              className="max-h-40 max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-4xl">🏬</div>
                          )}

                          {/* Top Badge */}
                          <span className="absolute top-3 left-3 bg-[#0E2A5A] text-white text-[11px] font-black px-3 py-1 rounded-md shadow-md">
                            {cat.featuredBadge}
                          </span>
                        </div>

                        {/* Title & Korean Subtitle */}
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-base font-black text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors leading-tight">
                            {catName}
                          </h3>
                          <span className="text-xs font-bold text-[#5A3418] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            {cat.nameKo}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#666666] leading-relaxed mb-4 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-dashed border-[#ECECEC] flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0E2A5A]">
                          {getItemCount(cat.id)}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#5A3418] group-hover:translate-x-1 transition-transform">
                          <span>Explore Products</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </AnimatePresence>

      </LayoutContainer>
    </div>
  );
}
