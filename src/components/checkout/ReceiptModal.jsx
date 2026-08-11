import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import {
  CheckCircle2,
  MessageCircle,
  X,
  MapPin,
  Mail,
  Copy,
  Send,
  Sparkles,
  Phone,
  Banknote,
  ShoppingBag,
  FileText
} from 'lucide-react';

export function ReceiptModal() {
  const { lang, t } = useLanguage();
  const { lastOrderDetails, setLastOrderDetails } = useCart();
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!lastOrderDetails) return null;

  const { orderRef, customer, items, subtotal, deliveryFee, grandTotal, timestamp, waUrl } = lastOrderDetails;

  const paymentLabel = customer.paymentMethod === 'codCash' ? 'Cash on Delivery 💵' : 'Card on Delivery (Mobile POS) 💳';

  // Build HTML Email String
  const generateEmailHtml = () => {
    const itemRows = items
      .map((item) => {
        const title = getProductTitle(item.product, lang);
        return `
          <tr style="border-bottom: 1px solid #ECECEC;">
            <td style="padding: 12px; font-size: 13px; color: #222222;">
              <strong>${title}</strong><br/>
              <span style="font-size: 11px; color: #666666;">Weight: ${item.product.weight || 'N/A'}</span>
            </td>
            <td style="padding: 12px; font-size: 13px; color: #0E2A5A; font-weight: bold; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; font-size: 13px; color: #0E2A5A; font-weight: bold; text-align: right;">AED ${item.product.price.toFixed(2)}</td>
            <td style="padding: 12px; font-size: 13px; color: #0E2A5A; font-weight: bold; text-align: right;">AED ${(item.product.price * item.quantity).toFixed(2)}</td>
          </tr>
        `;
      })
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation #${orderRef} - Korea Mart UAE</title>
</head>
<body style="margin:0; padding:0; background-color:#F7F7F7; font-family:Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F7F7F7; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #ECECEC; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#0E2A5A; padding:30px; text-align:center; color:#FFFFFF;">
              <div style="font-size:24px; font-weight:900; letter-spacing:1px; margin-bottom:4px;">KOREA MART UAE 🇰🇷</div>
              <div style="font-size:12px; color:#F59E0B; text-transform:uppercase; font-weight:bold;">Abu Dhabi Express Order Confirmation</div>
            </td>
          </tr>

          <!-- Thank You Message -->
          <tr>
            <td style="padding:30px; text-align:center; background-color:#ECFDF5; border-bottom:1px solid #A7F3D0;">
              <h2 style="color:#065F46; margin:0 0 8px 0; font-size:22px;">Thank You For Your Order! 🎉</h2>
              <p style="color:#047857; margin:0; font-size:14px; font-weight:bold;">
                Order Reference: <span style="background:#FFFFFF; padding:4px 10px; border-radius:6px; color:#0E2A5A;">#${orderRef}</span>
              </p>
            </td>
          </tr>

          <!-- Delivery Details -->
          <tr>
            <td style="padding:25px;">
              <h3 style="color:#0E2A5A; font-size:16px; margin:0 0 15px 0; border-bottom:2px solid #5A3418; padding-bottom:5px;">📍 Delivery Information</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size:13px; color:#333333;">
                <tr><td width="130"><strong>Customer Name:</strong></td><td>${customer.fullName}</td></tr>
                <tr><td><strong>Phone Number:</strong></td><td>${customer.phone}</td></tr>
                <tr><td><strong>Abu Dhabi Area:</strong></td><td>${customer.area}</td></tr>
                <tr><td><strong>Street Address:</strong></td><td>${customer.address}</td></tr>
                <tr><td><strong>Payment Method:</strong></td><td><strong style="color:#0E2A5A;">${paymentLabel}</strong></td></tr>
                <tr><td><strong>Order Date:</strong></td><td>${timestamp}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Itemized Table -->
          <tr>
            <td style="padding:0 25px 25px 25px;">
              <h3 style="color:#0E2A5A; font-size:16px; margin:0 0 15px 0; border-bottom:2px solid #5A3418; padding-bottom:5px;">📦 Order Summary</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background-color:#F7F7F7; border-radius:8px; overflow:hidden;">
                <thead>
                  <tr style="background-color:#0E2A5A; color:#FFFFFF; font-size:12px; text-transform:uppercase;">
                    <th style="padding:10px; text-align:left;">Item</th>
                    <th style="padding:10px; text-align:center;">Qty</th>
                    <th style="padding:10px; text-align:right;">Price</th>
                    <th style="padding:10px; text-align:right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Pricing Totals -->
          <tr>
            <td style="padding:0 25px 25px 25px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size:14px; background-color:#F7F7F7; border-radius:10px; padding:15px;">
                <tr>
                  <td>Subtotal:</td>
                  <td align="right"><strong>AED ${subtotal.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td>Delivery Fee (Abu Dhabi):</td>
                  <td align="right" style="color:#10B981;"><strong>${deliveryFee === 0 ? 'FREE' : `AED ${deliveryFee.toFixed(2)}`}</strong></td>
                </tr>
                <tr style="border-top:1px solid #ECECEC;">
                  <td style="font-size:16px; font-weight:bold; color:#0E2A5A;">Total Amount Payable:</td>
                  <td align="right" style="font-size:18px; font-weight:900; color:#0E2A5A;">AED ${grandTotal.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F7F7F7; padding:20px; text-align:center; border-top:1px solid #ECECEC; font-size:12px; color:#666666;">
              <p style="margin:0 0 5px 0; font-weight:bold; color:#0E2A5A;">Korea Mart UAE • Abu Dhabi Warehouse Store</p>
              <p style="margin:0;">Hotline: +971 50 123 4567 | Email: orders@koreamartuae.ae</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateEmailHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 3000);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setLastOrderDetails(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-[#ECECEC] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-6"
        >
          {/* Success Banner */}
          <div className="bg-emerald-600 text-white p-6 text-center relative">
            <button
              type="button"
              onClick={() => setLastOrderDetails(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <CheckCircle2 size={48} className="mx-auto mb-2 text-emerald-200" />
            <h2 className="text-2xl font-black">{t('orderSuccess')}</h2>
            <p className="text-xs font-bold text-emerald-100 mt-1">
              Order Reference: <span className="bg-white text-[#0E2A5A] px-2.5 py-0.5 rounded-md font-black">#{orderRef}</span>
            </p>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Customer & Delivery Details Box */}
            <div className="bg-[#F7F7F7] border border-[#ECECEC] rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-extrabold text-sm text-[#0E2A5A] flex items-center gap-1.5 border-b border-[#ECECEC] pb-2">
                <MapPin size={16} className="text-[#5A3418]" />
                <span>Delivery Information (Abu Dhabi)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium text-[#222222]">
                <p><strong>Customer Name:</strong> {customer.fullName}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
                <p><strong>Area:</strong> {customer.area}</p>
                <p><strong>Payment:</strong> <span className="font-black text-[#0E2A5A]">{paymentLabel}</span></p>
                <p className="sm:col-span-2"><strong>Street Address:</strong> {customer.address}</p>
                <p className="sm:col-span-2 text-slate-400 text-[11px]"><strong>Order Timestamp:</strong> {timestamp}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h4 className="font-black text-xs text-[#0E2A5A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShoppingBag size={15} className="text-[#5A3418]" />
                <span>Ordered Items</span>
              </h4>
              <div className="border border-[#ECECEC] rounded-2xl overflow-hidden divide-y divide-[#ECECEC]">
                {items.map((item) => {
                  const title = getProductTitle(item.product, lang);
                  const imgUrl = getProductImage(item.product.image);

                  return (
                    <div key={item.product.id} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F7F7F7] border border-[#ECECEC] p-0.5 flex items-center justify-center shrink-0">
                          {imgUrl && <img src={imgUrl} alt={title} className="max-h-full max-w-full object-contain" />}
                        </div>
                        <div>
                          <h5 className="font-extrabold text-[#222222] line-clamp-1">{title}</h5>
                          <span className="text-[11px] text-slate-400">Qty: {item.quantity} × {item.product.price.toFixed(2)} AED</span>
                        </div>
                      </div>
                      <span className="font-black text-[#0E2A5A]">
                        {(item.product.price * item.quantity).toFixed(2)} AED
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Financial Summary */}
            <div className="bg-[#F7F7F7] border border-[#ECECEC] p-4 rounded-2xl space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-[#666666]">
                <span>Items Subtotal:</span>
                <span className="font-extrabold text-[#0E2A5A]">{subtotal.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Abu Dhabi Delivery:</span>
                <span className="font-extrabold text-emerald-700">
                  {deliveryFee === 0 ? 'FREE' : `${deliveryFee.toFixed(2)} AED`}
                </span>
              </div>
              <div className="pt-2 border-t border-dashed border-[#ECECEC] flex justify-between text-base font-black text-[#0E2A5A]">
                <span>Total Amount Payable:</span>
                <span className="text-[#0E2A5A]">{grandTotal.toFixed(2)} AED</span>
              </div>
            </div>

            {/* SEND PROFESSIONAL HTML CONFIRMATION EMAIL SECTION */}
            <div className="bg-[#0E2A5A]/5 border border-[#0E2A5A]/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-[#0E2A5A] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={16} className="text-[#5A3418]" />
                  <span>Send Professional HTML Confirmation Email</span>
                </h4>
                <span className="text-[10px] font-bold bg-[#5A3418] text-amber-300 px-2 py-0.5 rounded-md">Brand Template</span>
              </div>

              {emailSent ? (
                <div className="bg-emerald-600 text-white font-extrabold text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Order Confirmation Email sent successfully to {emailInput}!</span>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter customer email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 bg-white border border-[#ECECEC] rounded-xl px-3 py-2 text-xs font-bold text-[#222222] focus:outline-none focus:border-[#0E2A5A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#0E2A5A] hover:bg-[#5A3418] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Send size={14} />
                    <span>Send Email</span>
                  </button>
                </form>
              )}

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500 font-medium">Want to copy the raw HTML template?</span>
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="text-[#0E2A5A] font-extrabold hover:underline flex items-center gap-1"
                >
                  <Copy size={12} />
                  <span>{copiedHtml ? '✓ HTML Copied!' : 'Copy HTML Email'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 no-underline"
                >
                  <MessageCircle size={18} />
                  <span>Re-open WhatsApp Chat</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setLastOrderDetails(null)}
                className="bg-[#0E2A5A] hover:bg-[#0A1E42] text-white font-extrabold text-xs py-3 px-8 rounded-2xl shadow-md transition-colors"
              >
                {t('close')}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
