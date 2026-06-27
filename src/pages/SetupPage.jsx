import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Play, UserPlus, Bot, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { SectionTitle } from '@/components/common/SectionTitle';
import { PlayerCountSelector } from '@/components/game/PlayerCountSelector';
import { SetupErrorBanner } from '@/components/game/SetupErrorBanner';
import { SetupPlayerInputCard } from '@/components/game/SetupPlayerInputCard';
import { MIN_PLAYERS } from '@/data/setup';
import { useGameSetup } from '@/hooks/useGameSetup';
import { useGameNavigation } from '@/hooks/useGameNavigation';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useGame } from '@/context/GameContext';
import { createPlayer } from '@/utils/createPlayer';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { robotPlayerNames, robotChitthiNames } from '@/data/robotNames';

export function SetupPage() {
  const [searchParams] = useSearchParams();
  const gameMode = searchParams.get('mode') === 'robot' ? 'robot' : 'friends';
  
  const { goHome, goGame } = useGameNavigation();
  const { pageTransition } = useMotionConfig();
  const { setupGame } = useGame();
  const toast = useToast();
  const { t } = useTranslation();

  // Robot mode state
  const [humanName, setHumanName] = useState('');
  const [humanChitthi, setHumanChitthi] = useState('');
  const [robotCount, setRobotCount] = useState(4);
  const [difficulty, setDifficulty] = useState('medium');

  // Friends mode state and actions
  const {
    draftPlayers,
    playerCount,
    validation,
    showErrors,
    canAddPlayer,
    canRemovePlayer,
    setPlayerCount,
    addPlayer,
    removePlayer,
    updatePlayer,
    startGame,
  } = useGameSetup();

  const handleStartFriends = () => {
    if (startGame()) {
      goGame();
    } else {
      const firstErr = validation.globalErrors[0];
      if (firstErr) {
        toast.error(t(firstErr, { min: MIN_PLAYERS }));
      } else {
        const playerErrIds = Object.keys(validation.playerErrors);
        if (playerErrIds.length > 0) {
          const firstPErr = validation.playerErrors[playerErrIds[0]];
          const msgKey = firstPErr.name || firstPErr.chitthiName;
          toast.error(msgKey ? t(msgKey) : t("errConfigCorrectly"));
        } else {
          toast.error(t("errConfigCorrectly"));
        }
      }
    }
  };

  const handleStartRobot = (e) => {
    e.preventDefault();
    if (!humanName.trim()) {
      toast.error(t("errNameRequired"));
      return;
    }
    if (!humanChitthi.trim()) {
      toast.error(t("errChitthiRequired"));
      return;
    }

    // Filter out human's chitthi name
    const pool = robotChitthiNames.filter(
      (item) => item.internalName.toLowerCase() !== humanChitthi.trim().toLowerCase()
    );

    const playersList = [
      createPlayer({ id: 1, name: humanName, chitthiName: humanChitthi, isRobot: false })
    ];

    for (let i = 1; i <= robotCount - 1; i++) {
      const robotPlayer = robotPlayerNames[i - 1] || { internalName: `Robot ${i}`, displayName: { en: `Robot ${i}`, mr: `रोबोट ${i}` } };
      const robotChitthi = pool[i - 1] || robotChitthiNames[i - 1];

      playersList.push(
        createPlayer({
          id: i + 1,
          name: robotPlayer.internalName,
          displayName: robotPlayer.displayName,
          chitthiName: robotChitthi.internalName,
          chitthiDisplayName: robotChitthi.displayName,
          isRobot: true,
        })
      );
    }

    setupGame({
      players: playersList,
      gameMode: 'robot',
      robotDifficulty: difficulty,
    });
    
    goGame();
  };

  if (gameMode === 'robot') {
    const isRobotValid = humanName.trim().length > 0 && humanChitthi.trim().length > 0;

    return (
      <motion.div {...pageTransition} className="space-y-6 pb-4 md:space-y-8 max-w-xl mx-auto">
        <SectionTitle
          title={t('aiPracticeArena')}
          subtitle={t('aiPracticeArenaDesc')}
          align="center"
        />

        <form onSubmit={handleStartRobot} className="space-y-6">
          <div className="glass-card p-6 border border-border/40 space-y-4 rounded-2xl bg-secondary/5 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('humanProfile')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="human-name" className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {t('yourName')}
                </label>
                <input
                  id="human-name"
                  type="text"
                  placeholder={t('enterName')}
                  value={humanName}
                  onChange={(e) => setHumanName(e.target.value)}
                  className="w-full bg-background/50 border border-border/50 focus:border-accent rounded-xl px-4 py-3 text-foreground outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="human-chitthi" className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {t('yourChitthi')}
                </label>
                <input
                  id="human-chitthi"
                  type="text"
                  placeholder={t('enterChitthi')}
                  value={humanChitthi}
                  onChange={(e) => setHumanChitthi(e.target.value)}
                  className="w-full bg-background/50 border border-border/50 focus:border-accent rounded-xl px-4 py-3 text-foreground outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-border/40 space-y-4 rounded-2xl bg-secondary/5 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent flex items-center gap-2">
              <Bot className="h-4 w-4" />
              {t('robotSettings')}
            </h3>

            {/* Player count selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                {t('totalPlayers', { count: robotCount })}
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[4, 5, 6, 7, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setRobotCount(count)}
                    className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                      robotCount === count
                        ? 'border-accent bg-accent/20 text-foreground glow-gold'
                        : 'border-border/50 bg-background/20 text-muted-foreground hover:bg-background/45'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                {t('aiDifficulty')}
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 rounded-xl border font-bold text-sm uppercase tracking-wider transition-all ${
                      difficulty === level
                        ? level === 'easy'
                          ? 'border-success bg-success/20 text-foreground'
                          : level === 'medium'
                          ? 'border-primary bg-primary/20 text-foreground glow-cyan'
                          : 'border-destructive bg-destructive/20 text-foreground glow-danger'
                        : 'border-border/50 bg-background/20 text-muted-foreground hover:bg-background/45'
                    }`}
                  >
                    {t(level)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <AnimatedButton
              type="button"
              variant="outline"
              fullWidth
              className="sm:w-auto"
              onClick={goHome}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToHome')}
            </AnimatedButton>

            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="sm:w-auto"
            >
              <Play className="h-5 w-5" />
              {t('startBattle')}
            </AnimatedButton>
          </div>
        </form>
      </motion.div>
    );
  }

  // Friends multiplayer setup
  return (
    <motion.div {...pageTransition} className="space-y-6 pb-4 md:space-y-8">
      <SectionTitle
        title={t('createGame')}
        subtitle={t('createGameDesc')}
        align="center"
      />

      <PlayerCountSelector
        count={playerCount}
        onChange={setPlayerCount}
        canDecrease={playerCount > MIN_PLAYERS}
        canIncrease={canAddPlayer}
      />

      {/* Render validation global errors banner with i18n */}
      <SetupErrorBanner 
        errors={validation.globalErrors.map(err => t(err, { min: MIN_PLAYERS }))} 
        show={showErrors} 
      />

      <div className="flex items-center justify-between gap-3">
        <SectionTitle title={t('playersHeading')} subtitle={t('playersAtTable', { count: playerCount })} />
        {canAddPlayer && (
          <AnimatedButton type="button" variant="secondary" size="sm" onClick={addPlayer}>
            <UserPlus className="h-4 w-4" />
            {t('addPlayer')}
          </AnimatedButton>
        )}
      </div>

      <div className="grid gap-4 md:gap-5">
        <AnimatePresence mode="popLayout">
          {draftPlayers.map((player, index) => (
            <SetupPlayerInputCard
              key={player.id}
              player={player}
              index={index}
              errors={validation.playerErrors[player.id]}
              showErrors={showErrors}
              canRemove={canRemovePlayer}
              onUpdate={updatePlayer}
              onRemove={removePlayer}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t border-border/50 bg-background/80 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:flex-row sm:justify-center sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatedButton
          type="button"
          variant="outline"
          fullWidth
          className="sm:w-auto"
          onClick={goHome}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </AnimatedButton>

        <AnimatedButton
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          className="sm:w-auto"
          onClick={handleStartFriends}
        >
          <Play className="h-5 w-5" />
          {t('startGame')}
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}

