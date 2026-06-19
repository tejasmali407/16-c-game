import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useMotionConfig } from '@/hooks/useMotionConfig';

export function ScreenContainer({
  children,
  className,
  withMesh = true,
  maxWidth = 'wide',
  ...props
}) {
  const { fadeIn } = useMotionConfig();

  const maxWidthClass = {
    game: 'max-w-game',
    content: 'max-w-content',
    wide: 'max-w-wide',
    full: 'max-w-full',
  }[maxWidth] ?? 'max-w-wide';

  return (
    <motion.div
      {...fadeIn}
      className={cn(
        'bg-game-app relative mx-auto flex min-h-dvh w-full flex-col overflow-x-hidden',
        maxWidthClass,
        className,
      )}
      {...props}
    >
      {withMesh && (
        <>
          <div
            className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse"
            aria-hidden
            style={{ animationDuration: '8s' }}
          />
          <div
            className="pointer-events-none absolute -right-16 top-1/3 h-48 w-48 rounded-full bg-secondary/10 blur-3xl animate-pulse"
            aria-hidden
            style={{ animationDuration: '12s' }}
          />
          <div
            className="pointer-events-none absolute bottom-24 left-1/4 h-40 w-40 rounded-full bg-accent/5 blur-3xl animate-pulse"
            aria-hidden
            style={{ animationDuration: '10s' }}
          />
        </>
      )}

      {/* Floating Light Glow Dots */}
      <div className="particle-container" aria-hidden="true">
        <div className="particle" style={{ '--left': '10%', '--top': '80%', '--size': '180px', '--duration': '15s', '--delay': '0s' }} />
        <div className="particle" style={{ '--left': '85%', '--top': '20%', '--size': '140px', '--duration': '20s', '--delay': '-4s' }} />
        <div className="particle" style={{ '--left': '75%', '--top': '70%', '--size': '200px', '--duration': '25s', '--delay': '-8s' }} />
        <div className="particle" style={{ '--left': '25%', '--top': '15%', '--size': '120px', '--duration': '18s', '--delay': '-2s' }} />
      </div>


      <div className="relative z-10 flex min-h-dvh w-full flex-col px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:py-8">
        {children}
      </div>
    </motion.div>
  );
}
