import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { MobileCardCarousel } from '../ui/MobileCardCarousel';
import { products } from '../../data/products';
import { allBannerImages } from '../../utils/assets';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';

export const TodaysOffers = memo(function TodaysOffers({ onQuickView }) {
  const { t } = useLanguage();
  // Filter products with sale or discount
  const offerProducts = useMemo(
    () => products.filter((p) => p.isSale || p.originalPrice).slice(0, 5),
    []
  );

  const banner1 = allBannerImages[1] || allBannerImages[0];
  const banner2 = allBannerImages[2] || allBannerImages[0];

  return (
    <section id="todays-offers" className="py-12 bg-[#F7F7F7] border-t border-[#ECECEC]">
      <LayoutContainer className="space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto pb-4 border-b border-[#ECECEC] space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase shadow-sm">
            <Flame size={13} />
            <span>{t('limitedTimeOffers')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0E2A5A]">
            {t('todaysSuperDeals')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-[#5A3418] bg-white px-4 py-1.5 rounded-full border border-[#ECECEC] shadow-sm w-fit mx-auto">
            <Clock size={14} className="text-red-600 animate-spin-slow" />
            <span>{t('updatedDaily')}</span>
          </div>
        </div>

        {/* Promotional Banner Cards (Reference Style) */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Banner 1: LA Galbi Deal */}
          <motion.div
            whileHover={{ y: -4 }}
            className="relative bg-gradient-to-r from-black via-slate-900 to-[#5A3418] rounded-2xl overflow-hidden shadow-lg border border-[#ECECEC] p-6 text-white min-h-[200px] flex flex-col justify-between group"
          >
            {banner1 && (
              <img
                src={banner1}
                alt="LA Galbi Special Offer Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="relative z-10">
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase shadow-sm">
                {t('sale')}
              </span>
              <h3 className="text-xl md:text-2xl font-black mt-2 leading-tight">
                LA Galbi Short Ribs 1kg
              </h3>
              <p className="text-xs text-slate-200 mt-1 max-w-md">
                100% Halal prime cross-cut beef short ribs prepared for Korean BBQ grill.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between">
              <div>
                <span className="text-lg font-black text-amber-400">110.00 AED</span>
                <span className="text-xs text-slate-300 line-through ml-2">130.00 AED</span>
              </div>
              <span className="text-xs font-bold text-white group-hover:underline flex items-center gap-1">
                <span>{t('grabDeal')}</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </motion.div>

          {/* Banner 2: Korean Ramen 30% OFF */}
          <motion.div
            whileHover={{ y: -4 }}
            className="relative bg-gradient-to-r from-[#0E2A5A] via-[#1E3A6A] to-slate-900 rounded-2xl overflow-hidden shadow-lg border border-[#ECECEC] p-6 text-white min-h-[200px] flex flex-col justify-between group"
          >
            {banner2 && (
              <img
                src={banner2}
                alt="Ramen Pack Offer Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="relative z-10">
              <span className="bg-[#5A3418] text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase shadow-sm">
                30% OFF
              </span>
              <h3 className="text-xl md:text-2xl font-black mt-2 leading-tight">
                Korean Ramen Festival
              </h3>
              <p className="text-xs text-slate-200 mt-1 max-w-md">
                Save big on Buldak, Shin Ramyun, Jin Ramen & Chapagetti 5-packs.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between">
              <div>
                <span className="text-lg font-black text-amber-400">From 21.00 AED</span>
              </div>
              <span className="text-xs font-bold text-white group-hover:underline flex items-center gap-1">
                <span>{t('exploreBundle')}</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </motion.div>
        </div>

        {/* Discounted Reusable Product Cards Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg text-[#0E2A5A] flex items-center gap-2">
              <Tag size={18} className="text-[#5A3418]" />
              <span>{t('discountedItems')}</span>
            </h3>
          </div>

          {/* Mobile 1-by-1 Touch Swipe Carousel */}
          <MobileCardCarousel
            items={offerProducts.slice(0, 5)}
            renderItem={(product) => (
              <ProductCard product={product} onQuickView={onQuickView} />
            )}
          />

          {/* Desktop Grid Layout */}
          <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 md:gap-6">
            {offerProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex">
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        </div>

      </LayoutContainer>
    </section>
  );
});
