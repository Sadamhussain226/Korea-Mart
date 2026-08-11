import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

import { AppLoader } from '../components/common/AppLoader';

// Lazy loaded page chunks for performance & code-splitting
const HomePage = lazy(() => import('../pages/Home/HomePage').then((module) => ({ default: module.HomePage })));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage').then((module) => ({ default: module.ProductsPage })));
const CategoriesPage = lazy(() => import('../pages/Categories/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const ProductDetailPage = lazy(() => import('../pages/ProductDetail/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function PageLoader() {
  return <AppLoader fullScreen={false} />;
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
