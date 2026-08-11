/**
 * Application Configuration Setup
 */
export const APP_CONFIG = {
  name: 'Korea Mart UAE',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.koreamartuae.ae/v1',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar', 'ko', 'zh', 'tl'],
  whatsapp: {
    number: '971561549027',
    formattedDisplay: '+971 56 154 9027'
  },
  delivery: {
    freeShippingThreshold: 150,
    baseFee: 20,
    currency: 'AED'
  }
};
