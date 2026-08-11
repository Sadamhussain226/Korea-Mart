/**
 * Centralized WhatsApp Ordering & Contact Utility
 * Primary Number: +971 56 154 9027 (wa.me/971561549027)
 */

export const WHATSAPP_NUMBER = '971561549027';
export const WHATSAPP_DISPLAY = '+971 56 154 9027';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Helper to construct direct absolute image URL for WhatsApp link preview
 */
export function getProductImageUrl(product) {
  if (!product) return null;
  const img = product.image || (typeof product.img === 'string' ? product.img : null);
  if (!img) return null;

  if (typeof img === 'string' && img.startsWith('http')) {
    return img;
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://koreamartuae.ae';
  const cleanFilename = String(img).split('/').pop();
  return `${origin}/src/assets/products/${cleanFilename}`;
}

/**
 * Generates a clean, professional, mobile-optimized WhatsApp order URL template
 */
export function getWhatsAppOrderUrl({
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
    const imageUrl = getProductImageUrl(product);

    text += `*${idx + 1}. ${name}${weight}*\n`;
    text += `   ├ 📊 *Qty:* ${qty}\n`;
    text += `   ├ 💵 *Unit Price:* AED ${price.toFixed(2)}\n`;
    text += `   ├ 💰 *Item Total:* *AED ${itemTotal}*\n`;

    if (imageUrl) {
      text += `   └ 🖼️ *Image:* ${imageUrl}\n`;
    }

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

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
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
