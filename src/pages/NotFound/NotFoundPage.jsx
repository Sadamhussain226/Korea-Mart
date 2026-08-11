import React from 'react';
import { Link } from 'react-router-dom';
import { SEOMeta } from '../../components/common/SEOMeta';

export function NotFoundPage() {
  return (
    <>
      <SEOMeta title="Page Not Found | Korea Mart UAE" />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-3">🥢</span>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
        <p className="text-slate-600 mb-6">The page you are looking for does not exist or has been moved.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
}
