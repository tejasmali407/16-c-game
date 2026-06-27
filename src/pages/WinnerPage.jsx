import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldAlert, Award, RefreshCw, Home } from 'lucide-react';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { HeadingLG, Body } from '@/components/ui/typography';
import { useGame } from '@/context/GameContext';
import { useGameNavigation } from '@/hooks/useGameNavigation';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useTranslation } from '@/hooks/useTranslation';
import confetti from 'canvas-confetti';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedPlayerName, getLocalizedCardName, getLocalizedLeaderboardName } from '@/utils/localizedDisplay';

export function WinnerPage() {
  const { winner, players, reactions, lastPlayerId, resetRound, resetGame } = useGame();
  const { goHome, goGame } = useGameNavigation();
  const { pageTransition } = useMotionConfig();
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const winnerName = winner ? getLocalizedPlayerName(winner, selectedLanguage) : 'Champion';
  const lastPlayer = players.find((p) => p.id === lastPlayerId);

  // Trigger celebratory double-sided confetti bursts on mount
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    const end = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.8 }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handlePlayAgain = () => {
    resetRound();
    goGame();
  };

  const handleBackHome = () => {
    resetGame();
    goHome();
  };

  const winningCards = winner?.cards ?? [];

  return (
    <motion.div
      {...pageTransition}
      className="relative flex flex-col items-center gap-8 py-8 px-4 text-center md:py-10 max-w-2xl mx-auto min-h-[80vh] select-none"
    >
      {/* Table Spotlight Aura behind Trophy */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-[#FFD54F]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Winner Spotlight Banner & Trophy */}
      <motion.div
        className="glass-card border-4 border-[#FFD54F] bg-[#1F1230] p-6 rounded-3xl relative z-10 shadow-[0_0_50px_rgba(255,213,79,0.3)]"
        initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 90 }}
      >
        <Trophy className="mx-auto h-20 w-20 text-[#FFD54F] md:h-24 md:w-24 animate-bounce filter drop-shadow-[0_4px_10px_rgba(255,213,79,0.5)]" aria-hidden />
      </motion.div>

      {/* Winner Spotlight Info */}
      <div className="space-y-3 z-10">
        <h2 className="text-xs font-black text-[#FF7043] tracking-widest uppercase bg-[#1F1230] px-4 py-1.5 rounded-full border border-[#FF7043]/20 inline-block shadow-inner">
          🏆 WINNER FOUND 🏆
        </h2>
        <HeadingLG className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-[#FFD54F] via-white to-[#FF7043] bg-clip-text select-none filter drop-shadow-md">
          {winnerName}
        </HeadingLG>
        <div className="flex justify-center mt-1">
          {winner?.isRobot ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-black bg-[#FF7043]/15 text-[#FF7043] border border-[#FF7043]/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              🤖 {t('robotOpponent')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-black bg-[#FFD54F]/15 text-[#FFD54F] border border-[#FFD54F]/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              👤 {t('humanChampion')}
            </span>
          )}
        </div>
        {winningCards.length > 0 && (
          <Body className="text-[#FF3D71] font-black tracking-widest uppercase text-xs sm:text-sm mt-1 animate-pulse">
            {t('collectedAllChitthis', { name: getLocalizedCardName(winningCards[0], selectedLanguage) })}
          </Body>
        )}
      </div>

      {/* The 4 Winning Chitthi Cards (Fanned out) */}
      {winningCards.length > 0 && (
        <div className="flex justify-center gap-3 relative z-10 py-2">
          {winningCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ y: 60, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, type: 'spring', damping: 10 }}
              whileHover={{ scale: 1.15, rotate: (idx - 1.5) * 5, zIndex: 10 }}
              className="w-11 h-16 sm:w-16 sm:h-22 md:w-20 md:h-28 rounded-xl bg-card text-card-foreground border-2 border-[#FFD54F] flex items-center justify-center font-black text-xs sm:text-sm shadow-xl select-none cursor-default"
            >
              <span className="p-1 text-center leading-none">{getLocalizedCardName(card, selectedLanguage)}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full relative z-10">
        
        {/* Reaction Speeds Card */}
        <div className="glass-card p-5 text-left border border-white/10 bg-[#1F1230]/75 space-y-4 rounded-2xl shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#FF7043] flex items-center gap-2 border-b border-white/5 pb-2">
            <Award className="h-4 w-4 text-[#FF7043]" />
            {t('reactionSpeed')}
          </h3>
          <ul className="space-y-3">
            {reactions.map((r, index) => (
              <li key={r.playerId} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="font-extrabold text-white flex items-center gap-2">
                  <span className="text-[10px] text-[#D1C4E9] w-4">{index + 1}.</span>
                  {getLocalizedLeaderboardName(r.playerName, selectedLanguage)}
                </span>
                <span className={cn(
                  "font-black text-xs px-2.5 py-0.5 rounded-full border",
                  r.time === 0 
                    ? 'border-[#FFD54F]/30 bg-[#FFD54F]/10 text-[#FFD54F] animate-pulse' 
                    : 'border-white/5 bg-white/5 text-[#D1C4E9]'
                )}>
                  {r.time === 0 ? `0ms (Winner)` : `${r.time}ms`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Slam Penalty and Scoreboard Card */}
        <div className="glass-card p-5 text-left border border-white/10 bg-[#1F1230]/75 flex flex-col justify-between gap-5 rounded-2xl shadow-lg">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF3D71] flex items-center gap-2 border-b border-white/5 pb-2">
              <ShieldAlert className="h-4 w-4 text-[#FF3D71]" />
              {t('slamPenalty')}
            </h3>
            {lastPlayer ? (
              <div className="space-y-1.5 bg-[#FF3D71]/5 border border-[#FF3D71]/20 rounded-xl p-3 shadow-inner">
                <p className="font-black text-[#FF3D71] text-base flex items-center gap-1.5">
                  <span>🤣</span> {t('slackerTitle', { name: getLocalizedPlayerName(lastPlayer, selectedLanguage) })}
                </p>
                <p className="text-xs text-[#D1C4E9] font-medium leading-relaxed">
                  {t('slackerDesc', { time: reactions.find((r) => r.playerId === lastPlayerId)?.time, name: getLocalizedPlayerName(lastPlayer, selectedLanguage) })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#D1C4E9] font-bold">Calculating...</p>
            )}
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FFD54F] mb-3 flex items-center gap-1.5">
              <span>🏆</span> {t('scoreboardTitle')}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-[#120B1A]/40 border border-white/5 rounded-xl p-3 shadow-inner">
              {players.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-[#D1C4E9] font-bold py-0.5 border-b border-white/5 last:border-0">
                  <span className="truncate max-w-[90px]">{getLocalizedPlayerName(p, selectedLanguage)}</span>
                  <span className="font-black text-white shrink-0">
                    🏆 {p.score || 0} / ⚠️ {p.penalties || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons to replay or exit */}
      <div className="flex flex-col sm:flex-row w-full gap-3 relative z-10 justify-center max-w-md mt-4">
        <AnimatedButton 
          variant="primary" 
          fullWidth 
          onClick={handlePlayAgain} 
          className="flex items-center justify-center gap-2 py-4 rounded-full font-black uppercase tracking-wider text-sm shadow-lg border-2 border-[#FFD54F]"
        >
          <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
          {t('playAgain')}
        </AnimatedButton>
        <AnimatedButton 
          variant="secondary" 
          fullWidth 
          onClick={handleBackHome} 
          className="flex items-center justify-center gap-2 py-4 rounded-full font-black uppercase tracking-wider text-sm shadow-lg border-2 border-[#FF7043]"
        >
          <Home className="h-4.5 w-4.5" />
          {t('backToHome')}
        </AnimatedButton>
      </div>
    </motion.div>
  );
}


