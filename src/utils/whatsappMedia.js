/**
 * WhatsApp Media Processing & Canvas Generator for Korea Mart UAE
 * Handles converting product image assets into real binary File/Blob objects
 * and generating a high-resolution branded digital order receipt graphic.
 */

import { getProductImage } from './assets';

/**
 * Converts an image source URL or base64 into a real Blob and File object
 */
export async function urlToFile(imageUrl, filename = 'product.jpg') {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const mimeType = blob.type || (filename.endsWith('.png') ? 'image/png' : 'image/jpeg');
    return new File([blob], filename, { type: mimeType });
  } catch (err) {
    console.warn('Direct fetch failed, falling back to canvas conversion:', err);
    return await imageElementToFile(imageUrl, filename);
  }
}

/**
 * Fallback to load image via HTMLImageElement and draw to canvas to get File
 */
export function imageElementToFile(imageSrc, filename = 'product.jpg') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], filename, { type: mimeType }));
            } else {
              reject(new Error('Canvas blob generation failed'));
            }
          },
          mimeType,
          0.92
        );
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
}

/**
 * Loads an HTMLImageElement with promise support
 */
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Cleans a string to be safely used as a filename
 */
function sanitizeFilename(str) {
  return String(str)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
}

/**
 * Prepares real File objects for all ordered products
 */
export async function prepareOrderImageFiles(items = [], orderRef = 'ORDER') {
  const filePromises = items.map(async (item, idx) => {
    const product = item.product || item;
    const resolvedUrl = getProductImage(product.image) || product.image;
    if (!resolvedUrl) return null;

    const ext = resolvedUrl.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const safeName = sanitizeFilename(product.name || `Item_${idx + 1}`);
    const filename = `${idx + 1}_${safeName}.${ext}`;

    try {
      return await urlToFile(resolvedUrl, filename);
    } catch (e) {
      console.warn(`Could not prepare image file for item ${idx + 1}:`, e);
      return null;
    }
  });

  const files = await Promise.all(filePromises);
  return files.filter(Boolean);
}

/**
 * Generates a high-resolution, branded visual Order Invoice Slip (PNG)
 * containing product thumbnails, customer details, delivery location, and pricing.
 */
