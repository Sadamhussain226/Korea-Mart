import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Heart } from 'lucide-react';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';
import { MobileCardCarousel } from '../ui/MobileCardCarousel';

export const CustomerTestimonials = memo(function CustomerTestimonials() {
  const { t } = useLanguage();
  const testimonials = [
    {
      id: '1',
      name: 'Min-ji Park',
      location: 'Al Reem Island, Abu Dhabi 🇰🇷',
      avatar: '👩🏻‍🦰',
      rating: 5,
      review: 'Finding authentic Jongga Kimchi and Samyang Buldak in Abu Dhabi used to be hard. Korea Mart UAE delivers next-day right to my apartment! Super fresh and excellent packaging.'
    },
    {
      id: '2',
      name: 'Fatima Al-Mansoori',
      location: 'Corniche, Abu Dhabi 🇦🇪',
      avatar: '🧕🏼',
      rating: 5,
      review: 'The Halal LA Galbi short ribs and Chadolbagi beef are restaurant quality! We grilled them at home for family dinner. Ordering via WhatsApp was so easy.'
    },
    {
      id: '3',
      name: 'Sarah Jenkins',
      location: 'Khalifa City, Abu Dhabi 🇬🇧',
      avatar: '👩🏼',
      rating: 5,
      review: 'My kids love the Binggrae Melon Milk and Haitai Honey Butter chips. Fast delivery, friendly service, and cash on delivery option makes shopping stress-free.'
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-[#F7F7F7] border-t border-[#ECECEC]">
      <LayoutContainer className="space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#5A3418] uppercase tracking-widest block">
            {t('realReviews')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0E2A5A]">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            {t('testimonialsSubtitle')}
          </p>
        </div>

        {/* Mobile 1-by-1 Touch Swipe Carousel */}
        <MobileCardCarousel
          items={testimonials}
          renderItem={(item) => (
            <div className="bg-white border border-[#ECECEC] hover:border-[#0E2A5A]/30 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group overflow-hidden w-full max-w-[280px]">
              <Quote size={40} className="absolute top-4 right-4 text-slate-100 group-hover:text-amber-500/10 transition-colors" />

              <div className="relative z-10 space-y-4">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#222222] leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              {/* Customer Profile */}
              <div className="pt-4 mt-4 border-t border-dashed border-[#ECECEC] flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-full bg-[#F7F7F7] border border-[#ECECEC] flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  {item.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#666666] block">
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          )}
        />

        {/* Desktop Grid Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-[#ECECEC] hover:border-[#0E2A5A]/30 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
            >
              <Quote size={40} className="absolute top-4 right-4 text-slate-100 group-hover:text-amber-500/10 transition-colors" />

              <div className="relative z-10 space-y-4">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#222222] leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              {/* Customer Profile */}
              <div className="pt-4 mt-4 border-t border-dashed border-[#ECECEC] flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-full bg-[#F7F7F7] border border-[#ECECEC] flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  {item.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#666666] block">
                    {item.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </LayoutContainer>
    </section>
  );
});
