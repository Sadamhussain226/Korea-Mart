import React, { useState, lazy, Suspense, useCallback } from 'react';
import { SEOMeta } from '../../components/common/SEOMeta';
import { HeroSection } from '../../components/home/HeroSection';
import { FeaturedCategoriesPreview } from '../../components/home/FeaturedCategoriesPreview';
import { useNavigate } from 'react-router-dom';

// Lazy-loaded below-the-fold homepage sections for optimal initial bundle & fast LCP
const TodaysOffers = lazy(() => import('../../components/home/TodaysOffers').then((m) => ({ default: m.TodaysOffers })));
const FeaturedProducts = lazy(() => import('../../components/home/FeaturedProducts').then((m) => ({ default: m.FeaturedProducts })));
const PopularProducts = lazy(() => import('../../components/home/PopularProducts').then((m) => ({ default: m.PopularProducts })));
const LatestProducts = lazy(() => import('../../components/home/LatestProducts').then((m) => ({ default: m.LatestProducts })));
const WhyChooseUs = lazy(() => import('../../components/home/WhyChooseUs').then((m) => ({ default: m.WhyChooseUs })));
const AboutSection = lazy(() => import('../../components/home/AboutSection').then((m) => ({ default: m.AboutSection })));
const CustomerTestimonials = lazy(() => import('../../components/home/CustomerTestimonials').then((m) => ({ default: m.CustomerTestimonials })));
const Newsletter = lazy(() => import('../../components/home/Newsletter').then((m) => ({ default: m.Newsletter })));
const ProductModal = lazy(() => import('../../components/product/ProductModal').then((m) => ({ default: m.ProductModal })));

export function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();

  const handleSelectCategory = useCallback((categoryId) => {
    navigate(`/products?category=${categoryId}`);
  }, [navigate]);

  const handleViewAllCategories = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleQuickView = useCallback((product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const handleShopNow = useCallback(() => {
    const offersEl = document.getElementById('todays-offers');
    if (offersEl) offersEl.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleBrowseCategories = useCallback(() => {
    const catEl = document.getElementById('featured-categories');
    if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen scroll-smooth">
      <SEOMeta title="Korea Mart UAE | Premier Authentic Korean Grocery Store Abu Dhabi" />

      {/* 1. HERO SECTION (Above-the-fold / Critical for LCP) */}
      <HeroSection
        onShopNow={handleShopNow}
        onBrowseCategories={handleBrowseCategories}
      />

      {/* 2. FEATURED CATEGORIES PREVIEW (Above-the-fold) */}
      <FeaturedCategoriesPreview
        onSelectCategory={handleSelectCategory}
        onViewAll={handleViewAllCategories}
      />

      {/* Below-the-fold Lazy Loaded Sections */}
      <Suspense fallback={null}>
        {/* 3. TODAY'S OFFERS */}
        <TodaysOffers onQuickView={handleQuickView} />

        {/* 4. FEATURED PRODUCTS */}
        <FeaturedProducts onQuickView={handleQuickView} />

        {/* 5. POPULAR PRODUCTS */}
        <PopularProducts onQuickView={handleQuickView} />

        {/* 6. LATEST PRODUCTS */}
        <LatestProducts onQuickView={handleQuickView} />

        {/* 7. WHY CHOOSE KOREA MART UAE */}
        <WhyChooseUs />

        {/* 8. ABOUT KOREA MART UAE */}
        <AboutSection />

        {/* 9. CUSTOMER TESTIMONIALS */}
        <CustomerTestimonials />

        {/* 10. NEWSLETTER */}
        <Newsletter />

        {/* Quick View Dialog Modal */}
        {quickViewProduct && (
          <ProductModal
            product={quickViewProduct}
            onClose={handleCloseQuickView}
          />
        )}
      </Suspense>
    </div>
  );
}
