import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandLogo } from '../../utils/assets';
import { Sparkles, ShoppingBag, Heart } from 'lucide-react';

const LOADING_MESSAGES = [
  "Preparing your Korean favorites...",
  "Authentic Korean groceries delivered across Abu Dhabi...",
  "Fresh Ramyun, Kimchi, Mandu & Halal Meats..."
];

export function AppLoader({ fullScreen = true, text = "" }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const displayMessage = text || LOADING_MESSAGES[msgIndex];

  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-[#0E2A5A] text-white flex flex-col items-center justify-center p-6'
          : 'min-h-[65vh] w-full bg-[#F7F7F7] text-[#0E2A5A] flex flex-col items-center justify-center p-8 rounded-3xl border border-[#ECECEC]'
      } overflow-hidden select-none`}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        
        {/* Animated Brand Emblem & Ring */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Outer Glow Ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 ${
              fullScreen ? 'border-amber-400/40' : 'border-[#0E2A5A]/20'
            }`}
          />
          
          {/* Rotating Subtle Accent Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={`absolute w-36 h-36 rounded-full border border-dashed ${
              fullScreen ? 'border-white/20' : 'border-[#5A3418]/20'
            }`}
          />

          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${
              fullScreen ? 'bg-white shadow-2xl' : 'bg-[#0E2A5A] text-white shadow-xl'
            } p-3 flex items-center justify-center border border-white/20 relative z-10`}
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt="Korea Mart UAE Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black tracking-tighter">KM</span>
                <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-widest">UAE</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-black px-3 py-0.5 rounded-full uppercase backdrop-blur-md">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span>KOREA MART UAE • ABU DHABI 🇦🇪 🇰🇷</span>
          </div>

          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${fullScreen ? 'text-white' : 'text-[#0E2A5A]'}`}>
            Korea Mart UAE
          </h2>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-48 sm:w-56 h-1.5 bg-white/20 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 rounded-full"
          />
        </div>

        {/* Dynamic Loading Message */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={displayMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className={`text-xs sm:text-sm font-semibold ${
                fullScreen ? 'text-slate-200' : 'text-slate-600'
              }`}
            >
              {displayMessage}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
