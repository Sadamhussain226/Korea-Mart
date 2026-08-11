import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ScrollToTop } from '../components/common/ScrollToTop';

const GuestCheckoutModal = lazy(() => import('../components/checkout/GuestCheckoutModal').then((m) => ({ default: m.GuestCheckoutModal })));
const ReceiptModal = lazy(() => import('../components/checkout/ReceiptModal').then((m) => ({ default: m.ReceiptModal })));

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <ScrollToTop />

      {/* TOP dark navy announcement bar -> NOT sticky; scrolls away normally */}
      <AnnouncementBar />

      {/* WHITE main header + DARK BROWN category bar -> STICKY together at top: 0 */}
      <div className="sticky top-0 z-50 w-full shadow-md">
        <Navbar />
      </div>

      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />

      {/* Drawers & Lazy Loaded Modals */}
      <CartDrawer />
      <Suspense fallback={null}>
        <GuestCheckoutModal />
        <ReceiptModal />
      </Suspense>
    </div>
  );
}
