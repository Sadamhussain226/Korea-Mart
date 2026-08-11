import React, { memo } from 'react';
import { brandLogo } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import {
  Apple,
  Truck,
  Tag,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';
import { LayoutContainer } from '../layout/LayoutContainer';

export const Footer = memo(function Footer() {
  const { t } = useLanguage();

  return (
    <>
      {/* 1. Feature / Trust Badges Section (ABOVE Footer - Light Neutral Background) */}
      <div className="bg-white border-y border-[#ECECEC] py-6 sm:py-8 mt-8 sm:mt-16 select-none">
        <LayoutContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left rtl:text-right">
          {/* Badge 1 */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Apple size={20} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-[#0E2A5A] leading-tight">{t('everydayFresh')}</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight mt-0.5 font-medium">{t('everydayFreshSub')}</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
              <Truck size={20} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-[#0E2A5A] leading-tight">{t('freeDeliveryTitle')}</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight mt-0.5 font-medium">{t('freeDeliverySub')}</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
              <Tag size={20} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-[#0E2A5A] leading-tight">{t('exclusiveDiscounts')}</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight mt-0.5 font-medium">{t('exclusiveDiscountsSub')}</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <DollarSign size={20} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-[#0E2A5A] leading-tight">{t('bestPrice')}</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight mt-0.5 font-medium">{t('bestPriceSub')}</p>
            </div>
          </div>
        </LayoutContainer>
      </div>

      {/* 2. Actual Dark Navy Footer Section */}
      <footer className="bg-[#0B1D3A] text-white border-t border-[#1E3A6A] select-none">
        {/* Main Footer Content */}
        <LayoutContainer className="py-8 sm:py-14 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 sm:gap-8">
          
          {/* Col 1: Brand Info (Spans 2 cols) */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt="Korea Mart UAE Logo"
                  className="h-10 sm:h-11 w-auto object-contain bg-white p-1 rounded-xl shadow-md"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-amber-400 to-orange-500 text-[#0E2A5A] rounded-2xl flex items-center justify-center font-black text-lg shadow-md">
                  KM
                </div>
              )}
              <div>
                <h3 className="font-black text-base sm:text-lg text-white leading-tight">{t('storeName')}</h3>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Abu Dhabi, UAE 🇦🇪</span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm font-medium">
              {t('footerDesc') || 'Abu Dhabi\'s premier destination for authentic, high-quality Korean groceries, ramyun, meats, and snacks.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>{t('halalCertified')}</span>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mr-1">{t('followUs')}</span>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1E3A6A]/60 hover:bg-[#5A3418] text-slate-200 hover:text-white flex items-center justify-center transition-all border border-white/10" aria-label="Instagram">
                  <FaInstagram size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1E3A6A]/60 hover:bg-[#5A3418] text-slate-200 hover:text-white flex items-center justify-center transition-all border border-white/10" aria-label="Facebook">
                  <FaFacebook size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1E3A6A]/60 hover:bg-[#5A3418] text-slate-200 hover:text-white flex items-center justify-center transition-all border border-white/10" aria-label="YouTube">
                  <FaYoutube size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1E3A6A]/60 hover:bg-[#5A3418] text-slate-200 hover:text-white flex items-center justify-center transition-all border border-white/10" aria-label="TikTok">
                  <FaTiktok size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-span-1 space-y-3">
            <h4 className="font-black text-xs text-amber-400 uppercase tracking-wider border-b border-[#1E3A6A] pb-1.5 inline-block">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li><a href="#" className="hover:text-white transition-colors block py-0.5">{t('aboutUs')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors block py-0.5">{t('contactUs')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors block py-0.5">{t('privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors block py-0.5">{t('termsConditions')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors block py-0.5">{t('returnPolicy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors block py-0.5">{t('deliveryGuidelines')}</a></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="col-span-1 space-y-3">
            <h4 className="font-black text-xs text-amber-400 uppercase tracking-wider border-b border-[#1E3A6A] pb-1.5 inline-block">
              {t('productCategories')}
            </h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li><a href="/products?category=ramen" className="hover:text-white transition-colors block py-0.5">{t('ramen')}</a></li>
              <li><a href="/products?category=kimchi" className="hover:text-white transition-colors block py-0.5">{t('kimchi')}</a></li>
              <li><a href="/products?category=frozen" className="hover:text-white transition-colors block py-0.5">{t('frozen')}</a></li>
              <li><a href="/products?category=rice" className="hover:text-white transition-colors block py-0.5">{t('rice')}</a></li>
              <li><a href="/products?category=drinks" className="hover:text-white transition-colors block py-0.5">{t('drinks')}</a></li>
              <li><a href="/products?category=beauty" className="hover:text-white transition-colors block py-0.5">{t('beauty')}</a></li>
            </ul>
          </div>

          {/* Col 4: Customer Support */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 space-y-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#1E3A6A]">
            <h4 className="font-black text-xs text-amber-400 uppercase tracking-wider border-b border-[#1E3A6A] pb-1.5 inline-block">
              {t('customerSupport')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#CBD5E1]">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Al Reem Island & Corniche Store, Abu Dhabi, UAE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-amber-400 shrink-0" />
                <a href="tel:+971561549027" className="hover:text-white transition-colors">+971 56 154 9027</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-emerald-400 shrink-0" />
                <a href="https://wa.me/971561549027" target="_blank" rel="noreferrer" className="text-emerald-400 font-extrabold hover:text-emerald-300 hover:underline">
                  {t('whatsappSupport')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-amber-400 shrink-0" />
                <span>orders@koreamartuae.ae</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-amber-400 shrink-0" />
                <span>9:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>

        </LayoutContainer>

        {/* 3. Bottom Copyright Bar */}
        <div className="bg-[#071326] text-slate-300 text-xs py-4 border-t border-[#1E3A6A]">
          <LayoutContainer className="text-center">
            <p className="font-medium text-[#CBD5E1]">
              © 2026 Korea Mart UAE • Developed by{' '}
              <a
                href="https://wa.me/923419996269"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 font-bold hover:text-amber-300 hover:underline transition-colors ml-0.5"
              >
                Sadam Hussain
              </a>
            </p>
          </LayoutContainer>
        </div>
      </footer>
    </>
  );
});
