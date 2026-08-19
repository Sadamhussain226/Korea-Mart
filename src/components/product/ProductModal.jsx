import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle, getProductDesc } from '../../utils/translator';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';
import { ProductGraphic } from './ProductGraphic';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  MessageCircle,
  Star,
  ShieldCheck,
  Flame,
  Truck,
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export function ProductModal({ product, onClose }) {
  const { lang, t } = useLanguage();
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!product) return null;

  const title = getProductTitle(product, lang);
  const desc = getProductDesc(product, lang);
  const imageUrl = getProductImage(product.image);

  // Discount percentage calculation
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const totalPrice = (product.price * qty).toFixed(2);
  const totalOriginalPrice = product.originalPrice
    ? (product.originalPrice * qty).toFixed(2)
    : null;
  const totalSavings = product.originalPrice
    ? ((product.originalPrice - product.price) * qty).toFixed(2)
    : null;

  // WhatsApp quick order URL
  const whatsappUrl = getProductWhatsAppUrl(product, qty);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 600);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    onClose();
  };

  const handleNavigateToDetail = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl sm:max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Sticky/Fixed Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-xs cursor-pointer rtl:right-auto rtl:left-3.5 sm:rtl:left-4"
          aria-label="Close product preview"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Content Area */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Product Image Showcase */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-2xl border border-slate-100 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                {/* Badges Container */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 rtl:left-auto rtl:right-3 pointer-events-none">
                  {discountPercent ? (
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                      {discountPercent}% OFF
                    </span>
                  ) : null}
                  {product.isBestseller && !discountPercent && (
                    <span className="bg-[#0E2A5A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase">
                      🔥 {t('bestseller')}
                    </span>
                  )}
                  {product.isHalal && (
                    <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase flex items-center gap-1">
                      <ShieldCheck size={11} />
                      <span>{t('halal')}</span>
                    </span>
                  )}
                  {product.spicyLevel > 0 && (
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Flame size={11} />
                      <span>{t('spicy')} Lvl {product.spicyLevel}</span>
                    </span>
                  )}
                </div>

                {/* Product Image */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="max-h-56 max-w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-36 h-36">
                    <ProductGraphic type={product.svgType} />
                  </div>
                )}
              </div>

              {/* View Full Product Page Link */}
              <button
                type="button"
                onClick={handleNavigateToDetail}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0E2A5A] hover:text-[#5A3418] hover:underline py-1 transition-colors cursor-pointer"
              >
                <span>{t('viewDetails') || 'View Full Product Details'}</span>
                <ExternalLink size={13} />
              </button>
            </div>

            {/* RIGHT COLUMN: Product Information & Purchase CTAs */}
            <div className="md:col-span-7 flex flex-col justify-between text-left rtl:text-right">
              <div>
                {/* Meta Row: Origin, Category, Rating */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[#5A3418] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 uppercase tracking-wider">
                    {product.origin}
                  </span>

                  {product.rating && (
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                      <Star size={13} fill="currentColor" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.reviewsCount || 42} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug mb-1.5">
                  {title}
                </h2>

                {/* Weight / Pack Spec */}
                <p className="text-xs text-slate-500 font-semibold mb-3">
                  ⚖️ Net Weight: <span className="text-slate-800 font-black">{product.weight}</span>
                </p>

                {/* Price Display Box */}
                <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 sm:p-3.5 mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-black text-[#0E2A5A] leading-tight">
                        {totalPrice} AED
                      </span>
                      {totalOriginalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                          {totalOriginalPrice} AED
                        </span>
                      )}
                    </div>
                    {totalSavings && (
                      <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                        🎉 Save {totalSavings} AED
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    In Stock • Ready to Ship
                  </span>
                </div>

                {/* Description */}
                {desc && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {desc}
                  </p>
                )}

                {/* Quantity Selector Row */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      disabled={qty <= 1}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0E2A5A] hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-[#0E2A5A]">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-[#0E2A5A] hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS: Add to Cart & Buy Now */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-white transition-all shadow-md active:scale-98 cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#0E2A5A] hover:bg-[#091b3a]'
                    }`}
                  >
                    {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                    <span>
                      {justAdded
                        ? t('added') || 'Added to Cart!'
                        : `${t('addToCart')} (${totalPrice} AED)`}
                    </span>
                  </button>

                  {/* Buy Now (Express Checkout) Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-white bg-[#5A3418] hover:bg-[#432611] transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <Zap size={16} className="text-amber-400 fill-current" />
                    <span>{t('buyNow') || 'Buy Now (Express)'}</span>
                  </button>
                </div>

                {/* Direct WhatsApp Order CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors no-underline shadow-2xs"
                >
                  <MessageCircle size={15} />
                  <span>Order via WhatsApp (+971 56 154 9027)</span>
                </a>
              </div>

              {/* Delivery Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-around text-[11px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-[#0E2A5A]" />
                  <span>Next-Day Delivery</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>100% Authentic Korean</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
