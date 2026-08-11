import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Grid } from 'lucide-react';
import { getProductImage } from '../../utils/assets';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';
import { MobileCardCarousel } from '../ui/MobileCardCarousel';

// 8 Premium Categories mapped to actual local product images in src/assets/products/
export const previewCategories = [
  {
    id: 'ramen',
    nameKey: 'ramen',
    imageFile: 'SHIN.jpg',
    itemCount: '18 Items',
    badge: 'Popular 🍜'
  },
  {
    id: 'halal-meat',
    nameKey: 'halalMeat',
    imageFile: 'Untitled-design-(24).png',
    itemCount: '12 Items',
    badge: '100% Halal 🥩'
  },
  {
    id: 'kimchi',
    nameKey: 'kimchi',
    imageFile: '550a89ae722f6e80587b8582ae78905a_1200x1200.jpg.webp',
    itemCount: '14 Items',
    badge: 'Fresh 🥬'
  },
  {
    id: 'mandu',
    nameKey: 'mandu',
    imageFile: 'gyoza-mandu-w-chive-leek-40pcs-540g-allgroo.jpg',
    itemCount: '10 Items',
    badge: 'Authentic 🥟'
  },
  {
    id: 'rice',
    nameKey: 'rice',
    imageFile: 'Rice.jpg',
    itemCount: '8 Items',
    badge: 'Sticky Rice 🍚'
  },
  {
    id: 'drinks',
    nameKey: 'drinks',
    imageFile: '71TlHoNnegL.jpg',
    itemCount: '15 Items',
    badge: 'Chilled 🧃'
  },
  {
    id: 'snacks',
    nameKey: 'snacks',
    imageFile: 'Buldak-Original.png',
    itemCount: '20 Items',
    badge: 'K-Snacks 🍿'
  },
  {
    id: 'sauces',
    nameKey: 'sauces',
    imageFile: 'Habanero.jpg',
    itemCount: '16 Items',
    badge: 'Gochujang 🌶️'
  }
];

export const FeaturedCategoriesPreview = memo(function FeaturedCategoriesPreview({ onSelectCategory, onViewAll }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCategoryClick = useCallback((catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      navigate(`/products?category=${catId}`);
    }
  }, [onSelectCategory, navigate]);

  const handleViewAllClick = useCallback(() => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/categories');
    }
  }, [onViewAll, navigate]);

  return (
    <section id="featured-categories" className="py-12 bg-white">
      <LayoutContainer>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 pb-4 border-b border-[#ECECEC] space-y-1">
          <span className="text-xs font-black text-[#5A3418] uppercase tracking-widest block">
            {t('exploreGrocery')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0E2A5A]">
            {t('featuredCategories')}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-medium">
            {t('handpickedImports')}
          </p>
        </div>

        {/* Mobile 1-by-1 Touch Swipe Carousel */}
        <MobileCardCarousel
          items={previewCategories}
          renderItem={(cat) => {
            const imageUrl = getProductImage(cat.imageFile);
            const catName = t(cat.nameKey);

            return (
              <div
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative bg-[#F7F7F7] border border-[#ECECEC] hover:border-[#0E2A5A]/40 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden w-full max-w-[280px]"
              >
                {/* Category Image Box */}
                <div className="relative w-full h-40 rounded-xl bg-white p-3 flex items-center justify-center mb-3 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={catName}
                      className="max-h-32 max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="text-3xl">🏬</div>
                  )}

                  {/* Top Badge */}
                  <span className="absolute top-2 left-2 bg-[#0E2A5A]/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-sm">
                    {cat.badge}
                  </span>
                </div>

                {/* Category Name & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors leading-tight">
                      {catName}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#666666] block mt-0.5">
                      {cat.itemCount}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#0E2A5A] text-[#0E2A5A] group-hover:text-white flex items-center justify-center shadow-sm transition-colors shrink-0 ml-2">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          }}
        />

        {/* Desktop Grid Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 md:gap-6">
          {previewCategories.map((cat, index) => {
            const imageUrl = getProductImage(cat.imageFile);
            const catName = t(cat.nameKey);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative bg-[#F7F7F7] border border-[#ECECEC] hover:border-[#0E2A5A]/40 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden"
              >
                {/* Category Image Box */}
                <div className="relative w-full h-36 sm:h-40 rounded-xl bg-white p-3 flex items-center justify-center mb-3 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={catName}
                      className="max-h-32 max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="text-3xl">🏬</div>
                  )}

                  {/* Top Badge */}
                  <span className="absolute top-2 left-2 bg-[#0E2A5A]/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-sm">
                    {cat.badge}
                  </span>
                </div>

                {/* Category Name & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors leading-tight">
                      {catName}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#666666] block mt-0.5">
                      {cat.itemCount}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#0E2A5A] text-[#0E2A5A] group-hover:text-white flex items-center justify-center shadow-sm transition-colors shrink-0 ml-2">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Button Action */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={handleViewAllClick}
            className="inline-flex items-center gap-2 bg-[#5A3418] hover:bg-[#432611] text-white font-black text-sm px-8 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Grid size={16} />
            <span>{t('exploreAllGroceries')}</span>
          </button>
        </div>
      </LayoutContainer>
    </section>
  );
});
