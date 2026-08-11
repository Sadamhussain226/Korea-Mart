/**
 * Currency Formatter (AED)
 */
export function formatCurrency(amount, currency = 'AED') {
  return `${Number(amount).toFixed(2)} ${currency}`;
}

/**
 * Format Phone Number to International standard
 */
export function formatPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
}

/**
 * Format Date to readable string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
