import { prepareOrderImageFiles, generateVisualOrderSlip } from './whatsappMedia';

/**
 * Centralized WhatsApp Ordering & Contact Utility
 * Primary Number: +971 56 154 9027 (wa.me/971561549027)
 */

export const WHATSAPP_NUMBER = '971561549027';
export const WHATSAPP_DISPLAY = '+971 56 154 9027';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Generates the clean formatted order message text
 */
export function getWhatsAppOrderText({
  orderRef = '',
  items = [],
  customerName = '',
  phone = '',
  area = 'Abu Dhabi',
  address = '',
  gpsCoords = null,
  subtotal = 0,
  deliveryFee = 0,
  grandTotal = 0,
  paymentMethod = '',
  notes = ''
}) {
  const refId = orderRef || `KM-UAE-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateStr = `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  let text = `✨ *KOREA MART UAE — NEW ORDER* ✨\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🆔 *Order Ref:* #${refId}\n`;
  text += `📅 *Date & Time:* ${dateStr}\n\n`;

  // Customer Information Section
  if (customerName || phone) {
    text += `👤 *CUSTOMER DETAILS*\n`;
    if (customerName) text += `• *Name:* ${customerName}\n`;
    if (phone) text += `• *Phone:* ${phone}\n`;
    text += `• *City:* Abu Dhabi, UAE 🇦🇪\n\n`;
  }

  // Delivery Address Section
  if (address || area) {
    text += `📍 *DELIVERY LOCATION*\n`;
    if (area) text += `• *Area:* ${area}\n`;
    if (address) text += `• *Address:* ${address}\n`;
    if (gpsCoords && gpsCoords.lat && gpsCoords.lng) {
      text += `🗺️ *GPS Location:* https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}\n`;
    }
    text += `\n`;
  }

  // Ordered Items Section
  const totalQty = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  text += `🛍️ *ORDERED PRODUCTS (${totalQty} ${totalQty === 1 ? 'Item' : 'Items'})*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;

  items.forEach((item, idx) => {
    const product = item.product || item;
    const name = product.name || product.title || 'Korean Grocery Item';
    const weight = product.weight ? ` (${product.weight})` : '';
    const qty = item.quantity || 1;
    const price = Number(product.price) || 0;
    const itemTotal = (price * qty).toFixed(2);

    text += `*${idx + 1}. ${name}${weight}*\n`;
    text += `   ├ 📊 *Qty:* ${qty}\n`;
    text += `   ├ 💵 *Unit Price:* AED ${price.toFixed(2)}\n`;
    text += `   └ 💰 *Item Total:* *AED ${itemTotal}*\n`;

    if (idx < items.length - 1) text += `\n`;
  });

  // Financial Breakdown & Payment Section
  text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💳 *PAYMENT & ORDER SUMMARY*\n`;

  const calcSubtotal = subtotal > 0 ? subtotal : items.reduce((acc, i) => acc + (i.product?.price || i.price || 0) * (i.quantity || 1), 0);
  text += `💵 *Items Subtotal:* AED ${calcSubtotal.toFixed(2)}\n`;

  const delFeeText = deliveryFee === 0 ? 'FREE (Orders over 150 AED)' : `AED ${deliveryFee.toFixed(2)}`;
  text += `🚚 *Delivery Fee:* ${delFeeText}\n`;

  const finalTotal = grandTotal > 0 ? grandTotal : calcSubtotal + deliveryFee;
  text += `💰 *GRAND TOTAL:* *AED ${finalTotal.toFixed(2)}* (Incl. 5% VAT)\n\n`;

  if (paymentMethod) {
    const payLabel = paymentMethod === 'codCash'
      ? 'Cash on Delivery 💵'
      : paymentMethod === 'codCard'
      ? 'Card on Delivery (Mobile POS) 💳'
      : paymentMethod;
    text += `💳 *Payment Method:* ${payLabel}\n`;
  }

  if (notes) {
    text += `📝 *Order Notes:* ${notes}\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🙏 Thank you for shopping with Korea Mart UAE! 🇰🇷✨`;

  return text;
}

/**
 * Generates a clean, professional, mobile-optimized WhatsApp order URL template
 */
export function getWhatsAppOrderUrl(orderParams) {
  const text = getWhatsAppOrderText(orderParams);
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}

/**
 * Complete Real Image Dispatching System:
 * 1. Prepares real binary File objects for each product image
 * 2. Generates a high-res branded Digital Order Slip image
 * 3. Uses Web Share API (Level 2) to share actual image files + order text directly into WhatsApp
 * 4. Gracefully falls back to WhatsApp Web with Clipboard & Download support if Web Share is unavailable
 */
export async function dispatchWhatsAppOrderWithImages(orderData) {
  const orderText = getWhatsAppOrderText(orderData);
  const waUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(orderText)}`;

  // Step 1: Prepare real product image files & digital order slip
  let productFiles = [];
  let slipResult = null;

  try {
    const [files, slip] = await Promise.all([
      prepareOrderImageFiles(orderData.items, orderData.orderRef),
      generateVisualOrderSlip(orderData)
    ]);
    productFiles = files;
    slipResult = slip;
  } catch (err) {
    console.warn('Could not prepare all image media files:', err);
  }

  const allFilesToSend = [];
  if (slipResult && slipResult.file) {
    allFilesToSend.push(slipResult.file);
  }
  if (productFiles && productFiles.length > 0) {
    allFilesToSend.push(...productFiles);
  }

  // Step 2: Try native Web Share API with files if supported
  let sharedSuccessfully = false;
  if (navigator.canShare && allFilesToSend.length > 0) {
    try {
      const shareData = {
        title: `Korea Mart UAE Order #${orderData.orderRef}`,
        text: orderText,
        files: allFilesToSend
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        sharedSuccessfully = true;
      }
    } catch (shareErr) {
      if (shareErr.name !== 'AbortError') {
        console.warn('Native share failed, proceeding with fallback:', shareErr);
      } else {
        // User cancelled share sheet
        sharedSuccessfully = true;
      }
    }
  }

  // Step 3: Desktop / Non-WebShare Fallback
  if (!sharedSuccessfully) {
    // Copy order text and slip to clipboard where supported
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(orderText);
      }
    } catch (clipErr) {
      console.warn('Clipboard write text failed:', clipErr);
    }

    // Launch WhatsApp chat
    window.open(waUrl, '_blank');
  }

  return {
    success: true,
    sharedViaNativeFiles: sharedSuccessfully,
    files: allFilesToSend,
    slipResult,
    waUrl,
    orderText
  };
}

/**
 * Copies an image Blob to system clipboard (for easy Ctrl+V into WhatsApp Web)
 */
export async function copyImageToClipboard(blob) {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    const item = new ClipboardItem({ [blob.type || 'image/png']: blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (e) {
    console.warn('Clipboard copy image failed:', e);
    return false;
  }
}

/**
 * Downloads a File or Blob directly to user's device
 */
export function downloadFile(fileOrBlob, filename = 'product_image.jpg') {
  const url = URL.createObjectURL(fileOrBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || fileOrBlob.name || 'image.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Generates a quick product inquiry WhatsApp URL
 */
export function getProductWhatsAppUrl(product, quantity = 1) {
  const price = Number(product.price) || 0;
  const sub = price * quantity;
  const del = sub >= 150 ? 0 : 20;
  return getWhatsAppOrderUrl({
    items: [{ product, quantity }],
    subtotal: sub,
    deliveryFee: del,
    grandTotal: sub + del
  });
}

/**
 * Generates general contact WhatsApp URL
 */
export function getGeneralWhatsAppUrl(customText) {
  const text = customText || 'Hello Korea Mart UAE! I would like to inquire about Korean grocery items and delivery in Abu Dhabi.';
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}
