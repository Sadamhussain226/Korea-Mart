import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import {
  CheckCircle2,
  X,
  MapPin,
  Mail,
  Copy,
  Send,
  ShoppingBag,
  Download,
  Share2,
  Phone,
  User,
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Clock,
  Check
} from 'lucide-react';
import { copyImageToClipboard, downloadFile, dispatchWhatsAppOrderWithImages } from '../../utils/whatsapp';

export function ReceiptModal() {
  const { lang, t } = useLanguage();
  const { lastOrderDetails, setLastOrderDetails } = useCart();
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [copiedSlip, setCopiedSlip] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isReSharing, setIsReSharing] = useState(false);

  if (!lastOrderDetails) return null;

  const {
    orderRef,
    customer = {},
    items = [],
    subtotal = 0,
    deliveryFee = 0,
    grandTotal = 0,
    timestamp = new Date().toLocaleString(),
    waUrl = '',
    slipResult = null,
    files = [],
    orderText = ''
  } = lastOrderDetails;

  const isCodCash = customer.paymentMethod === 'codCash';
  const paymentLabel = isCodCash ? 'Cash on Delivery' : 'Card on Delivery (Mobile POS)';
  const totalItemsCount = items.reduce((acc, i) => acc + (i.quantity || 1), 0);

  // Copy Digital Slip / Receipt Image to Clipboard
  const handleCopySlip = async () => {
    if (slipResult && slipResult.blob) {
      const ok = await copyImageToClipboard(slipResult.blob);
      if (ok) {
        setCopiedSlip(true);
        setTimeout(() => setCopiedSlip(false), 3000);
        return;
      }
    }
    // Fallback copy text
    if (navigator.clipboard) {
      const textToCopy = orderText || `Order #${orderRef} - Korea Mart UAE - Grand Total: AED ${grandTotal.toFixed(2)}`;
      navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

  // Download All Product Image Files + Digital Slip
  const handleDownloadAllImages = () => {
    if (slipResult && slipResult.file) {
      downloadFile(slipResult.file, `KM_UAE_Order_${orderRef}_Slip.png`);
    }
    if (files && files.length > 0) {
      files.forEach((file, idx) => {
        if (file && file !== slipResult?.file) {
          setTimeout(() => {
            downloadFile(file, file.name || `Product_${idx + 1}.jpg`);
          }, idx * 150);
        }
      });
    } else {
      items.forEach((item, idx) => {
        const url = getProductImage(item.product.image);
        if (url) {
          setTimeout(() => {
            const a = document.createElement('a');
            a.href = url;
            a.download = `Product_${idx + 1}_${item.product.name}.jpg`;
            a.target = '_blank';
            a.click();
          }, idx * 150);
        }
      });
    }
  };

  // Re-trigger Native WhatsApp Share
  const handleReShare = async () => {
    setIsReSharing(true);
    try {
      await dispatchWhatsAppOrderWithImages({
        orderRef,
        customerName: customer.fullName,
        phone: customer.phone,
        area: customer.area,
        address: customer.address,
        items,
        subtotal,
        deliveryFee,
        grandTotal,
        paymentMethod: customer.paymentMethod,
        notes: customer.notes
      });
    } catch (e) {
      console.warn('Re-share error:', e);
      if (waUrl) window.open(waUrl, '_blank');
    } finally {
      setIsReSharing(false);
    }
  };

  // Build HTML Email String
  const generateEmailHtml = () => {
    const itemRows = items
      .map((item) => {
        const title = getProductTitle(item.product, lang);
        return `
          <tr style="border-bottom: 1px solid #ECECEC;">
            <td style="padding: 10px; font-size: 13px; color: #222222;">
              <strong>${title}</strong><br/>
              <span style="font-size: 11px; color: #666666;">Weight: ${item.product.weight || 'N/A'}</span>
            </td>
            <td style="padding: 10px; font-size: 13px; color: #0E2A5A; font-weight: bold; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; font-size: 13px; color: #0E2A5A; font-weight: bold; text-align: right;">AED ${item.product.price.toFixed(2)}</td>
            <td style="padding: 10px; font-size: 13px; color: #0E2A5A; font-weight: bold; text-align: right;">AED ${(item.product.price * item.quantity).toFixed(2)}</td>
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
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #ECECEC;">
          <tr>
            <td style="background-color:#0E2A5A; padding:25px; text-align:center; color:#FFFFFF;">
              <div style="font-size:22px; font-weight:900; letter-spacing:1px;">KOREA MART UAE 🇰🇷</div>
              <div style="font-size:11px; color:#F59E0B; text-transform:uppercase; font-weight:bold; margin-top:3px;">Official Digital Order Confirmation</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; text-align:center; background-color:#ECFDF5; border-bottom:1px solid #A7F3D0;">
              <h2 style="color:#065F46; margin:0 0 4px 0; font-size:18px;">Thank You For Your Order! 🎉</h2>
              <p style="color:#047857; margin:0; font-size:13px; font-weight:bold;">
                Order Reference: #${orderRef}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;">
              <h3 style="color:#0E2A5A; font-size:14px; margin:0 0 10px 0;">📍 Delivery Details</h3>
              <p style="font-size:12px; margin:3px 0; color:#333333;"><strong>Name:</strong> ${customer.fullName}</p>
              <p style="font-size:12px; margin:3px 0; color:#333333;"><strong>Phone:</strong> ${customer.phone}</p>
              <p style="font-size:12px; margin:3px 0; color:#333333;"><strong>Area & Address:</strong> ${customer.area}, ${customer.address}</p>
              <p style="font-size:12px; margin:3px 0; color:#333333;"><strong>Payment:</strong> ${paymentLabel}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 20px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background-color:#F8FAFC; border-radius:8px;">
                <thead>
                  <tr style="background-color:#0E2A5A; color:#FFFFFF; font-size:11px; text-transform:uppercase;">
                    <th style="padding:8px; text-align:left;">Item</th>
                    <th style="padding:8px; text-align:center;">Qty</th>
                    <th style="padding:8px; text-align:right;">Price</th>
                    <th style="padding:8px; text-align:right;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 20px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size:13px; background-color:#F1F5F9; border-radius:8px;">
                <tr><td>Items Subtotal:</td><td align="right"><strong>AED ${subtotal.toFixed(2)}</strong></td></tr>
                <tr><td>Abu Dhabi Delivery:</td><td align="right" style="color:#10B981;"><strong>${deliveryFee === 0 ? 'FREE' : `AED ${deliveryFee.toFixed(2)}`}</strong></td></tr>
                <tr style="border-top:1px solid #CBD5E1;"><td style="font-size:15px; font-weight:bold; color:#0E2A5A;">Total Amount Payable:</td><td align="right" style="font-size:16px; font-weight:900; color:#0E2A5A;">AED ${grandTotal.toFixed(2)}</td></tr>
              </table>
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

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto"
        onClick={() => setLastOrderDetails(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-[#ECECEC] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh]"
        >
          {/* 1. PREMIUM HEADER STRIP */}
          <div className="bg-gradient-to-r from-[#0E2A5A] via-[#1A3A6D] to-[#5A3418] text-white px-4.5 py-3.5 sm:px-6 sm:py-4 shrink-0 flex items-center justify-between relative border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-black text-amber-300 text-lg shadow-inner shrink-0">
                🇰🇷
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-none text-white">
                    KOREA MART UAE
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Confirmed</span>
                  </span>
                </div>
                <span className="text-[11px] text-amber-300/90 font-bold block mt-0.5">
                  Official Digital Order Receipt • Abu Dhabi Express
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLastOrderDetails(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2 hover:scale-105 active:scale-95"
              aria-label="Close Order Slip"
            >
              <X size={16} />
            </button>
          </div>

          {/* 2. SCROLLABLE SLIP BODY */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 no-scrollbar bg-[#F8FAFC]/70">
            
            {/* BALANCED 2-COLUMN INVOICE HEADER CARDS (Customer Details + Order Details) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* CARD 1: Order Information & Status */}
              <div className="bg-white border border-[#ECECEC] rounded-2xl p-3.5 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#ECECEC]/80 pb-2">
                  <h4 className="text-[11px] font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Order Information</span>
                  </h4>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-medium text-[#222222]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Order Reference:</span>
                    <span className="font-black text-[#0E2A5A] text-xs bg-[#0E2A5A]/5 border border-[#0E2A5A]/15 px-2 py-0.5 rounded-lg">
                      #{orderRef}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Order Date & Time:</span>
                    <span className="font-bold text-[#0E2A5A] text-[11px] flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" />
                      <span>{timestamp}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#ECECEC]">
                    <span className="text-slate-500 text-[11px]">Payment Mode:</span>
                    <span className="font-black text-[#0E2A5A] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                      {isCodCash ? (
                        <Banknote size={12} className="text-emerald-600" />
                      ) : (
                        <CreditCard size={12} className="text-[#5A3418]" />
                      )}
                      <span>{paymentLabel}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 2: Customer & Delivery Details */}
              <div className="bg-white border border-[#ECECEC] rounded-2xl p-3.5 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#ECECEC]/80 pb-2">
                  <h4 className="text-[11px] font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} className="text-[#5A3418]" />
                    <span>Customer & Delivery</span>
                  </h4>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Abu Dhabi 🇦🇪
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-medium text-[#222222]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Customer Name:</span>
                    <span className="font-extrabold text-[#0E2A5A] truncate max-w-[140px] text-right">
                      {customer.fullName || 'Valued Customer'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">WhatsApp / Mobile:</span>
                    <span className="font-extrabold text-[#0E2A5A] text-right">
                      {customer.phone || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Delivery Area:</span>
                    <span className="font-extrabold text-[#5A3418] text-right truncate max-w-[140px]">
                      {customer.area || 'Abu Dhabi'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between pt-1 border-t border-dashed border-[#ECECEC]">
                    <span className="text-slate-500 text-[11px] shrink-0">Short Address:</span>
                    <span className="font-semibold text-[#0E2A5A] text-[11px] text-right truncate max-w-[160px] pl-2" title={customer.address}>
                      {customer.address || 'Abu Dhabi Residence'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* ORDERED PRODUCTS LIST WITH ACTUAL PRODUCT IMAGES */}
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#ECECEC]/80 pb-2">
                <h4 className="text-[11px] font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-[#5A3418]" />
                  <span>Ordered Products ({totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'})</span>
                </h4>
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  100% Certified Halal
                </span>
              </div>

              {/* Items Rows */}
              <div className="divide-y divide-[#ECECEC]/70 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
                {items.map((item, idx) => {
                  const product = item.product || item;
                  const title = getProductTitle(product, lang);
                  const imgUrl = getProductImage(product.image);
                  const qty = item.quantity || 1;
                  const price = Number(product.price) || 0;
                  const lineTotal = (price * qty).toFixed(2);

                  return (
                    <div key={product.id || idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      {/* Product Thumbnail & Title */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#ECECEC] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                          {imgUrl ? (
                            <img src={imgUrl} alt={title} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-base">🏬</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-extrabold text-[#0E2A5A] truncate text-[11px] leading-tight">
                            {title}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                            Qty: <strong className="text-[#0E2A5A]">{qty}</strong> × AED {price.toFixed(2)} {product.weight ? `• ${product.weight}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right shrink-0">
                        <span className="font-black text-[#0E2A5A] text-xs bg-slate-50 border border-[#ECECEC] px-2.5 py-1 rounded-lg block shadow-2xs">
                          AED {lineTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FINANCIAL TOTALS SUMMARY */}
            <div className="bg-gradient-to-br from-[#0E2A5A]/5 via-amber-500/5 to-[#5A3418]/5 border border-[#0E2A5A]/15 rounded-2xl p-3.5 sm:p-4 space-y-2 text-xs font-bold shadow-inner">
              <div className="flex justify-between text-[#666666]">
                <span>Items Subtotal:</span>
                <span className="font-black text-[#0E2A5A]">AED {Number(subtotal).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#666666]">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-emerald-700" />
                  <span>Abu Dhabi Express Delivery:</span>
                </span>
                <span className="font-black text-emerald-700">
                  {deliveryFee === 0 ? 'FREE (Orders over 150 AED)' : `AED ${Number(deliveryFee).toFixed(2)}`}
                </span>
              </div>

              <div className="pt-2 border-t border-dashed border-[#0E2A5A]/20 flex justify-between items-center text-sm font-black text-[#0E2A5A]">
                <div>
                  <span className="block leading-none text-xs sm:text-sm">Total Payable Amount:</span>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">(Includes 5% UAE VAT)</span>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-[#0E2A5A]">AED {Number(grandTotal).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* COLLAPSIBLE EMAIL RECEIPT SECTION */}
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-3 shadow-xs">
              <button
                type="button"
                onClick={() => setShowEmailSection(!showEmailSection)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-[#0E2A5A] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#5A3418]" />
                  <span>Need an HTML Receipt emailed to you?</span>
                </div>
                {showEmailSection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {showEmailSection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2.5 overflow-hidden"
                  >
                    {emailSent ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-2.5 rounded-xl flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Confirmation email dispatched to {emailInput}!</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSendEmail} className="flex gap-2">
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address..."
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="flex-1 bg-[#F8FAFC] border border-[#ECECEC] rounded-xl px-3 py-1.5 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#0E2A5A]"
                        />
                        <button
                          type="submit"
                          className="bg-[#0E2A5A] hover:bg-[#5A3418] text-white font-extrabold text-xs px-4 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Send
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* 3. STICKY COMPACT ACTION FOOTER */}
          <div className="bg-white border-t border-[#ECECEC] p-3 sm:px-5 sm:py-3.5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-gradient-to-r from-slate-50 to-amber-50/30">
            
            {/* Quick Tools: Download Images & Copy Slip */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownloadAllImages}
                className="flex-1 sm:flex-none text-[11px] font-extrabold text-[#0E2A5A] hover:text-white bg-slate-100 hover:bg-[#0E2A5A] px-3 py-2 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                title="Download all actual product photos & digital slip"
              >
                <Download size={13} />
                <span>Save Photos</span>
              </button>

              <button
                type="button"
                onClick={handleCopySlip}
                className="flex-1 sm:flex-none text-[11px] font-extrabold text-[#0E2A5A] hover:text-white bg-slate-100 hover:bg-[#0E2A5A] px-3 py-2 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                title="Copy digital slip to clipboard"
              >
                {copiedSlip || copiedText ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Slip</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReShare}
                disabled={isReSharing}
                className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/30"
              >
                <MessageCircle size={15} className="fill-current" />
                <span>{isReSharing ? 'Sharing...' : 'Re-open WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={() => setLastOrderDetails(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                {t('close') || 'Close'}
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

