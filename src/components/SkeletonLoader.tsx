'use client';

import React from 'react';

interface SkeletonProps {
  type: 'dashboard' | 'tickets' | 'profile' | 'card';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type, count = 3 }) => {
  const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent";

  if (type === 'dashboard') {
    return (
      <div className="space-y-6 w-full animate-pulse">
        {/* Top welcome section skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        </div>

        {/* Dashboard Cards Skeleton */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="h-6 w-40 bg-slate-200 rounded-md mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-36 rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3 ${shimmerClass}`}>
                <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Facility Badges Skeleton */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="h-6 w-32 bg-slate-200 rounded-md mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-slate-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tickets') {
    return (
      <div className="space-y-4 w-full animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 flex-1 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4 ${shimmerClass}`}>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                </div>
                <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                <div className="w-12 h-12 rounded-lg bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 w-full max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
          <div className="h-6 w-36 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
              <div className="h-5 w-40 bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default single card shimmer skeleton
  return (
    <div className={`h-40 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse ${shimmerClass}`}>
      <div className="h-5 w-1/3 bg-slate-200 rounded-md mb-4"></div>
      <div className="h-8 w-2/3 bg-slate-200 rounded-md mb-2"></div>
      <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
    </div>
  );
};
