import { useEffect, useRef, useState, ComponentType } from 'react';
import React from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  apiCalls: number;
  memoryUsage: number;
  lastUpdated: Date;
}

interface PerformanceMonitorHook {
  metrics: PerformanceMetrics;
  startTimer: (name: string) => void;
  endTimer: (name: string) => number;
  trackApiCall: () => void;
  trackComponentRender: () => void;
  clearMetrics: () => void;
}

export const usePerformanceMonitor = (): PerformanceMonitorHook => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 0,
    apiCalls: 0,
    memoryUsage: 0,
    lastUpdated: new Date()
  });

  const timers = useRef<Map<string, number>>(new Map());
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime,
      lastUpdated: new Date()
    }));

    // Track memory usage if available
    if ('memory' in performance) {
      const memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memoryUsage * 100) / 100
      }));
    }
  });

  const startTimer = (name: string) => {
    timers.current.set(name, performance.now());
  };

  const endTimer = (name: string): number => {
    const startTime = timers.current.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      timers.current.delete(name);
      return Math.round(duration * 100) / 100;
    }
    return 0;
  };

  const trackApiCall = () => {
    setMetrics(prev => ({
      ...prev,
      apiCalls: prev.apiCalls + 1,
      lastUpdated: new Date()
    }));
  };

  const trackComponentRender = () => {
    setMetrics(prev => ({
      ...prev,
      componentCount: prev.componentCount + 1,
      lastUpdated: new Date()
    }));
  };

  const clearMetrics = () => {
    setMetrics({
      renderTime: 0,
      componentCount: 0,
      apiCalls: 0,
      memoryUsage: 0,
      lastUpdated: new Date()
    });
    timers.current.clear();
  };

  return {
    metrics,
    startTimer,
    endTimer,
    trackApiCall,
    trackComponentRender,
    clearMetrics
  };
};

export const withPerformanceMonitor = <P extends object>(
  componentName: string
) => {
  return function PerformanceMonitorWrapper(WrappedComponent: ComponentType<P>) {
    return function (props: P) {
      const { startTimer, endTimer, trackComponentRender } = usePerformanceMonitor();

      useEffect(() => {
        startTimer(`${componentName}_render`);
        
        return () => {
          const renderTime = endTimer(`${componentName}_render`);
          ;
        };
      });

      useEffect(() => {
        trackComponentRender();
      });

      return React.createElement(WrappedComponent, props);
    };
  };
};

// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const memoize = <T extends (...args: any[]) => any>(func: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Resource loading optimization
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map(preloadImage));
};

// Bundle size monitoring
export const getBundleSize = async (): Promise<{
  js: number;
  css: number;
  total: number;
}> => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  let jsSize = 0;
  let cssSize = 0;
  
  resources.forEach(resource => {
    if (resource.name.includes('.js')) {
      jsSize += resource.transferSize || 0;
    } else if (resource.name.includes('.css')) {
      cssSize += resource.transferSize || 0;
    }
  });
  
  return {
    js: jsSize / 1024, // Convert to KB
    css: cssSize / 1024,
    total: (jsSize + cssSize) / 1024
  };
};

export default usePerformanceMonitor;

