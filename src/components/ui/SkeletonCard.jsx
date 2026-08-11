import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 animate-pulse flex flex-col justify-between h-full">
      <div>
        <div className="bg-slate-200 rounded-xl h-44 w-full mb-3" />
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
      </div>
      <div className="pt-3 border-t border-dashed border-[#ECECEC] flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-20" />
        <div className="h-8 bg-slate-200 rounded-lg w-16" />
      </div>
    </div>
  );
}
