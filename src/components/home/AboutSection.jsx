import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Phone, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { allBannerImages } from '../../utils/assets';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';

export const AboutSection = memo(function AboutSection() {
  const { t } = useLanguage();
  const storeBanner = allBannerImages[3] || allBannerImages[0];

  return (
    <section className="py-16 bg-white border-t border-[#ECECEC]">
      <LayoutContainer>
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Image Column (One Side) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#ECECEC] group">
              {storeBanner ? (
                <img
                  src={storeBanner}
                  alt="Korea Mart UAE Store"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-[360px] bg-slate-900 flex items-center justify-center text-white text-5xl">
                  🏬
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-xl flex items-center justify-between text-[#0E2A5A]">
                <div>
                  <h4 className="font-black text-sm">{t('warehouseLocation')}</h4>
                  <p className="text-[11px] text-slate-600">Al Reem Island & Corniche Central</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0E2A5A] text-white flex items-center justify-center font-black text-sm shrink-0">
                  KM
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Column (Other Side) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs font-black text-[#5A3418] uppercase tracking-widest block">
                {t('directImporters')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0E2A5A] leading-tight">
                {t('aboutTitle')}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-medium">
              {t('aboutP1')}
            </p>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              {t('aboutP2')}
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#ECECEC]">
                <span className="text-base font-black text-[#0E2A5A] block">500+</span>
                <span className="text-[11px] text-[#666666]">{t('directImportsCount')}</span>
              </div>
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#ECECEC]">
                <span className="text-base font-black text-emerald-700 block">100% Halal</span>
                <span className="text-[11px] text-[#666666]">{t('halalCertifiedBadge')}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/971561549027"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#5A3418] hover:bg-[#432611] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-lg transition-all no-underline"
              >
                <MessageCircle size={16} />
                <span>{t('contactViaWhatsapp')}</span>
              </a>

              <a
                href="tel:+971561549027"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0E2A5A] hover:underline"
              >
                <Phone size={14} className="text-amber-600" />
                <span>+971 56 154 9027</span>
              </a>
            </div>
          </motion.div>

        </div>
      </LayoutContainer>
    </section>
  );
});
