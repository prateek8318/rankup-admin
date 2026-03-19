import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useApi = <T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> => {
  const { onSuccess, onError, showToast = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (showToast) {
        notificationService.success('Data loaded successfully');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      if (showToast) {
        notificationService.error(error.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};


