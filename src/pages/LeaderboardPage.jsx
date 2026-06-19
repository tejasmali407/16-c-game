import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Body, SmallText } from '@/components/ui/typography';
import { getItem, STORAGE_KEYS } from '@/utils/localStorage';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useTranslation } from '@/hooks/useTranslation';

const EMPTY_LEADERBOARD = [];

export function LeaderboardPage() {
  const { pageTransition } = useMotionConfig();
  const { t } = useTranslation();
  const entries = getItem(STORAGE_KEYS.LEADERBOARD, EMPTY_LEADERBOARD);

  return (
    <motion.div {...pageTransition} className="space-y-6">
      <SectionTitle
        title={t('leaderboard')}
        subtitle={t('topPlayers')}
        align="center"
      />

      {entries.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-3 border-dashed py-14 text-center">
          <Medal className="h-12 w-12 text-muted-foreground/50" aria-hidden />
          <Body className="text-muted-foreground">
            {t('noScoresYet')}
          </Body>
        </div>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry, index) => (
            <li
              key={entry.id ?? index}
              className="glass-card flex items-center gap-3 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                <Medal className="h-5 w-5 text-accent" aria-hidden />
              </div>
              <Body className="flex-1 font-semibold">{entry.name}</Body>
              <SmallText>{t('winsCount', { wins: entry.wins })}</SmallText>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
export default LeaderboardPage;
