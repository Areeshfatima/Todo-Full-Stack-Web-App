import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  height?: string;
  width?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  className = '',
  height = 'h-4',
  width = 'w-full'
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${height} ${width} bg-gray-200 rounded animate-pulse ${className}`}
    />
  ));

  return <>{skeletons}</>;
};

// Specific skeleton components for common UI patterns
export const TaskSkeleton = () => (
  <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out p-4 mb-3 hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border-l-4 border-primary-500 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
        </div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Welcome Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-primary-400 to-purple-500 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="h-8 bg-primary-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-primary-300 rounded w-2/3"></div>
        </div>

        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out p-4 mb-3 hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border-l-4 border-primary-500 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);