import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { SmallText } from '@/components/ui/typography';

export function SetupErrorBanner({ errors, show }) {
  if (!show || errors.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={errors.join('|')}
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
        role="alert"
        aria-live="assertive"
      >
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
            <ul className="space-y-1">
              {errors.map((error) => (
                <li key={error}>
                  <SmallText className="font-medium text-destructive">{error}</SmallText>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
