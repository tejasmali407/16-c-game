import { motion } from 'framer-motion';
import { HeadingMD, SmallText } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useMotionConfig } from '@/hooks/useMotionConfig';

export function SectionTitle({
  title,
  subtitle,
  align = 'left',
  className,
}) {
  const { pageTransition } = useMotionConfig();

  return (
    <motion.header
      {...pageTransition}
      className={cn(
        'space-y-1',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <HeadingMD className="text-gradient-primary">{title}</HeadingMD>
      {subtitle && <SmallText>{subtitle}</SmallText>}
    </motion.header>
  );
}
