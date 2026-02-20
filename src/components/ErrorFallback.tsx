import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorFallback: React.FC = () => {
  const error = useRouteError();
  // Log full error for debugging
  // eslint-disable-next-line no-console
  console.error('Route error caught by ErrorFallback:', error);

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: '#b91c1c' }}>Something went wrong</h2>
        <p>Status: {error.status} {error.statusText}</p>
        <p>{error.data ? JSON.stringify(error.data) : null}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#b91c1c' }}>An unexpected error occurred</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error)}</pre>
    </div>
  );
};

export default ErrorFallback;
