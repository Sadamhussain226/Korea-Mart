import React from 'react';
import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) {
  const baseClass = 'btn-ds';

  const variantClasses = {
    primary: 'btn-primary-ds',
    secondary: 'btn-secondary-ds',
    outline: 'btn-outline-ds',
    glass: 'btn-glass-ds'
  };

  const sizeClasses = {
    sm: 'btn-ds-sm',
    md: 'btn-ds-md',
    lg: 'btn-ds-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClass} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin me-2" />
      )}
      {children}
    </motion.button>
  );
}
