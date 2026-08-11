import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEOMeta({
  title = 'Korea Mart UAE | Premier Authentic Korean Grocery Store Abu Dhabi',
  description = 'Directly imported Korean groceries in Abu Dhabi: Shin Ramyun, Buldak, fresh Halal LA Galbi, Jongga Kimchi, Binggrae Melon Milk, and K-Beauty. Express Next-Day Delivery across UAE.',
  keywords = 'Korea Mart UAE, Korean Grocery Abu Dhabi, Halal LA Galbi, Shin Ramyun, Buldak, Jongga Kimchi, Binggrae Milk, Korean Supermarket UAE',
  image = '/og-image.jpg',
  url = 'https://koreamartuae.ae'
}) {
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: 'Korea Mart UAE',
    image: 'https://koreamartuae.ae/og-image.jpg',
    telephone: '+971501234567',
    email: 'orders@koreamartuae.ae',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Reem Island & Corniche Store',
      addressLocality: 'Abu Dhabi',
      addressRegion: 'Abu Dhabi',
      addressCountry: 'AE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '24.4938',
      longitude: '54.4072'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '22:00'
    },
    priceRange: '$$'
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0E2A5A" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Korea Mart UAE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured JSON-LD Data for Search Engines */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdSchema)}
      </script>
    </Helmet>
  );
}
