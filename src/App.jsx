import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import { AppRouter } from './routes/AppRouter';
import { AppLoader } from './components/common/AppLoader';
import './i18n/config';
import './styles/variables.css';
import './styles/main.css';
import './styles/index.css';

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Smooth initial brand splash screen timing
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            key="initial-app-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999]"
          >
            <AppLoader fullScreen={true} />
          </motion.div>
        )}
      </AnimatePresence>

      <BrowserRouter>
        <LanguageProvider>
          <CartProvider>
            <AppProvider>
              <AppRouter />
            </AppProvider>
          </CartProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
