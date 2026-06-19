import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { SmallText, Body } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';

export function LockedFeatureCard({
  name,
  icon: Icon,
  className,
  index = 0,
}) {
  const { staggerItem } = useMotionConfig();
  const toast = useToast();
  const { t } = useTranslation();

  const handleClick = () => {
    toast.info(t("comingSoon"));
  };

  return (
    <motion.div
      {...staggerItem(index)}
      onClick={handleClick}
      className={cn('locked-feature-card tap-highlight-none cursor-pointer hover:bg-muted/10 transition-colors', className)}
      aria-disabled="true"
    >
      {Icon && (
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}
      <Body className="text-sm font-medium text-foreground/80">{name}</Body>
      <div className="mt-1 flex items-center justify-center gap-1.5 text-accent">
        <Lock className="h-3.5 w-3.5 opacity-80" aria-hidden />
        <SmallText className="font-semibold text-accent">{t("comingSoon")}</SmallText>
      </div>
    </motion.div>
  );
}

