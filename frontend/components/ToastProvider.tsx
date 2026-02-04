import { useEffect } from 'react';
import { Toast } from '../hooks/useToast';

interface ToastProviderProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastProvider = ({ toasts, onRemove }: ToastProviderProps) => {
  // Clean up toasts that have been dismissed
  useEffect(() => {
    const timerIds: NodeJS.Timeout[] = [];

    toasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timerId = setTimeout(() => {
          onRemove(toast.id);
        }, toast.duration || 5000);

        timerIds.push(timerId);
      }
    });

    return () => {
      timerIds.forEach(clearTimeout);
    };
  }, [toasts, onRemove]);

  // Determine toast styles based on type
  const getToastStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-accent-600 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-xl shadow-lg max-w-sm w-full ${getToastStyle(toast.type)} animate-slideUp backdrop-blur-sm border border-white/20`}
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1 transition-colors"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};