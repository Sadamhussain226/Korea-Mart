import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import { ProductGraphic } from '../product/ProductGraphic';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../../utils/whatsapp';

export function CartDrawer() {
  const { lang, t, isRtl } = useLanguage();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    grandTotal,
    remainingForFreeShipping,
    freeShippingProgress,
    setIsCheckoutOpen,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  // Format WhatsApp Message for whole cart (+971561549027)
  const whatsappCartUrl = getWhatsAppOrderUrl({
    items: cartItems,
    subtotal,
    deliveryFee,
    grandTotal
  });

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: isRtl ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRtl ? '-100%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#ECECEC] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E2A5A]/10 text-[#0E2A5A] flex items-center justify-center font-black">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-black text-base text-[#0E2A5A]">
                {t('yourCart')} ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
              <span className="text-[11px] font-bold text-slate-500 block">Abu Dhabi Express Shipping</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F7F7F7] hover:bg-[#0E2A5A] hover:text-white text-slate-500 flex items-center justify-center transition-colors border border-[#ECECEC]"
            title="Close Cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Delivery Shipping Tracker Box */}
        <div className="bg-[#F7F7F7] border-b border-[#ECECEC] p-4">
          <div className="flex items-center justify-between text-xs font-black text-[#0E2A5A] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck size={15} className="text-[#5A3418]" />
              <span>
                {remainingForFreeShipping === 0
                  ? '🎉 Eligible for FREE Abu Dhabi Delivery!'
                  : `Add ${remainingForFreeShipping.toFixed(2)} AED more for FREE Delivery`}
              </span>
            </span>
            <span className="text-[#5A3418]">{freeShippingProgress.toFixed(0)}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5A3418] to-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-20 h-20 bg-[#F7F7F7] rounded-full border border-[#ECECEC] flex items-center justify-center mx-auto text-4xl">
                🛒
              </div>
              <h4 className="font-black text-lg text-[#0E2A5A]">{t('cartEmpty')}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your shopping bag is empty. Explore our authentic Korean ramyun, meats, and kimchi!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-[#0E2A5A] text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md hover:bg-[#5A3418] transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const title = getProductTitle(item.product, lang);
              const imgUrl = getProductImage(item.product.image);

              return (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-[#F7F7F7] border border-[#ECECEC] rounded-2xl transition-all hover:border-[#0E2A5A]/30 shadow-sm"
                >
                  {/* Image Box */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#ECECEC] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {imgUrl ? (
                      <img src={imgUrl} alt={title} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ProductGraphic type={item.product.svgType} />
                    )}
                  </div>

                  {/* Info & Quantity Controls */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-[#222222] line-clamp-1 leading-snug">
                      {title}
                    </h4>
                    <span className="text-xs font-black text-[#0E2A5A] block my-1">
                      {item.product.price.toFixed(2)} AED
                    </span>

                    {/* Qty +/- Buttons */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-[#ECECEC] rounded-lg p-0.5 shadow-inner">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-[#0E2A5A] hover:text-white text-[#0E2A5A] flex items-center justify-center font-bold text-xs transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center font-extrabold text-xs text-[#0E2A5A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-[#0E2A5A] hover:text-white text-[#0E2A5A] flex items-center justify-center font-bold text-xs transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-[11px] font-bold text-slate-400">
                        = {(item.product.price * item.quantity).toFixed(2)} AED
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Totals Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#ECECEC] bg-white space-y-4">
            
            {/* Totals */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between text-[#666666]">
                <span>{t('subtotal')}</span>
                <span className="font-extrabold text-[#0E2A5A]">{subtotal.toFixed(2)} AED</span>
              </div>

              <div className="flex items-center justify-between text-[#666666]">
                <span>Delivery (Abu Dhabi)</span>
                <span className="font-extrabold text-emerald-700">
                  {deliveryFee === 0 ? 'FREE' : `${deliveryFee.toFixed(2)} AED`}
                </span>
              </div>

              <div className="pt-2 border-t border-dashed border-[#ECECEC] flex items-center justify-between text-base font-black text-[#0E2A5A]">
                <span>Grand Total</span>
                <span className="text-[#0E2A5A] text-lg">{grandTotal.toFixed(2)} AED</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-[#0E2A5A] hover:bg-[#0A1E42] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t('proceedCheckout')}</span>
                <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </button>

              {/* WhatsApp Checkout Option */}
              <a
                href={whatsappCartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 no-underline"
              >
                <MessageCircle size={16} />
                <span>Order Cart via WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>Cash / Card On Delivery Accepted</span>
            </div>

          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
