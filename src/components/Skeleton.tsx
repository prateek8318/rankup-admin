import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  style = {} 
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style
      }}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 6 
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 mb-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} height="20px" width="120px" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3 border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              height="16px" 
              width={colIndex === 0 ? '40px' : colIndex === columns - 1 ? '100px' : '150px'} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`card-${index}`} className="bg-white rounded-lg p-6 shadow-sm">
          <Skeleton height="200px" className="mb-4" />
          <Skeleton height="24px" className="mb-2" />
          <Skeleton height="16px" width="80%" className="mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton height="32px" width="100px" />
            <Skeleton height="32px" width="32px" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`list-${index}`} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton width="40px" height="40px" className="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton height="16px" width="60%" />
            <Skeleton height="12px" width="40%" />
          </div>
          <Skeleton width="80px" height="32px" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;

