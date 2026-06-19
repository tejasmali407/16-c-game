import { motion } from 'framer-motion';
import {
  Users,
  Bot,
  Trophy,
  BookOpen,
  Settings,
} from 'lucide-react';
import { HomeMenuCard } from '@/components/home/HomeMenuCard';
import { LockedFeatureCard } from '@/components/common/LockedFeatureCard';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Body } from '@/components/ui/typography';
import { COMING_SOON_FEATURES } from '@/data/comingSoonFeatures';
import { useGameNavigation } from '@/hooks/useGameNavigation';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { useTranslation } from '@/hooks/useTranslation';

const MAIN_MENU = [
  {
    id: 'friends',
    titleKey: 'playWithFriends',
    descKey: 'playWithFriendsDesc',
    icon: Users,
    accent: 'cyan',
    action: 'setup',
  },
  {
    id: 'robot',
    titleKey: 'playWithRobot',
    descKey: 'playWithRobotDesc',
    icon: Bot,
    accent: 'purple',
    action: 'setup',
  },
  {
    id: 'leaderboard',
    titleKey: 'leaderboard',
    descKey: 'leaderboardDesc',
    icon: Trophy,
    accent: 'gold',
    action: 'leaderboard',
  },
  {
    id: 'rules',
    titleKey: 'rules',
    descKey: 'rulesDesc',
    icon: BookOpen,
    accent: 'cyan',
    action: 'rules',
  },
  {
    id: 'settings',
    titleKey: 'settings',
    descKey: 'settingsDesc',
    icon: Settings,
    accent: 'green',
    action: 'settings',
  },
];

export function HomePage() {
  const nav = useGameNavigation();
  const { pageTransition } = useMotionConfig();
  const { t } = useTranslation();

  const handlers = {
    setup: nav.goSetup,
    leaderboard: nav.goLeaderboard,
    rules: nav.goRules,
    settings: nav.goSettings,
  };

  return (
    <motion.div {...pageTransition} className="flex flex-col gap-8 pb-8 md:gap-10">
      {/* Hero */}
      <header className="relative text-center flex flex-col items-center gap-6 pt-4 pb-2">

        {/* Gamified Hero Title */}
        <div className="space-y-3">
          <motion.div
            initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="inline-block"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wider text-[#FFD54F] drop-shadow-[0_4px_10px_rgba(255,213,79,0.3)] filter uppercase select-none flex items-center justify-center gap-3">
              <span className="animate-bounce inline-block">⚡</span>
              <span>16 CHITTHI</span>
              <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>⚡</span>
            </h1>
          </motion.div>
          
          <p className="text-sm sm:text-base font-black tracking-widest text-[#FF7043] uppercase bg-[#1F1230] px-4 py-1.5 rounded-full border border-[#FF7043]/30 inline-block shadow-inner">
            STACK • REACT • WIN
          </p>
        </div>

        {/* Feature badges row */}
        <div className="flex flex-wrap justify-center gap-3 max-w-lg mt-2">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#FF3D71]/15 text-[#FF3D71] border border-[#FF3D71]/30 flex items-center gap-1.5 shadow-sm"
          >
            <span>🔥</span> Fast Reaction Game
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#FFD54F]/15 text-[#FFD54F] border border-[#FFD54F]/30 flex items-center gap-1.5 shadow-sm"
          >
            <span>🎉</span> Multiplayer Party Game
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30 flex items-center gap-1.5 shadow-sm"
          >
            <span>🏆</span> Collect 4 Same Chitthis
          </motion.span>
        </div>

        <Body className="mx-auto mt-2 max-w-md text-[#D1C4E9] font-medium text-sm sm:text-base">
          {t('tagline')}
        </Body>
      </header>

      {/* PWA Install Banner */}
      <PWAInstallButton showFallback={false} />

      {/* Main menu */}
      <section aria-labelledby="home-menu-heading">
        <SectionTitle
          title={t('playNow')}
          subtitle={t('chooseMode')}
          className="mb-4"
        />
        <h2 id="home-menu-heading" className="sr-only">
          Main menu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {MAIN_MENU.map((item, index) => (
            <HomeMenuCard
              key={item.id}
              title={t(item.titleKey)}
              description={t(item.descKey)}
              icon={item.icon}
              accent={item.accent}
              index={index}
              onClick={() => {
                if (item.id === 'robot') {
                  nav.goSetup('robot');
                } else if (item.id === 'friends') {
                  nav.goSetup('friends');
                } else {
                  handlers[item.action]();
                }
              }}
              className={item.id === 'settings' ? 'sm:col-span-2 lg:col-span-1' : undefined}
            />
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section aria-labelledby="coming-soon-heading" className="space-y-4">
        <SectionTitle
          title={t('comingSoon')}
          subtitle={t('comingSoonTitle')}
        />
        <h2 id="coming-soon-heading" className="sr-only">
          Locked features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {COMING_SOON_FEATURES.map((feature, index) => (
            <LockedFeatureCard
              key={feature.id}
              name={feature.name}
              icon={feature.icon}
              index={index + MAIN_MENU.length}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
export default HomePage;
