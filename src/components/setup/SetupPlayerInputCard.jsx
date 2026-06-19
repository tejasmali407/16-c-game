import { motion } from 'framer-motion';
import { MapPin, Trash2, User } from 'lucide-react';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Body, SmallText } from '@/components/ui/typography';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export function SetupPlayerInputCard({
  player,
  index,
  errors = {},
  showErrors = false,
  canRemove,
  onUpdate,
  onRemove,
}) {
  const { staggerItem } = useMotionConfig();
  const { t } = useTranslation();

  const hasInput = Boolean(player.name.trim() || player.chitthiName.trim());
  const shouldShowErrors = showErrors || hasInput;
  const nameError = shouldShowErrors ? errors.name : undefined;
  const chitthiError = shouldShowErrors ? errors.chitthiName : undefined;

  return (
    <motion.article
      layout
      {...staggerItem(index)}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.25 }}
      className="glass-card overflow-hidden p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20 font-display text-sm font-bold text-secondary">
            {index + 1}
          </span>
          <Body className="font-semibold">
            {t('playerName')} {index + 1}
          </Body>
        </div>

        {canRemove && (
          <AnimatedButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(player.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label={t('removePlayer', { index: index + 1 })}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('remove')}</span>
          </AnimatedButton>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`player-name-${player.id}`} className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" aria-hidden />
            {t('playerName')}
          </Label>
          <Input
            id={`player-name-${player.id}`}
            value={player.name}
            onChange={(e) => onUpdate(player.id, 'name', e.target.value)}
            placeholder={t('enterName')}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? `player-name-error-${player.id}` : undefined}
            autoComplete="off"
          />
          {nameError && (
            <SmallText
              id={`player-name-error-${player.id}`}
              className={cn('text-destructive')}
              role="alert"
            >
              {t(nameError)}
            </SmallText>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`chitthi-name-${player.id}`} className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
            {t('chitthiName')}
          </Label>
          <Input
            id={`chitthi-name-${player.id}`}
            value={player.chitthiName}
            onChange={(e) => onUpdate(player.id, 'chitthiName', e.target.value)}
            placeholder={t('enterChitthi')}
            aria-invalid={Boolean(chitthiError)}
            aria-describedby={chitthiError ? `chitthi-name-error-${player.id}` : undefined}
            autoComplete="off"
          />
          {chitthiError && (
            <SmallText
              id={`chitthi-name-error-${player.id}`}
              className={cn('text-destructive')}
              role="alert"
            >
              {t(chitthiError)}
            </SmallText>
          )}
        </div>
      </div>
    </motion.article>
  );
}
