import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const StylishAlert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  duration = 4000,
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto-dismiss after duration (except for loading type)
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getAlertStyles = () => {
    const baseStyles = 'relative flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 transform';
    
    const typeStyles = {
      success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800',
      error: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800',
      warning: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-800',
      info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800',
      loading: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 text-purple-800'
    };

    const animationStyles = isVisible && !isExiting
      ? 'translate-x-0 opacity-100 scale-100'
      : isExiting
      ? 'translate-x-full opacity-0 scale-95'
      : 'translate-x-full opacity-0 scale-95';

    return `${baseStyles} ${typeStyles[type]} ${animationStyles} ${className}`;
  };

  const getIcon = () => {
    const iconClass = 'w-5 h-5 flex-shrink-0';
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-600`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-600`} />;
      case 'loading':
        return <Loader2 className={`${iconClass} text-purple-600 animate-spin`} />;
      default:
        return <Info className={`${iconClass} text-gray-600`} />;
    }
  };

  const getTitleStyles = () => {
    const baseStyles = 'font-semibold text-sm mb-1';
    
    const typeTitleStyles = {
      success: 'text-green-900',
      error: 'text-red-900',
      warning: 'text-amber-900',
      info: 'text-blue-900',
      loading: 'text-purple-900'
    };

    return `${baseStyles} ${typeTitleStyles[type]}`;
  };

  const getMessageStyles = () => {
    const baseStyles = 'text-sm opacity-90';
    
    return baseStyles;
  };

  return (
    <div className={getAlertStyles()}>
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={getTitleStyles()}>
          {title}
        </h4>
        {message && (
          <p className={getMessageStyles()}>
            {message}
          </p>
        )}
      </div>

      {/* Close Button */}
      {type !== 'loading' && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors duration-200"
          aria-label="Close alert"
        >
          <X className="w-4 h-4 opacity-60 hover:opacity-100" />
        </button>
      )}

      {/* Progress Bar (for auto-dismiss) */}
      {type !== 'loading' && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-current opacity-30 rounded-b-xl transition-all duration-100"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
              animationDelay: '100ms'
            }}
          />
        </div>
      )}
    </div>
  );
};

// Add global styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;
document.head.appendChild(style);

export default StylishAlert;
