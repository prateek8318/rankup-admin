import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { appConfig } from '@/services/appConfig';
import { errorHandlingService } from '@/services/errorHandlingService';

const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);
const DEFAULT_RETRY_COUNT = 1;

declare module 'axios' {
  interface AxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
  }

  interface InternalAxiosRequestConfig {
    _retryCount?: number;
    skipGlobalErrorHandler?: boolean;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredToken = () => localStorage.getItem('token');

const shouldRetryRequest = (error: AxiosError): boolean => {
  if (!error.config) {
    return false;
  }

  if (error.code === AxiosError.ERR_CANCELED) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return RETRYABLE_STATUS_CODES.has(error.response.status);
};

const applyRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStoredToken();
      const headers = AxiosHeaders.from(config.headers);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        headers.delete('Authorization');
      }

      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      config.headers = headers;
      return config;
    },
    (error) => Promise.reject(error),
  );
};

const applyResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const requestConfig = error.config;

      if (requestConfig && shouldRetryRequest(error)) {
        requestConfig._retryCount = requestConfig._retryCount ?? 0;

        if (requestConfig._retryCount < DEFAULT_RETRY_COUNT) {
          requestConfig._retryCount += 1;
          await sleep(300);
          return client(requestConfig);
        }
      }

      if (!requestConfig?.skipGlobalErrorHandler) {
        errorHandlingService.handleError(error, requestConfig?.url);
      }

      return Promise.reject(error);
    },
  );
};

export const createApiClient = (baseURL: string = appConfig.apiBaseUrl as string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: appConfig.requestTimeout,
    withCredentials: false,
  });

  applyRequestInterceptor(client);
  applyResponseInterceptor(client);

  return client;
};

export const axiosBase = createApiClient();
