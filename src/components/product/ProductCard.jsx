import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import { ProductGraphic } from './ProductGraphic';
import { Plus, Eye, Star, Flame, ShieldCheck, MessageCircle, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';

export const ProductCard = memo(function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const title = getProductTitle(product, lang);
  const imageUrl = getProductImage(product.image);

  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // WhatsApp quick order link (+971561549027)
  const whatsappUrl = getProductWhatsAppUrl(product, 1);

  const toggleWishlist = useCallback((e) => {
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  }, []);

  return (
    <div className="ds-card group flex flex-col justify-between h-full bg-white border border-[#ECECEC] rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border-[#0E2A5A]/30">
      <div>
        {/* Product Image Container */}
        <div className="bg-[#F7F7F7] rounded-xl h-48 flex items-center justify-center relative p-3 mb-3.5 overflow-hidden">
          
          {/* Discount & Feature Badges (Top Left) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 rtl:left-auto rtl:right-2">
            {discountPercent ? (
              <span className="bg-[#5A3418] text-amber-300 text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase shadow-md">
                {discountPercent}% OFF
              </span>
            ) : null}
            {product.isBestseller && !discountPercent && (
              <span className="bg-[#0E2A5A] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase shadow-md">
                🔥 {t('bestseller')}
              </span>
            )}
            {product.isHalal && (
              <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase shadow-md flex items-center gap-1">
                <ShieldCheck size={10} />
                <span>{t('halal')}</span>
              </span>
            )}
            {product.spicyLevel > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md flex items-center gap-0.5">
                <Flame size={10} />
                <span>{t('spicy')} Lvl {product.spicyLevel}</span>
              </span>
            )}
          </div>

          {/* Wishlist Heart Icon (Top Right) */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
              isWishlisted
                ? 'bg-red-50 text-red-600 border border-red-200 scale-110'
                : 'bg-white/80 hover:bg-white text-slate-400 hover:text-red-500'
            }`}
            aria-label="Toggle Wishlist"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick View Hover Button (Bottom Right) */}
          <button
            type="button"
            onClick={() => onQuickView && onQuickView(product)}
            className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 hover:bg-[#0E2A5A] hover:text-white text-[#0E2A5A] p-2 rounded-full shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
            title="Quick View"
          >
            <Eye size={15} />
          </button>

          {/* Lazy Loaded Product Image Link */}
          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="max-h-40 max-w-full object-contain transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-28 h-28">
                <ProductGraphic type={product.svgType} />
              </div>
            )}
          </Link>
        </div>

        {/* Rating & Origin */}
        <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1.5">
          <span className="font-medium text-slate-500">{product.origin}</span>
          {product.rating && (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={12} fill="currentColor" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount || 42})</span>
            </div>
          )}
        </div>

        {/* Product Title Link */}
        <Link to={`/product/${product.id}`} className="no-underline block">
          <h3 className="font-extrabold text-[#222222] text-sm leading-snug line-clamp-2 mb-1.5 min-h-[2.5rem] group-hover:text-[#0E2A5A] transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 font-medium mb-3">⚖️ {product.weight}</p>
      </div>

      {/* Price & Actions: Price, Old Price, WhatsApp, Add to Cart */}
      <div className="pt-3 border-t border-dashed border-[#ECECEC] flex flex-wrap sm:flex-nowrap items-end sm:items-center justify-between mt-auto gap-2">
        <div className="shrink-0">
          <span className="text-sm sm:text-base font-black text-[#0E2A5A] block leading-none">
            {product.price.toFixed(2)} AED
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-slate-400 line-through font-semibold">
              {product.originalPrice.toFixed(2)} AED
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* WhatsApp Quick Order Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-colors border border-emerald-200 shadow-sm"
            title="Order via WhatsApp"
          >
            <MessageCircle size={14} className="sm:w-[15px] sm:h-[15px]" />
          </a>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => addToCart(product, 1)}
            className="bg-[#0E2A5A] hover:bg-[#5A3418] text-white rounded-xl shadow-md transition-all active:scale-95 px-2.5 sm:px-3 py-1.5"
          >
            <Plus size={14} className="sm:w-[15px] sm:h-[15px]" />
            <span className="font-extrabold text-xs">{t('add')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});
