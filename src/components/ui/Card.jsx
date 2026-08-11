import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, glass = false, hover = true, className = '', ...props }) {
  const baseClass = glass ? 'ds-card-glass' : 'ds-card';
  const hoverClass = hover ? 'ds-card-hover' : '';

  return (
    <motion.div
      className={`${baseClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
