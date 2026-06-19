import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/components/game/GameCard';
import { PlayerCard } from '@/components/game/PlayerCard';
import { StackButton } from '@/components/game/StackButton';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { useGame } from '@/context/GameContext';
import { useGameNavigation } from '@/hooks/useGameNavigation';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { chooseCardToPass } from '@/utils/robotAI';
import { Brain, Bot, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/cn';

// Helper to determine seat positions around the virtual table (percentage values for left/top)
// Assumes a relative container, centering each player bubble using translate(-50%, -50%)
function getPlayerPositions(count) {
  if (count === 4) {
    return [
      { left: '50%', top: '86%' },  // P0 - Bottom Center (Human/Active Player)
      { left: '12%', top: '50%' },  // P1 - Left Mid
      { left: '50%', top: '14%' },  // P2 - Top Center
      { left: '88%', top: '50%' },  // P3 - Right Mid
    ];
  }
  
  if (count === 5) {
    return [
      { left: '50%', top: '86%' },  // P0 - Bottom Center
      { left: '12%', top: '60%' },  // P1 - Bottom-Left
      { left: '22%', top: '22%' },  // P2 - Top-Left
      { left: '78%', top: '22%' },  // P3 - Top-Right
      { left: '88%', top: '60%' },  // P4 - Bottom-Right
    ];
  }
  
  if (count === 6) {
    return [
      { left: '50%', top: '86%' },  // P0 - Bottom Center
      { left: '12%', top: '65%' },  // P1 - Bottom-Left
      { left: '18%', top: '26%' },  // P2 - Top-Left
      { left: '50%', top: '14%' },  // P3 - Top Center
      { left: '82%', top: '26%' },  // P4 - Top-Right
      { left: '88%', top: '65%' },  // P5 - Bottom-Right
    ];
  }
  
  if (count === 7) {
    return [
      { left: '50%', top: '86%' },  // P0 - Bottom Center
      { left: '14%', top: '68%' },  // P1
      { left: '12%', top: '38%' },  // P2
      { left: '32%', top: '16%' },  // P3
      { left: '68%', top: '16%' },  // P4
      { left: '88%', top: '38%' },  // P5
      { left: '86%', top: '68%' },  // P6
    ];
  }
  
  if (count === 8) {
    return [
      { left: '50%', top: '86%' },  // P0 - Bottom Center
      { left: '20%', top: '76%' },  // P1
      { left: '12%', top: '48%' },  // P2
      { left: '20%', top: '20%' },  // P3
      { left: '50%', top: '14%' },  // P4
      { left: '80%', top: '20%' },  // P5
      { left: '88%', top: '48%' },  // P6
      { left: '80%', top: '76%' },  // P7
    ];
  }
  
  // Fallback: Mathematical Circle Distribution
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (90 + (i * 360) / count) * (Math.PI / 180);
    const rx = 38;
    const ry = 36;
    const left = `${50 + rx * Math.cos(angle)}%`;
    const top = `${50 + ry * Math.sin(angle)}%`;
    positions.push({ left, top });
  }
  return positions;
}

