import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeadingXL, SmallText } from '@/components/ui/typography';
import { ROUTES } from '@/routes/paths';

const SPLASH_DURATION_MS = 2400;

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.HOME, { replace: true });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-game-app relative flex min-h-dvh items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-game-mesh"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px hsl(var(--primary) / 0.2)', 
              '0 0 48px hsl(var(--primary) / 0.5)', 
              '0 0 20px hsl(var(--primary) / 0.2)'
            ] 
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-2xl bg-surface/40 border border-primary/20 backdrop-blur-md shadow-lg overflow-hidden"
        >
          <img 
            src="/favicon.svg" 
            onError={(e) => { e.target.onerror = null; e.target.src = "/pwa-192x192.png"; }}
            alt="16 Chitthi Logo" 
            className="h-16 w-16 object-contain aspect-square rounded-xl"
          />
        </motion.div>
        <HeadingXL className="text-gradient-primary text-4xl sm:text-5xl">
          16 Chitthi
        </HeadingXL>
        <SmallText className="mt-4 tracking-widest text-primary/80">
          SHUFFLING THE DECK…
        </SmallText>
      </motion.div>
    </div>
  );
}
