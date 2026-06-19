import { Minus, Plus, Users } from 'lucide-react';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { Body, SmallText } from '@/components/ui/typography';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/data/setup';
import { cn } from '@/utils/cn';

export function PlayerCountSelector({
  count,
  onChange,
  canDecrease,
  canIncrease,
  className,
}) {
  return (
    <div className={cn('glass-card p-4 sm:p-5', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Users className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <Body className="font-semibold">Players</Body>
            <SmallText>
              {MIN_PLAYERS}–{MAX_PLAYERS} players
            </SmallText>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange(count - 1)}
            disabled={!canDecrease}
            aria-label="Decrease player count"
          >
            <Minus className="h-4 w-4" />
          </AnimatedButton>

          <span
            className="flex h-11 min-w-[3rem] items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-display text-xl font-bold text-primary"
            aria-live="polite"
          >
            {count}
          </span>

          <AnimatedButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange(count + 1)}
            disabled={!canIncrease}
            aria-label="Increase player count"
          >
            <Plus className="h-4 w-4" />
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