export async function generateVisualOrderSlip({
  orderRef = '',
  items = [],
  customerName = '',
  phone = '',
  area = '',
  address = '',
  subtotal = 0,
  deliveryFee = 0,
  grandTotal = 0,
  paymentMethod = 'codCash'
}) {
  const width = 760;
  const itemRowHeight = 62;
  const headerHeight = 135;
  const customerSectionHeight = 115;
  const itemsSectionHeaderHeight = 38;
  const itemsListHeight = Math.max(1, items.length) * itemRowHeight;
  const totalsSectionHeight = 145;
  const footerHeight = 55;
  const height = headerHeight + customerSectionHeight + itemsSectionHeaderHeight + itemsListHeight + totalsSectionHeight + footerHeight + 35;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Smooth antialiasing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Background
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, width, height);

  // 1. Header Banner
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#0E2A5A');
  gradient.addColorStop(0.6, '#1A3A6D');
  gradient.addColorStop(1, '#5A3418');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, headerHeight);

  // Store Brand Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('KOREA MART UAE 🇰🇷', 35, 42);

  ctx.fillStyle = '#FBBF24';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('AUTHENTIC KOREAN GROCERY • ABU DHABI EXPRESS DELIVERY', 35, 64);

  // Order Reference & Date Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.roundRect(35, 80, width - 70, 42, 8);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`ORDER REF: #${orderRef}`, 50, 106);

  const dateStr = `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'normal 12px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 50, 106);
  ctx.textAlign = 'left';

  let currentY = headerHeight + 16;

  // 2. Customer & Delivery Box
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.04)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.roundRect(35, currentY, width - 70, customerSectionHeight, 10);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Section Header
  ctx.fillStyle = '#0E2A5A';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('📍 CUSTOMER & DELIVERY INFORMATION', 52, currentY + 24);

  // Left Column
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Customer Name:', 52, currentY + 48);
  ctx.fillText('WhatsApp Mobile:', 52, currentY + 70);
  ctx.fillText('Delivery Area:', 52, currentY + 92);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText((customerName || 'Customer').substring(0, 26), 170, currentY + 48);
  ctx.fillText(phone || 'N/A', 170, currentY + 70);
  ctx.fillText(`${area || 'Abu Dhabi'}, UAE 🇦🇪`, 170, currentY + 92);

  // Right Column
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Payment Method:', 420, currentY + 48);
  ctx.fillText('Street Address:', 420, currentY + 70);

  const payLabel = paymentMethod === 'codCash' ? 'Cash On Delivery 💵' : 'Card On Delivery 💳';
  ctx.fillStyle = '#0E2A5A';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(payLabel, 540, currentY + 48);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'normal 11px sans-serif';
  const cleanAddr = (address || 'Abu Dhabi Residence').substring(0, 28);
  ctx.fillText(cleanAddr, 540, currentY + 70);

  currentY += customerSectionHeight + 12;

  // 3. Items Section Header
  ctx.fillStyle = '#0E2A5A';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`🛍️ ORDERED PRODUCTS (${items.length} ${items.length === 1 ? 'ITEM' : 'ITEMS'})`, 35, currentY + 12);

  currentY += 24;

  // Load product images for thumbnails
  const loadedImages = await Promise.all(
    items.map((item) => {
      const product = item.product || item;
      const url = getProductImage(product.image) || product.image;
      return loadImage(url);
    })
  );

  // 4. Item Rows Box
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.04)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.roundRect(35, currentY, width - 70, itemsListHeight + 6, 10);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  let rowY = currentY + 4;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const product = item.product || item;
    const img = loadedImages[i];
    const qty = item.quantity || 1;
    const price = Number(product.price) || 0;
    const lineTotal = (price * qty).toFixed(2);
    const title = (product.name || 'Korean Grocery Item').substring(0, 36);
    const weight = product.weight ? ` • ${product.weight}` : '';

    // Thumbnail background
    ctx.fillStyle = '#F1F5F9';
    ctx.roundRect(48, rowY + 5, 46, 46, 8);
    ctx.fill();

    if (img) {
      try {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(48, rowY + 5, 46, 46, 8);
        ctx.clip();
        ctx.drawImage(img, 48, rowY + 5, 46, 46);
        ctx.restore();
      } catch (e) {
        // Ignore draw error
      }
    }

    // Product Title & Qty
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`${i + 1}. ${title}`, 106, rowY + 24);

    ctx.fillStyle = '#64748B';
    ctx.font = 'normal 11px sans-serif';
    ctx.fillText(`Qty: ${qty} × AED ${price.toFixed(2)}${weight}`, 106, rowY + 42);

    // Line Total
    ctx.fillStyle = '#0E2A5A';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`AED ${lineTotal}`, width - 52, rowY + 32);
    ctx.textAlign = 'left';

    // Row divider
    if (i < items.length - 1) {
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(48, rowY + 56);
      ctx.lineTo(width - 48, rowY + 56);
      ctx.stroke();
    }

    rowY += itemRowHeight;
  }

  currentY = rowY + 12;

  // 5. Totals & Payment Summary Box
  ctx.fillStyle = '#0E2A5A';
  ctx.roundRect(35, currentY, width - 70, totalsSectionHeight, 10);
  ctx.fill();

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'normal 12px sans-serif';
  ctx.fillText('Items Subtotal:', 55, currentY + 30);
  ctx.fillText('Abu Dhabi Delivery Fee:', 55, currentY + 56);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`AED ${Number(subtotal).toFixed(2)}`, width - 55, currentY + 30);

  const delText = deliveryFee === 0 ? 'FREE (Over 150 AED)' : `AED ${Number(deliveryFee).toFixed(2)}`;
  ctx.fillStyle = deliveryFee === 0 ? '#34D399' : '#FFFFFF';
  ctx.fillText(delText, width - 55, currentY + 56);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(55, currentY + 74);
  ctx.lineTo(width - 55, currentY + 74);
  ctx.stroke();

  // Grand Total
  ctx.fillStyle = '#FBBF24';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('TOTAL AMOUNT PAYABLE (INCL. 5% VAT):', 55, currentY + 108);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`AED ${Number(grandTotal).toFixed(2)}`, width - 55, currentY + 108);
  ctx.textAlign = 'left';

  currentY += totalsSectionHeight;

  // 6. Footer
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100% Certified Halal Grocery • Next-Day Abu Dhabi Delivery • WhatsApp: +971 56 154 9027', width / 2, currentY + 16);
  ctx.font = 'normal 10px sans-serif';
  ctx.fillText('Thank you for choosing Korea Mart UAE! 🇰🇷✨', width / 2, currentY + 32);

  // Return as Blob and File
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `KM_UAE_Order_${orderRef}_Slip.png`, { type: 'image/png' });
        resolve({ blob, file, dataUrl: canvas.toDataURL('image/png') });
      },
      'image/png',
      0.95
    );
  });
}
