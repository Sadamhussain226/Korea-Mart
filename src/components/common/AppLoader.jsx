import React from 'react';
import { motion } from 'framer-motion';

// Circular orbit configuration: 10 medium-sized, clearly visible bubbles
const BUBBLE_COUNT = 10;
const RADIUS = 34; // Radius in pixels for a balanced, compact circle

const bubbles = Array.from({ length: BUBBLE_COUNT }, (_, i) => {
  const angle = (i / BUBBLE_COUNT) * (2 * Math.PI);
  const x = Math.cos(angle) * RADIUS;
  const y = Math.sin(angle) * RADIUS;
  return {
    id: i,
    x,
    y,
    // Staggered timing for a smooth traveling wave effect
    delay: (i / BUBBLE_COUNT) * 2.0
  };
});

export function AppLoader({ fullScreen = true }) {
  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 z-[99999] bg-gradient-to-br from-[#081528] via-[#0E2445] to-[#2D1607] flex items-center justify-center'
          : 'min-h-[50vh] w-full flex items-center justify-center p-8 bg-gradient-to-br from-[#081528] via-[#0E2445] to-[#2D1607] rounded-3xl'
      } select-none overflow-hidden`}
    >
      {/* Subtle warm ambient gold glow */}
      <div className="absolute w-64 h-64 bg-gradient-to-r from-amber-500/10 via-orange-500/8 to-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Orbiting Dots Container */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Continuous Slow, Calm Orbit Rotation (4.8s per revolution) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {bubbles.map((b) => (
            <motion.span
              key={b.id}
              className="absolute rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 shadow-[0_0_8px_rgba(251,191,36,0.55)]"
              style={{
                width: '12px',
                height: '12px',
                left: `calc(50% + ${b.x}px - 6px)`,
                top: `calc(50% + ${b.y}px - 6px)`
              }}
              animate={{
                scale: [0.35, 1.25, 0.35],
                opacity: [0.25, 1, 0.25]
              }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: b.delay
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}


