import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  const value = { success, error, info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-[80px] md:top-[90px] left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-[90vw] md:max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = 
              toast.type === 'success' 
                ? CheckCircle2 
                : toast.type === 'error' 
                ? AlertCircle 
                : Info;

            const borderClass = 
              toast.type === 'success'
                ? 'border-success/30 bg-success/10 text-success'
                : toast.type === 'error'
                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                : 'border-primary/30 bg-primary/10 text-primary';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
                className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all ${borderClass}`}
              >
                <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
