import { useState, useCallback, useEffect } from 'react';
import { errorHandlingService, ApiError } from '@/services/errorHandlingService';
import { notificationService } from '@/services/notificationService';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiStateOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  showErrorNotification?: boolean;
}

export function useApiState<T>(
  fetchFunction: () => Promise<T>,
  options: UseApiStateOptions<T> = {}
) {
  const { initialData = null, onSuccess, onError, showErrorNotification = true } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchFunction();
      setState({ data, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const apiError = errorHandlingService.handleError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError 
      }));
      
      if (onError) {
        onError(apiError);
      }
      
      throw apiError;
    }
  }, [fetchFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  // Auto-execute on mount if needed
  useEffect(() => {
    // Only auto-execute if this is meant to be called on mount
    // This prevents unwanted calls in some scenarios
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData
  };
}

export function useMutation<T, P = any>(
  mutationFunction: (params: P) => Promise<T>,
  options: UseApiStateOptions<T> = {}
) {
  const { onSuccess, onError, showErrorNotification = true } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await mutationFunction(params);
      setState({ data, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const apiError = errorHandlingService.handleError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError 
      }));
      
      if (onError) {
        onError(apiError);
      }
      
      throw apiError;
    }
  }, [mutationFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
}
