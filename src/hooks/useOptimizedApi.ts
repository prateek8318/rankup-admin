import { useState, useEffect, useCallback, useRef } from 'react';

// Generic API hook with caching and optimization
export function useOptimizedApi<T, P = void>(
  apiFunction: (params?: P) => Promise<T>,
  params?: P,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, T>>(new Map());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create cache key
      const cacheKey = JSON.stringify(params || 'default');
      
      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        setData(cacheRef.current.get(cacheKey)!);
        setLoading(false);
        return;
      }

      const result = await apiFunction(params);
      
      // Cache the result
      cacheRef.current.set(cacheKey, result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    // Clear cache and refetch
    const cacheKey = JSON.stringify(params || 'default');
    cacheRef.current.delete(cacheKey);
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { data, loading, error, refetch, clearCache };
}

// Debounce hook for search optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Batch API calls hook
export function useBatchApi() {
  const [batchRequests, setBatchRequests] = useState<Array<{
    id: string;
    apiFunction: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }>>([]);

  const addToBatch = useCallback(<R>(apiFunction: () => Promise<R>): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      const id = Math.random().toString(36).substring(7);
      setBatchRequests(prev => [...prev, { id, apiFunction, resolve, reject } as any]);
    });
  }, []);

  useEffect(() => {
    if (batchRequests.length === 0) return;

    const processBatch = async () => {
      const requests = [...batchRequests];
      setBatchRequests([]);

      try {
        await Promise.allSettled(
          requests.map(async ({ apiFunction, resolve, reject }) => {
            try {
              const result = await apiFunction();
              resolve(result);
            } catch (error) {
              reject(error);
            }
          })
        );
      } catch (error) {
        console.error('Batch processing error:', error);
      }
    };

    // Small delay to batch more requests
    const timeoutId = setTimeout(processBatch, 50);
    return () => clearTimeout(timeoutId);
  }, [batchRequests]);

  return { addToBatch };
}

// Memoized component hook
export function useMemoizedComponent<T extends (...args: any[]) => any>(
  fn: T,
  deps: React.DependencyList
): T {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback((...args: Parameters<T>) => fnRef.current(...args), deps) as T;
}
