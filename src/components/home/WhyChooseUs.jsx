import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Banknote, MessageCircle, Award, Store } from 'lucide-react';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';
import { MobileCardCarousel } from '../ui/MobileCardCarousel';

export const WhyChooseUs = memo(function WhyChooseUs() {
  const { t } = useLanguage();
  const features = [
    {
      id: 'authentic',
      icon: ShieldCheck,
      title: 'Authentic Korean Products',
      desc: '100% direct imports from top South Korean brands (Nongshim, Samyang, Jongga, CJ Bibigo).',
      badgeColor: 'bg-red-500/10 text-red-600'
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Fast Delivery inside Abu Dhabi',
      desc: 'Next-Day express delivery across Al Reem, Corniche, Khalifa City, MBZ, Saadiyat & all UAE.',
      badgeColor: 'bg-amber-500/10 text-amber-700'
    },
    {
      id: 'cod',
      icon: Banknote,
      title: 'Cash On Delivery',
      desc: 'No credit card required. Convenient cash or card payment at your doorstep upon receipt.',
      badgeColor: 'bg-emerald-500/10 text-emerald-700'
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp Ordering',
      desc: 'Place your grocery order instantly without account creation or registration.',
      badgeColor: 'bg-emerald-600/10 text-emerald-600'
    },
    {
      id: 'quality',
      icon: Award,
      title: 'Premium Quality & Halal',
      desc: 'Strict temperature-controlled chilled shipping and certified 100% Halal options.',
      badgeColor: 'bg-[#5A3418]/10 text-[#5A3418]'
    },
    {
      id: 'trusted',
      icon: Store,
      title: 'Trusted Korean Grocery Store',
      desc: 'Serving thousands of satisfied Korean expat families and UAE residents in Abu Dhabi.',
      badgeColor: 'bg-[#0E2A5A]/10 text-[#0E2A5A]'
    }
  ];

  return (
    <section className="py-16 bg-[#F7F7F7] border-t border-[#ECECEC]">
      <LayoutContainer className="space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#5A3418] uppercase tracking-widest block">
            {t('whyAbuDhabiChoosesUs')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0E2A5A]">
            {t('whyChooseTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            {t('whyChooseDesc')}
          </p>
        </div>

        {/* Mobile 1-by-1 Touch Swipe Carousel */}
        <MobileCardCarousel
          items={features}
          renderItem={(item) => {
            const Icon = item.icon;
            return (
              <div className="bg-white border border-[#ECECEC] hover:border-[#0E2A5A]/30 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between w-full max-w-[280px]">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${item.badgeColor}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          }}
        />

        {/* Desktop Grid Layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-[#ECECEC] hover:border-[#0E2A5A]/30 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${item.badgeColor}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0E2A5A] group-hover:text-[#5A3418] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </LayoutContainer>
    </section>
  );
});
