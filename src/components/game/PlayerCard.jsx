import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedPlayerName } from '@/utils/localizedDisplay';

export function PlayerCard({
  player,
  isActive = false,
  className,
}) {
  const { selectedLanguage } = useLanguage();
  const name = player ? getLocalizedPlayerName(player, selectedLanguage) : 'Player';

  // Deterministic Avatar Assignment
  const getAvatar = () => {
    if (player?.isRobot) return '🤖';
    const HUMAN_AVATARS = ['😎', '🔥', '🎉', '⚡', '🎯', '🚀', '🏆'];
    const idNum = typeof player?.id === 'number' ? player.id : (player?.name || '').length;
    return HUMAN_AVATARS[idNum % HUMAN_AVATARS.length];
  };

  const avatar = getAvatar();
  const cardCount = player?.cards?.length ?? 0;
  const winCount = player?.score ?? 0;
  const penaltyCount = player?.penalties ?? 0;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.06, y: -2 }}
      className={cn(
        'relative flex flex-col items-center gap-1.5 select-none transition-all duration-300',
        isActive && 'scale-110 z-20',
        className
      )}
    >
      {/* Glowing outer ring when active */}
      <div
        className={cn(
          'relative flex h-16 w-16 items-center justify-center rounded-full border-4 bg-[#1F1230] transition-all duration-300 shadow-lg',
          isActive
            ? 'border-[#FFD54F] shadow-[0_0_20px_rgba(255,213,79,0.6)]'
            : 'border-white/15'
        )}
      >
        {/* Avatar Emoji */}
        <span className="text-3xl filter drop-shadow-sm select-none">{avatar}</span>

        {/* Pulsing ring behind the active player */}
        {isActive && (
          <span className="absolute -inset-1 rounded-full border border-[#FFD54F]/40 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: '1.5s' }} />
        )}

        {/* Card Count Badge */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="absolute -right-1.5 -top-1.5 bg-[#FF7043] text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#120B1A] shadow-md"
        >
          {cardCount}
        </motion.div>

        {/* Robot Badge overlay */}
        {player?.isRobot && (
          <div className="absolute -left-1.5 -top-1.5 bg-[#FFD54F] text-[#120B1A] rounded-full p-0.5 border border-[#120B1A] shadow-md">
            <Bot className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Name banner & scores */}
      <div className="text-center w-full flex flex-col items-center">
        <div
          className={cn(
            'bg-[#1F1230]/95 border rounded-full px-2.5 py-0.5 max-w-[85px] sm:max-w-[100px] truncate shadow-md transition-colors',
            isActive ? 'border-[#FFD54F]/40' : 'border-white/10'
          )}
        >
          <span className="text-[10px] sm:text-[11px] font-extrabold text-white block truncate">
            {name}
          </span>
        </div>
        
        {/* Win/Penalty scores */}
        <div className="flex gap-2 justify-center mt-1 text-[9px] font-extrabold text-[#D1C4E9] bg-[#120B1A]/40 px-2 py-0.5 rounded-full border border-white/5 shadow-inner">
          <span className="flex items-center gap-0.5 text-[#FFD54F]">
            🏆 {winCount}
          </span>
          <span className="flex items-center gap-0.5 text-[#FF3D71]">
            ⚠️ {penaltyCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

