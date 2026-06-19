import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMotionConfig } from '@/hooks/useMotionConfig';

export function GameCard({
  card,
  isSelected = false,
  isFaceDown = true,
  onClick,
  className,
  index = 0,
}) {
  const { hoverScale, tapScale, staggerItem } = useMotionConfig();

  return (
    <motion.button
      type="button"
      {...staggerItem(index)}
      whileHover={onClick ? hoverScale : undefined}
      whileTap={onClick ? tapScale : undefined}
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'tap-highlight-none relative aspect-[3/4] w-full rounded-3xl flex items-center justify-center text-center overflow-hidden',
        isFaceDown ? 'game-card-face-down' : 'game-card-face neon-border-cyan',
        isSelected && 'ring-2 ring-accent ring-offset-2 ring-offset-background glow-gold',
        onClick && 'cursor-pointer',
        !onClick && 'cursor-default',
        className,
      )}
      aria-label={card?.label ?? 'Card'}
    >
      <span className="sr-only">{isFaceDown ? 'Face down card' : card?.label}</span>

      {isFaceDown && (
        <div
          className="absolute inset-3 rounded-2xl border border-accent/20 bg-gradient-to-br from-secondary/20 to-transparent"
          aria-hidden
        />
      )}

      {!isFaceDown && card?.label && (
        <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-small font-bold text-card-foreground">
          {card.label}
        </span>
      )}

      {isSelected && (
        <motion.span
          layoutId="card-selected"
          className="absolute -inset-0.5 rounded-3xl border-2 border-accent"
          aria-hidden
        />
      )}
    </motion.button>
  );
}
