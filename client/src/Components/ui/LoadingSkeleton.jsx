import React from "react";

// Card skeleton for disaster cards, post cards, etc.
export const CardSkeleton = () => (
  <div className="animate-pulse bg-gray-200 rounded-xl h-[470px] p-4">
    <div className="h-full flex flex-col justify-between">
      <div className="h-24 bg-gray-300 rounded-lg mb-4"></div>
      <div className="space-y-3 flex-grow">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div className="flex-grow space-y-2">
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto p-6">
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-6 mb-8">
        <div className="h-32 w-32 bg-gray-300 rounded-full"></div>
        <div className="flex-grow space-y-3">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

// Table skeleton for data grids
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="animate-pulse w-full">
    <div className="h-12 bg-gray-200 rounded-t-lg mb-2"></div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 border-b border-gray-200 mb-1 rounded"></div>
    ))}
  </div>
);

// Stats card skeleton for dashboard
export const StatsCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-300 rounded w-1/2"></div>
      <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

// Chart skeleton
export const ChartSkeleton = ({ height = "h-80" }) => (
  <div className={`animate-pulse bg-white rounded-xl border border-gray-100 p-5 ${height}`}>
    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="h-full bg-gray-200 rounded"></div>
  </div>
);

// Payment grid skeleton
export const PaymentCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <div className="h-5 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
    <div className="flex gap-2 mt-4">
      <div className="h-8 bg-gray-300 rounded flex-1"></div>
      <div className="h-8 bg-gray-300 rounded flex-1"></div>
    </div>
  </div>
);

// User list skeleton
export const UserListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="animate-pulse flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        <div className="flex-grow space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

// Full page loader
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Inline loader (for smaller sections)
export const InlineLoader = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
      <p className="mt-2 text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);
