import React from "react";

export default function CoverLetterSkeleton() {
  return (
    <div className="relative z-0 animate-slideUp pt-0">
      {/* Language Toggle Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-200 rounded-lg p-1 w-64 h-10 animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="w-full max-w-3xl mx-auto p-6">
        <div className="space-y-6">
          {/* Subject Skeleton */}
          <div className="h-7 bg-slate-300 rounded-md w-3/4 animate-pulse" />

          {/* Salutation Skeleton */}
          <div className="h-6 bg-slate-300 rounded-md w-1/2 animate-pulse" />

          {/* Opening Paragraph Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-300 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-300 rounded w-11/12 animate-pulse" />
            <div className="h-4 bg-slate-300 rounded w-4/5 animate-pulse" />
          </div>

          {/* Body Paragraphs Skeleton */}
          {[1, 2].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-slate-300 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-11/12 animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-4/5 animate-pulse" />
            </div>
          ))}

          {/* Closing Paragraph Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-300 rounded w-11/12 animate-pulse" />
            <div className="h-4 bg-slate-300 rounded w-4/5 animate-pulse" />
          </div>

          {/* Signature Skeleton */}
          <div className="h-6 bg-slate-300 rounded-md w-1/3 animate-pulse mt-8" />
        </div>
      </div>
    </div>
  );
}
