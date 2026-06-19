import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { useMotionConfig } from '@/hooks/useMotionConfig';

const animatedButtonVariants = cva(
  'tap-highlight-none min-h-[44px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border border-primary/40 bg-primary text-primary-foreground shadow-glow-cyan hover:bg-primary/90 hover:shadow-glow-cyan-lg active:bg-primary/80',
        secondary:
          'border border-secondary/40 bg-secondary/90 text-secondary-foreground shadow-glow-purple hover:bg-secondary active:bg-secondary/80',
        success:
          'border border-success/40 bg-success text-success-foreground shadow-glow-success hover:bg-success/90 active:bg-success/80',
        danger:
          'border border-destructive/40 bg-destructive text-destructive-foreground shadow-glow-danger hover:bg-destructive/90 active:bg-destructive/80',
        ghost:
          'border border-transparent bg-transparent text-foreground hover:bg-surface/80 hover:text-primary',
        outline:
          'border border-primary/30 bg-transparent text-primary hover:border-primary/60 hover:bg-primary/10',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-base',
        lg: 'min-h-[3.25rem] px-8 py-3 text-base',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  },
);

const MotionButton = motion.button;

import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/utils/sounds';

export const AnimatedButton = forwardRef(function AnimatedButton(
  {
    children,
    className,
    variant = 'primary',
    size = 'default',
    fullWidth = false,
    disabled,
    type = 'button',
    onClick,
    ...props
  },
  ref,
) {
  const { hoverScale, tapScale } = useMotionConfig();
  const { settings } = useSettings();

  const handleClick = (e) => {
    playSound('click', settings?.soundEnabled);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <MotionButton
      ref={ref}
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : hoverScale}
      whileTap={disabled ? undefined : tapScale}
      className={cn(animatedButtonVariants({ variant, size, fullWidth, className }))}
      onClick={handleClick}
      {...props}
    >
      {children}
    </MotionButton>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export { animatedButtonVariants };