export function GamePage() {
  const { 
    players, 
    currentPlayerIndex, 
    gameStatus, 
    winner,
    selectedCardId,
    reactions,
    gameMode,
    robotDifficulty,
    startGame,
    selectCard,
    passCard,
    startReactionPhase,
    recordReaction,
    pendingCard,
  } = useGame();
  
  const { goHome, goWinner } = useGameNavigation();
  const { pageTransition } = useMotionConfig();
  const { t } = useTranslation();
  
  const activePlayer = players[currentPlayerIndex];
  const [isHandRevealed, setIsHandRevealed] = useState(false);

  // States for Card Pass flying animation
  const [animatingCard, setAnimatingCard] = useState(null);
  const prevIndexRef = useRef(currentPlayerIndex);
  const prevPendingCardRef = useRef(pendingCard);

  // Reset hand reveal status when the turn changes
  useEffect(() => {
    setIsHandRevealed(false);
  }, [currentPlayerIndex]);

  // Auto-start the game when entering the page if in setup state
  useEffect(() => {
    if (gameStatus === 'setup') {
      startGame();
    }
  }, [gameStatus, startGame]);

  // Navigate to WinnerPage when game is over
  useEffect(() => {
    if (gameStatus === 'gameOver') {
      goWinner();
    }
  }, [gameStatus, goWinner]);

  // Intercept changes to pendingCard to trigger card passing animation
  useEffect(() => {
    if (pendingCard && pendingCard.id !== prevPendingCardRef.current?.id && players.length > 0) {
      const senderIndex = prevIndexRef.current;
      const receiverIndex = currentPlayerIndex;
      
      setAnimatingCard({
        card: pendingCard,
        senderIndex,
        receiverIndex,
        id: Date.now(),
      });
      
      const timer = setTimeout(() => {
        setAnimatingCard(null);
      }, 700);
      
      prevPendingCardRef.current = pendingCard;
      prevIndexRef.current = currentPlayerIndex;
      return () => clearTimeout(timer);
    }
    
    prevIndexRef.current = currentPlayerIndex;
    prevPendingCardRef.current = pendingCard;
  }, [pendingCard, currentPlayerIndex, players.length]);

  // Robot Turn Automation
  useEffect(() => {
    if (gameStatus !== 'playing' || gameMode !== 'robot') return;

    const botPlayer = players[currentPlayerIndex];
    if (botPlayer && botPlayer.isRobot) {
      const cardId = chooseCardToPass(botPlayer);
      if (cardId) {
        const delay = Math.floor(Math.random() * 700) + 1100; // Delay to allow player transitions
        const timer = setTimeout(() => {
          passCard(cardId);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [gameStatus, gameMode, currentPlayerIndex, players, passCard]);

  // Robot Winner Auto Stack (winnerReady -> reaction)
  useEffect(() => {
    if (gameStatus !== 'winnerReady' || gameMode !== 'robot') return;

    if (winner && winner.isRobot) {
      const delay = Math.floor(Math.random() * 600) + 1200;
      const timer = setTimeout(() => {
        startReactionPhase();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, gameMode, winner, startReactionPhase]);

  // Ref to always access the latest recordReaction callback without rebuilding the timers
  const recordReactionRef = useRef(recordReaction);
  useEffect(() => {
    recordReactionRef.current = recordReaction;
  }, [recordReaction]);

  // Robot Reaction Auto Slam (reaction phase)
  useEffect(() => {
    if (gameStatus !== 'reaction' || gameMode !== 'robot') return;

    const activeTimers = [];

    players.forEach((player) => {
      if (!player.isRobot) return;
      if (player.id === winner?.id) return; // Winner already reacted (0ms)

      let minDelay = 800;
      let maxDelay = 1800;
      if (robotDifficulty === 'easy') {
        minDelay = 1500;
        maxDelay = 3000;
      } else if (robotDifficulty === 'hard') {
        minDelay = 300;
        maxDelay = 1000;
      }

      const reactionDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
      
      const timer = setTimeout(() => {
        recordReactionRef.current(player.id);
      }, reactionDelay);

      activeTimers.push(timer);
    });

    return () => {
      activeTimers.forEach((t) => clearTimeout(t));
    };
  }, [gameStatus, gameMode, players, winner, robotDifficulty]);

  const handlePass = () => {
    if (selectedCardId) {
      passCard(selectedCardId);
    }
  };

  if (gameStatus === 'setup' || gameStatus === 'shuffling') {
    return (
      <motion.div {...pageTransition} className="flex flex-col items-center justify-center space-y-8 py-20 min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <StackButton count={16} label={t('shufflingTitle')} disabled />
        </motion.div>
        <p className="text-lg font-black text-[#FFD54F] animate-pulse tracking-wider">
          {t('shufflingDesc')}
        </p>
      </motion.div>
    );
  }

  // Reaction Phase Screen Overlay (high stakes UI)
  if (gameStatus === 'reaction') {
    return (
      <motion.div {...pageTransition} className="space-y-6 max-w-lg mx-auto px-4 py-4 text-center relative">
        {/* Flashing Vignette for tension */}
        <div className="absolute inset-0 bg-[#FF3D71]/5 border-4 border-[#FF3D71]/20 animate-pulse pointer-events-none z-50 rounded-2xl" style={{ animationDuration: '0.8s' }} />

        <div className="text-center space-y-2 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#FF3D71] tracking-wider uppercase animate-bounce drop-shadow-[0_4px_8px_rgba(255,61,113,0.3)]">
            {t('slamStack')}
          </h2>
          <p className="text-[#D1C4E9] text-xs max-w-sm mx-auto font-bold">
            {t('slamStackDesc', { winner: winner?.name })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 relative z-10">
          {players.map((p) => {
            const reaction = reactions.find((r) => r.playerId === p.id);
            const isWinner = p.id === winner?.id;

            return (
              <motion.div
                key={p.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "glass-card p-4 border-2 flex flex-col items-center justify-between min-h-[160px] gap-3 rounded-2xl relative overflow-hidden transition-all duration-300",
                  reaction
                    ? isWinner
                      ? 'border-[#FFD54F] bg-[#FFD54F]/10 shadow-[0_0_15px_rgba(255,213,79,0.3)]'
                      : 'border-[#00E676] bg-[#00E676]/10 shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                    : 'border-[#FF3D71]/40 bg-[#FF3D71]/5 shadow-[inset_0_0_10px_rgba(255,61,113,0.1)]'
                )}
              >
                <div className="text-center">
                  <h3 className="font-extrabold text-sm text-white flex items-center justify-center gap-1.5">
                    {p.isRobot ? <Bot className="h-4 w-4 text-[#FF7043]" /> : <User className="h-4 w-4 text-[#FFD54F]" />}
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-[#D1C4E9] font-bold mt-0.5">
                    {isWinner ? t('victory').replace('!', '') : p.isRobot ? 'Robot' : 'Human'}
                  </p>
                </div>

                {reaction ? (
                  <div className="text-center py-1">
                    <p className="text-[#00E676] font-black text-lg animate-pulse uppercase tracking-wider">
                      {t('stacked')}
                    </p>
                    <p className="text-[10px] text-[#D1C4E9] font-bold mt-1">
                      {isWinner ? `0ms` : `${reaction.time}ms`} (Order: #{reaction.order})
                    </p>
                  </div>
                ) : p.isRobot ? (
                  <div className="flex flex-col items-center justify-center py-2 gap-2 text-center w-full">
                    <span className="text-[10px] text-[#D1C4E9] font-bold animate-pulse">{t('aiReacting')}</span>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => recordReaction(p.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-xl border-2 border-[#FFD54F] bg-gradient-to-r from-[#FF7043] to-[#FFD54F] hover:from-[#FF8C66] hover:to-[#FFE082] font-black text-white text-base tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all select-none"
                  >
                    {t('stack')}
                  </motion.button>
                )}

                <div className="text-[9px] text-[#D1C4E9] font-bold">
                  {reaction ? '✅ DONE' : '⏳ WAITING'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }
  const isWinnerState = gameStatus === 'winnerReady';
  const winningCards = winner?.cards ?? [];

  return (
    <motion.div {...pageTransition} className="space-y-4 sm:space-y-6 flex flex-col justify-between min-h-[82vh]">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 sm:pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            {t('gameBoard')}
          </h2>
          <p className="text-[10px] sm:text-xs font-semibold text-[#D1C4E9]">
            {isWinnerState 
              ? t('matchCompleted')
              : t('turn', { name: activePlayer?.name ?? 'Player' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {gameMode === 'robot' && (
            <span className={cn(
              "text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shadow-sm",
              robotDifficulty === 'easy' 
                ? 'border-[#00E676]/30 bg-[#00E676]/15 text-[#00E676]' 
                : robotDifficulty === 'medium'
                ? 'border-[#FFD54F]/30 bg-[#FFD54F]/15 text-[#FFD54F]'
                : 'border-[#FF3D71]/30 bg-[#FF3D71]/15 text-[#FF3D71]'
            )}>
              AI: {t(robotDifficulty)}
            </span>
          )}
          <AnimatedButton variant="ghost" size="sm" onClick={goHome} className="text-[10px] sm:text-xs font-extrabold text-[#D1C4E9] hover:text-white border border-white/10 hover:border-white/20 bg-white/5 rounded-full px-3 sm:px-4 py-1 min-h-[36px]">
            {t('exit')}
          </AnimatedButton>
        </div>
      </div>

      {/* Unified Circular Virtual Game Table Container */}
      <div className="relative w-full aspect-square max-w-[270px] min-[360px]:max-w-[315px] min-[390px]:max-w-[345px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[600px] mx-auto bg-gradient-to-b from-[#1F1230]/20 to-[#120B1A]/20 rounded-full border border-white/5 p-2 flex items-center justify-center overflow-visible select-none my-2">
        
        {/* Glowing aura around table */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD54F]/5 to-transparent blur-2xl pointer-events-none" />
        
        {/* The Circular Virtual Table */}
        <div className="virtual-table">
          
          <div className="flex flex-col items-center justify-center w-full h-full p-1 select-none">
            {isWinnerState ? (
              <div className="flex flex-col items-center z-30 scale-[0.68] sm:scale-85 md:scale-100">
                {/* Large active STACK button when card set matches */}
                <StackButton 
                  count={0} 
                  label={t('stack')} 
                  sublabel={winner?.isRobot ? t('robotAutoStacking') : `${winner?.name}`} 
                  onClick={winner?.isRobot ? undefined : startReactionPhase}
                  disabled={winner?.isRobot}
                  isWinnerReady={true}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center z-20 scale-[0.68] sm:scale-85 md:scale-100">
                {/* Decorative card deck stack with turn status integrated in sublabel */}
                <StackButton 
                  count={16} 
                  label="16 CHITTHI" 
                  sublabel={
                    activePlayer?.isRobot 
                      ? `${activePlayer.name} Thinking...` 
                      : t('turn', { name: activePlayer?.name ?? 'Player' })
                  } 
                  disabled 
                />
              </div>
            )}
          </div>
        </div>

        {/* Players Seats absolutely positioned around the table perimeter */}
        {players.map((p, idx) => {
          const isCurrent = idx === currentPlayerIndex;
          const coords = getPlayerPositions(players.length)[idx] || { left: '50%', top: '50%' };
          
          return (
            <div
              key={p.id}
              className="player-seat-wrapper"
              style={{
                left: coords.left,
                top: coords.top,
              }}
            >
              <PlayerCard 
                player={p} 
                isActive={isCurrent} 
              />
            </div>
          );
        })}

        {/* Card Passing Flying Travel Animation */}
        <AnimatePresence>
          {animatingCard && (
            <motion.div
              key={animatingCard.id}
              initial={getPlayerPositions(players.length)[animatingCard.senderIndex]}
              animate={getPlayerPositions(players.length)[animatingCard.receiverIndex]}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute w-10 h-14 sm:w-16 sm:h-22 rounded-lg bg-card text-card-foreground border-2 border-[#FFD54F] flex items-center justify-center font-bold text-[9px] sm:text-xs shadow-[0_0_15px_rgba(255,213,79,0.5)] z-50 pointer-events-none"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-center font-black select-none leading-none p-1">
                {animatingCard.card.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Player Hand Row */}
      {activePlayer && !isWinnerState && (() => {
        const isSecretMode = gameMode === 'friends' && !activePlayer.isRobot;
        return (
          <div className="space-y-3 sm:space-y-4 rounded-2xl border border-white/5 bg-[#1F1230]/40 p-3 sm:p-5 shadow-inner relative z-10">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide">
                {activePlayer.name}'s Hand
              </h3>
              <div className="flex items-center gap-2">
                {isSecretMode && isHandRevealed && (
                  <button
                    type="button"
                    onClick={() => setIsHandRevealed(false)}
                    className="text-[10px] border border-white/10 bg-[#1F1230] hover:bg-white/5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[#D1C4E9] transition-all font-bold"
                  >
                    {t('hideHand')}
                  </button>
                )}
                <span className={cn(
                  "text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  activePlayer.isRobot 
                    ? 'border-[#FF7043]/20 bg-[#FF7043]/5 text-[#FF7043]' 
                    : 'border-[#FFD54F]/20 bg-[#FFD54F]/5 text-[#FFD54F]'
                )}>
                  {activePlayer.isRobot ? t('opponentAISecret') : t('secretHandPassPlay')}
                </span>
              </div>
            </div>

            {activePlayer.isRobot ? (
              <div className="flex flex-col items-center py-6 sm:py-8 gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-[#FF7043]/20 blur-md animate-pulse" />
                  <div className="animate-spin inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full border-t-2 border-[#FF7043] border-r-2" />
                </div>
                <span className="text-[#FF7043] font-bold text-[10px] sm:text-xs animate-pulse flex items-center gap-1.5 uppercase tracking-wide">
                  <Brain className="h-4 w-4" />
                  {t('aiChoosing')}
                </span>
              </div>
            ) : isSecretMode && !isHandRevealed ? (
              <div className="flex flex-col items-center py-4 sm:py-6 gap-3 sm:gap-4 w-full">
                <div className="grid grid-cols-2 gap-3 w-full md:grid-cols-3 lg:grid-cols-4 opacity-40 pointer-events-none">
                  {activePlayer.cards?.map((card, index) => (
                    <GameCard 
                      key={card.id} 
                      card={{ label: card.name }} 
                      isFaceDown={true} 
                      index={index} 
                    />
                  ))}
                </div>
                <AnimatedButton 
                  variant="primary" 
                  onClick={() => setIsHandRevealed(true)}
                  className="mt-1 font-black uppercase tracking-wider text-xs rounded-full shadow-lg min-h-[44px]"
                >
                  {t('revealHand')}
                </AnimatedButton>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="grid grid-cols-2 gap-3 w-full md:grid-cols-3 lg:grid-cols-4">
                  {activePlayer.cards?.map((card, index) => {
                    const isSelected = card.id === selectedCardId;
                    return (
                      <GameCard 
                        key={card.id} 
                        card={{ label: card.name }} 
                        isSelected={isSelected}
                        isFaceDown={false} 
                        onClick={() => selectCard(card.id)}
                        index={index} 
                      />
                    );
                  })}
                </div>
                
                <button
                  type="button"
                  onClick={handlePass}
                  disabled={!selectedCardId}
                  className={cn(
                    "px-8 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 border shadow-md min-h-[40px] w-full max-w-[200px] mt-1",
                    selectedCardId
                      ? "bg-[#FF7043] border-[#FFD54F] text-white shadow-[#FF7043]/30 animate-pulse cursor-pointer"
                      : "bg-[#1F1230] border-white/10 text-[#D1C4E9]/50 cursor-not-allowed"
                  )}
                >
                  {t('passCard')}
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Active Player Hand on Winner State (Locked View) */}
      {activePlayer && isWinnerState && (
        <div className="space-y-3 sm:space-y-4 rounded-2xl border border-white/5 bg-[#1F1230]/20 p-3 sm:p-5 opacity-75 relative z-10">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-extrabold text-[#D1C4E9] text-xs sm:text-sm uppercase tracking-wide">
              {activePlayer.name}'s Hand ({t('locked')})
            </h3>
            <span className="text-[9px] sm:text-[10px] font-black text-[#FF3D71] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#FF3D71]/20 bg-[#FF3D71]/5">
              {t('gamePaused')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:grid-cols-3 lg:grid-cols-4">
            {activePlayer.cards?.map((card, index) => (
              <GameCard 
                key={card.id} 
                card={{ label: card.name }} 
                isFaceDown={false} 
                index={index} 
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default GamePage;
