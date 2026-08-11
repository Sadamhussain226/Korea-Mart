import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { MobileCardCarousel } from '../ui/MobileCardCarousel';
import { products } from '../../data/products';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';

export const FeaturedProducts = memo(function FeaturedProducts({ onQuickView }) {
  const { t } = useLanguage();
  // Select top featured items (5 items for 5-column desktop layout)
  const featured = useMemo(
    () => products.filter((p) => p.isBestseller || p.rating >= 4.85).slice(0, 5),
    []
  );

  return (
    <section id="featured-products" className="py-12 bg-white">
      <LayoutContainer className="space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto pb-4 border-b border-[#ECECEC] space-y-1">
          <span className="text-xs font-black text-[#5A3418] uppercase tracking-widest block">
            {t('handpickedEssentials')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0E2A5A]">
            {t('featuredProducts')}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-medium">
            {t('topCustomerPicks')}
          </p>
        </div>

        {/* Mobile 1-by-1 Touch Swipe Carousel */}
        <MobileCardCarousel
          items={featured}
          renderItem={(product) => (
            <ProductCard product={product} onQuickView={onQuickView} />
          )}
        />

        {/* Desktop Grid Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 md:gap-6">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </motion.div>
          ))}
        </div>

      </LayoutContainer>
    </section>
  );
});
