import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import { ProductGraphic } from './ProductGraphic';
import { Plus, Eye, Star, Flame, ShieldCheck, MessageCircle, Heart } from 'lucide-react';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';

export const ProductCard = memo(function ProductCard({ product, onQuickView, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const title = getProductTitle(product, lang);
  const imageUrl = getProductImage(product.image);

  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // WhatsApp quick order link
  const whatsappUrl = getProductWhatsAppUrl(product, 1);

  const toggleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }, [addToCart, product]);

  const handleQuickViewClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  }, [onQuickView, product]);

  // ==========================================
  // LIST VIEW LAYOUT (FOR CATALOG LIST MODE)
  // ==========================================
  if (layout === 'list') {
    return (
      <div className="group relative w-full bg-white border border-slate-200/90 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:border-[#0E2A5A]/30 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden">
        {/* Image Box */}
        <div className="relative w-full sm:w-44 h-44 shrink-0 bg-[#F8FAFC] rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-3">
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 rtl:left-auto rtl:right-2 pointer-events-none">
            {discountPercent ? (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase">
                {discountPercent}% OFF
              </span>
            ) : null}
            {product.isBestseller && !discountPercent && (
              <span className="bg-[#0E2A5A] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase">
                🔥 {t('bestseller')}
              </span>
            )}
          </div>

          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="max-h-36 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-24 h-24">
                <ProductGraphic type={product.svgType} />
              </div>
            )}
          </Link>

          {/* Quick View Button */}
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 text-[#0E2A5A] hover:bg-[#0E2A5A] hover:text-white border border-slate-200/80 shadow-xs flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 rtl:right-auto rtl:left-2 cursor-pointer"
            title={t('quickView')}
            aria-label={t('quickView')}
          >
            <Eye size={15} />
          </button>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 text-left rtl:text-right w-full">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-500">{product.origin}</span>
            {product.isHalal && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck size={11} />
                <span>{t('halal')}</span>
              </span>
            )}
            {product.spicyLevel > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200/60">
                <Flame size={11} />
                <span>{t('spicy')} Lvl {product.spicyLevel}</span>
              </span>
            )}
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold ml-auto rtl:ml-0 rtl:mr-auto">
                <Star size={13} fill="currentColor" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount || 42})</span>
              </div>
            )}
          </div>

          <Link to={`/product/${product.id}`} className="no-underline block">
            <h3 className="font-extrabold text-slate-900 text-base leading-snug hover:text-[#0E2A5A] transition-colors mb-1">
              {title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 font-medium mb-2">⚖️ {product.weight}</p>

          {product.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed hidden sm:block">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Actions Column */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-48 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
          <div className="text-left sm:text-right rtl:text-right sm:rtl:text-left">
            <span className="text-lg font-black text-[#0E2A5A] block leading-tight">
              {product.price.toFixed(2)} AED
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-semibold">
                {product.originalPrice.toFixed(2)} AED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Quick Order Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-colors border border-emerald-200/80 shadow-2xs flex items-center justify-center"
              title="Order via WhatsApp"
              aria-label="Order via WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs text-white transition-all duration-200 shadow-xs active:scale-95 cursor-pointer select-none whitespace-nowrap bg-[#0E2A5A] hover:bg-[#5A3418]"
              title={t('add')}
              aria-label={t('add')}
            >
              <Plus size={15} />
              <span>{t('add')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STANDARD GRID VIEW CARD (DEFAULT)
  // ==========================================
  return (
    <div className="group relative w-full h-full bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:shadow-xl hover:border-[#0E2A5A]/35 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Product Image Container */}
        <div className="relative w-full aspect-square sm:aspect-auto sm:h-44 bg-[#F8FAFC] rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-3 mb-2.5">
          
          {/* Discount & Feature Badges (Top Left) */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10 rtl:left-auto rtl:right-2 pointer-events-none">
            {discountPercent ? (
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            ) : null}
            {product.isBestseller && !discountPercent && (
              <span className="bg-[#0E2A5A] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs uppercase">
                🔥 {t('bestseller')}
              </span>
            )}
            {product.isHalal && (
              <span className="bg-emerald-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs uppercase flex items-center gap-1">
                <ShieldCheck size={10} />
                <span>{t('halal')}</span>
              </span>
            )}
            {product.spicyLevel > 0 && (
              <span className="bg-orange-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                <Flame size={10} />
                <span>{t('spicy')} Lvl {product.spicyLevel}</span>
              </span>
            )}
          </div>

          {/* Wishlist Heart Icon (Top Right) */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center shadow-xs cursor-pointer rtl:right-auto rtl:left-2 ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                : 'bg-white/90 hover:bg-white border-slate-200/70 text-slate-400 hover:text-rose-500'
            }`}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick View Hover Button (Bottom Right) */}
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 text-[#0E2A5A] hover:bg-[#0E2A5A] hover:text-white border border-slate-200/80 shadow-xs flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 rtl:right-auto rtl:left-2 cursor-pointer"
            title={t('quickView')}
            aria-label={t('quickView')}
          >
            <Eye size={15} />
          </button>

          {/* Lazy Loaded Product Image */}
          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="max-h-36 sm:max-h-38 max-w-full object-contain transition-transform duration-300 group-hover:scale-106"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-24 h-24">
                <ProductGraphic type={product.svgType} />
              </div>
            )}
          </Link>
        </div>

        {/* Origin & Rating Row */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 px-0.5">
          <span className="font-medium truncate max-w-[55%]">{product.origin}</span>
          {product.rating ? (
            <div className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
              <Star size={11} fill="currentColor" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[10px]">
                ({product.reviewsCount || 42})
              </span>
            </div>
          ) : null}
        </div>

        {/* Product Title Link */}
        <Link to={`/product/${product.id}`} className="no-underline block group/title">
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-1 min-h-[2.4rem] sm:min-h-[2.6rem] group-hover/title:text-[#0E2A5A] transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-[11px] sm:text-xs text-slate-500 font-medium mb-2.5 px-0.5">
          ⚖️ {product.weight}
        </p>
      </div>

      {/* Price & Action Section: Guaranteed Never-Overflow Structure */}
      <div className="pt-2.5 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between gap-1">
          {/* Price Container */}
          <div className="flex flex-col shrink min-w-0 pr-0.5 rtl:pr-0 rtl:pl-0.5">
            <div className="flex items-baseline gap-0.5 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-black text-[#0E2A5A] tracking-tight leading-tight">
                {product.price.toFixed(2)}
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#0E2A5A]">
                AED
              </span>
            </div>
            {product.originalPrice ? (
              <div className="flex items-baseline gap-0.5 whitespace-nowrap text-slate-400 line-through text-[9px] sm:text-[10px] font-semibold leading-none">
                <span>{product.originalPrice.toFixed(2)}</span>
                <span className="text-[8px] font-normal">AED</span>
              </div>
            ) : (
              <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold leading-none">
                In Stock
              </span>
            )}
          </div>

          {/* Action Buttons: ONLY WhatsApp icon + Add to Cart button */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto rtl:ml-0 rtl:mr-auto">
            {/* WhatsApp Quick Order Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-colors border border-emerald-200/80 shadow-2xs flex items-center justify-center shrink-0"
              title="Order via WhatsApp"
              aria-label="Order via WhatsApp"
            >
              <MessageCircle size={13} className="sm:w-[14px] sm:h-[14px]" />
            </a>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs text-white transition-all duration-200 shadow-xs active:scale-95 cursor-pointer select-none shrink-0 whitespace-nowrap bg-[#0E2A5A] hover:bg-[#5A3418]"
              title={t('add')}
              aria-label={t('add')}
            >
              <Plus size={12} className="sm:w-[13px] sm:h-[13px]" />
              <span>{t('add')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
