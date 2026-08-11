import React from 'react';

export function Badge({ children, variant = 'primary', className = '' }) {
  const variantClasses = {
    primary: 'ds-badge-primary',
    secondary: 'ds-badge-secondary',
    glass: 'ds-badge-glass'
  };

  return (
    <span className={`ds-badge ${variantClasses[variant] || variantClasses.primary} ${className}`}>
      {children}
    </span>
  );
}
