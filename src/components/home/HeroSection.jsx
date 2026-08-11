import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '../../utils/assets';
import { LayoutContainer } from '../layout/LayoutContainer';

export const HeroSection = memo(function HeroSection({ onShopNow, onBrowseCategories }) {
  // Use exact 8 hero slide banner assets (slide1.jpg through slide8.jpg)
  const slides = heroSlides;
  const totalSlides = slides.length > 0 ? slides.length : 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play every 10 seconds (10,000 ms), pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 10000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleDotClick = useCallback((idx) => {
    setCurrentIndex(idx);
  }, []);

  // Touch Swipe Handlers for mobile & touch devices
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext(); // Swiped left -> next
    } else if (distance < -50) {
      handlePrev(); // Swiped right -> prev
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section className="w-full bg-[#F7F7F7] py-2 sm:py-4 lg:py-5">
      <LayoutContainer>
        {/* Compact Prominent Hero Banner Slider Container */}
        <div
          className="relative w-full h-[140px] sm:h-[190px] md:h-[230px] lg:h-[260px] xl:h-[280px] bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group border border-[#ECECEC]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Banner Slides with Fade Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950"
            >
              {slides[currentIndex] ? (
                <img
                  src={slides[currentIndex]}
                  alt={`Korea Mart UAE Banner ${currentIndex + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                  fetchPriority={currentIndex === 0 ? "high" : "auto"}
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-black text-2xl">
                  KOREA MART UAE BANNERS
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrow - Left */}
          {totalSlides > 1 && (
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#0E2A5A] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Navigation Arrow - Right */}
          {totalSlides > 1 && (
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#0E2A5A] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Pagination Dots at Bottom Center */}
          {totalSlides > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/35 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 shadow-md">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === idx
                      ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-amber-400 shadow-sm'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Pause Indicator Tag on Hover */}
          {isPaused && (
            <div className="absolute top-3 right-3 z-20 bg-black/50 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20">
              ⏸ Paused
            </div>
          )}

        </div>
      </LayoutContainer>
    </section>
  );
});

