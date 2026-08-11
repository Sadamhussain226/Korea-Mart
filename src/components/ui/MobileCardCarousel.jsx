import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileCardCarousel = memo(function MobileCardCarousel({ items, renderItem, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 20;
    const velocityThreshold = 120;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext(); // Swiped finger left -> Next card
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev(); // Swiped finger right -> Previous card
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0
    })
  };

  return (
    <div className={`w-full sm:hidden flex flex-col items-center select-none ${className}`}>
      {/* 1 Single Full Card Display Box */}
      <div className="w-full max-w-[280px] relative overflow-hidden flex items-center justify-center py-2 px-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
            className="w-full flex justify-center cursor-grab active:cursor-grabbing"
          >
            {renderItem(items[activeIndex], activeIndex)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Matching Pagination Dots (1 dot per available card) */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              aria-label={`Go to card ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer border-0 ${
                activeIndex === idx
                  ? 'w-6 h-2 bg-[#0E2A5A] shadow-xs'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});
