import React from 'react';

/**
 * Reusable LayoutContainer Component
 * Enforces unified 1320px max-width and consistent responsive padding
 * across all sections, pages, header, and footer.
 */
export function LayoutContainer({ children, className = '' }) {
  return (
    <div className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 box-border ${className}`}>
      {children}
    </div>
  );
}
