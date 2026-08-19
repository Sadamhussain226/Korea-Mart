import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 animate-pulse flex flex-col justify-between h-full">
      <div>
        <div className="bg-slate-100 rounded-xl aspect-square sm:aspect-auto sm:h-44 w-full mb-2.5" />
        <div className="flex justify-between items-center mb-1.5 px-0.5">
          <div className="h-2.5 bg-slate-200 rounded w-1/3" />
          <div className="h-2.5 bg-slate-200 rounded w-1/4" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-5/6 mb-1.5" />
        <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
        <div className="h-2.5 bg-slate-100 rounded w-1/3 mb-3" />
      </div>
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-16" />
        <div className="flex gap-1.5">
          <div className="w-8 h-8 bg-slate-100 rounded-xl" />
          <div className="w-14 h-8 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
