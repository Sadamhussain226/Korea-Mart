import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { SEOMeta } from '../../components/common/SEOMeta';
import { ProductCard } from '../../components/product/ProductCard';
import { MobileCardCarousel } from '../../components/ui/MobileCardCarousel';
import { ProductModal } from '../../components/product/ProductModal';
import { products } from '../../data/products';
import { getProductImage } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import {
  ShoppingBag,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  Truck,
  Banknote,
  Star,
  Flame,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  Zap,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LayoutContainer } from '../../components/layout/LayoutContainer';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Find product by ID
  const product = useMemo(() => {
    return products.find((p) => p.id === id) || products[0];
  }, [id]);

  const title = getProductTitle(product, lang);

  const mainImageUrl = getProductImage(product.image);

  // Gallery thumbnails array (main image + alternative angles if available)
  const galleryImages = [mainImageUrl, mainImageUrl, mainImageUrl].filter(Boolean);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // WhatsApp Quick Order link (+971561549027)
  const whatsappUrl = getProductWhatsAppUrl(product, qty);

  // Buy Now Handler
  const handleBuyNow = () => {
    addToCart(product, qty);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Image Hover Zoom Effect Handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Related products from same category (guaranteed 4 relevant items)
  const relatedProducts = useMemo(() => {
    let sameCat = products.filter((p) => p.category === product.category && p.id !== product.id);
    if (sameCat.length < 4) {
      const remaining = products.filter((p) => p.id !== product.id && !sameCat.some((sc) => sc.id === p.id));
      sameCat = [...sameCat, ...remaining];
    }
    return sameCat.slice(0, 4);
  }, [product]);

  return (
    <div className="bg-[#F7F7F7] min-h-screen py-8">
      <SEOMeta title={`${title} | Korea Mart UAE Abu Dhabi`} />

      <LayoutContainer className="space-y-8">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-[#0E2A5A] hover:bg-[#5A3418] px-4.5 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer border-0"
              title="Return to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0E2A5A] bg-white hover:bg-slate-100 px-4 py-2.5 rounded-full border border-[#ECECEC] shadow-sm transition-all active:scale-95 no-underline"
              title="Go to Home"
            >
              <Home size={15} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          <div className="text-xs font-semibold text-[#666666] hidden sm:block">
            <Link to="/" className="hover:text-[#0E2A5A] no-underline text-[#666666]">Home</Link> / <Link to="/products" className="hover:text-[#0E2A5A] no-underline text-[#666666]">{product.category.toUpperCase()}</Link> / <span className="text-[#0E2A5A] font-bold">{product.name}</span>
          </div>
        </div>

        {/* Product Detail Card Container */}
        <div className="bg-white border border-[#ECECEC] rounded-3xl p-6 lg:p-10 shadow-lg grid lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Large Image Gallery with Hover Zoom */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Box */}
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative w-full h-[360px] sm:h-[440px] bg-[#F7F7F7] rounded-2xl border border-[#ECECEC] p-6 flex items-center justify-center overflow-hidden cursor-crosshair group"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                {discountPercent && (
                  <span className="bg-[#5A3418] text-amber-300 text-xs font-black px-3 py-1 rounded-md uppercase shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isHalal && (
                  <span className="bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-md uppercase shadow-md flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>100% Halal</span>
                  </span>
                )}
                {product.spicyLevel > 0 && (
                  <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Flame size={12} />
                    <span>Spicy Lvl {product.spicyLevel}</span>
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isWishlisted ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white/80 hover:bg-white text-slate-400 hover:text-red-500'
                }`}
                title="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>

              {/* Main Image */}
              {galleryImages[activeImgIndex] ? (
                <img
                  src={galleryImages[activeImgIndex]}
                  alt={title}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          transform: 'scale(1.8)'
                        }
                      : { transform: 'scale(1)' }
                  }
                  className="max-h-[360px] max-w-full object-contain transition-transform duration-200 ease-out"
                />
              ) : (
                <div className="text-6xl">🏬</div>
              )}

              {/* Zoom Instruction Tag */}
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Hover to Zoom Image
              </span>
            </div>

            {/* Gallery Thumbnail Selector */}
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-[#F7F7F7] border-2 p-2 flex items-center justify-center overflow-hidden transition-all ${
                    activeImgIndex === idx ? 'border-[#0E2A5A] shadow-md scale-105' : 'border-[#ECECEC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#5A3418] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {product.origin} • {product.category.toUpperCase()}
                </span>

                {product.rating && (
                  <div className="flex items-center gap-1.5 text-amber-500 font-extrabold">
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount || 142} reviews)</span>
                  </div>
                )}
              </div>

              {/* Main Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#0E2A5A] leading-tight">
                {title}
              </h1>

              {/* Weight */}
              <p className="text-xs text-slate-500 font-bold">
                ⚖️ Net Weight / Size: <span className="text-[#222222] font-black">{product.weight}</span>
              </p>

              {/* Price Box */}
              <div className="bg-[#F7F7F7] p-4 rounded-2xl border border-[#ECECEC] flex items-center justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0E2A5A]">
                    {(product.price * qty).toFixed(2)} AED
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-semibold ml-3">
                      {(product.originalPrice * qty).toFixed(2)} AED
                    </span>
                  )}
                </div>

                {discountPercent && (
                  <span className="bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-full border border-red-200">
                    Save {( (product.originalPrice - product.price) * qty ).toFixed(2)} AED
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-medium">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-black text-[#0E2A5A] uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center bg-[#F7F7F7] border border-[#ECECEC] rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-[#0E2A5A] flex items-center justify-center font-bold shadow-sm hover:bg-[#0E2A5A] hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-[#0E2A5A]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-[#0E2A5A] flex items-center justify-center font-bold shadow-sm hover:bg-[#0E2A5A] hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* 3 Action Buttons: Add to Cart | Buy Now | WhatsApp Order */}
              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product, qty)}
                    className="w-full bg-[#0E2A5A] hover:bg-[#0A1E42] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span>Add To Cart</span>
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-[#5A3418] hover:bg-[#432611] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Zap size={16} className="text-amber-400 fill-current" />
                    <span>Buy Now (Express)</span>
                  </button>
                </div>

                {/* Direct WhatsApp Order Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 no-underline"
                >
                  <MessageCircle size={18} />
                  <span>Order Directly via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-[#ECECEC] grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#666666]">
              <div className="flex flex-col items-center">
                <Truck size={18} className="text-[#0E2A5A] mb-1" />
                <span>Next-Day Abu Dhabi</span>
              </div>
              <div className="flex flex-col items-center">
                <Banknote size={18} className="text-[#5A3418] mb-1" />
                <span>Cash On Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck size={18} className="text-emerald-600 mb-1" />
                <span>100% Guaranteed Fresh</span>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="pt-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#ECECEC]">
              <div>
                <span className="text-xs font-black text-[#5A3418] uppercase tracking-widest block mb-0.5">
                  You Might Also Like
                </span>
                <h2 className="text-2xl font-black text-[#0E2A5A]">
                  Related Products
                </h2>
              </div>
            </div>

            {/* Mobile 1-by-1 Touch Swipe Carousel */}
            <MobileCardCarousel
              items={relatedProducts}
              renderItem={(relProduct) => (
                <ProductCard
                  product={relProduct}
                  onQuickView={setQuickViewProduct}
                />
              )}
            />

            {/* Desktop Grid Layout */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="flex">
                  <ProductCard
                    product={relProduct}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </LayoutContainer>

      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
