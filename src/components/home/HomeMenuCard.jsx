import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Body, SmallText } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useMotionConfig } from '@/hooks/useMotionConfig';

const accentStyles = {
  cyan: {
    icon: 'bg-primary/15 text-primary neon-border-cyan',
    glow: 'group-hover:shadow-glow-cyan',
  },
  purple: {
    icon: 'bg-secondary/15 text-secondary neon-border-purple',
    glow: 'group-hover:shadow-glow-purple',
  },
  gold: {
    icon: 'bg-accent/15 text-accent neon-border-gold',
    glow: 'group-hover:shadow-glow-gold',
  },
  green: {
    icon: 'bg-success/15 text-success',
    glow: 'group-hover:shadow-glow-success',
  },
};

export function HomeMenuCard({
  title,
  description,
  icon: Icon,
  accent = 'cyan',
  onClick,
  index = 0,
  className,
}) {
  const { staggerItem, hoverScale, tapScale } = useMotionConfig();
  const styles = accentStyles[accent] ?? accentStyles.cyan;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...staggerItem(index)}
      whileHover={hoverScale}
      whileTap={tapScale}
      className={cn('home-menu-card group tap-highlight-none', styles.glow, className)}
    >
      <div className={cn('home-menu-card-icon', styles.icon)}>
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <Body className="font-semibold text-foreground">{title}</Body>
        {description && (
          <SmallText className="mt-0.5 line-clamp-2">{description}</SmallText>
        )}
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden
      />
    </motion.button>
  );
}
