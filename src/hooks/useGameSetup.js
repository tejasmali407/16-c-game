import { useCallback, useMemo, useState } from 'react';
import {
  DEFAULT_PLAYER_COUNT,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from '@/constants/setup';
import { useGame } from '@/context/GameContext';
import { useSettings } from '@/context/SettingsContext';
import { createDraftPlayers, createPlayer } from '@/utils/createPlayer';
import { validateSetup } from '@/utils/validateSetup';

/**
 * Local setup form state, validation, and hand-off to GameContext.
 */
export function useGameSetup() {
  const { setupGame } = useGame();
  const { settings, updateSettings } = useSettings();

  const initialCount = Math.min(
    MAX_PLAYERS,
    Math.max(MIN_PLAYERS, settings.playerCount || DEFAULT_PLAYER_COUNT),
  );

  const [draftPlayers, setDraftPlayers] = useState(() =>
    createDraftPlayers(initialCount),
  );
  const [showErrors, setShowErrors] = useState(false);

  const validation = useMemo(
    () => validateSetup(draftPlayers),
    [draftPlayers],
  );

  const playerCount = draftPlayers.length;
  const canAddPlayer = playerCount < MAX_PLAYERS;
  const canRemovePlayer = playerCount > MIN_PLAYERS;

  const setPlayerCount = useCallback(
    (count) => {
      const next = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count));
      setDraftPlayers((prev) => {
        if (next === prev.length) return prev;
        if (next > prev.length) {
          const added = createDraftPlayers(next - prev.length).map((p, i) => ({
            ...p,
            id: prev.length + i + 1,
          }));
          return [...prev, ...added];
        }
        return prev.slice(0, next).map((p, i) => ({ ...p, id: i + 1 }));
      });
      updateSettings({ playerCount: next });
    },
    [updateSettings],
  );

  const addPlayer = useCallback(() => {
    if (playerCount < MAX_PLAYERS) setPlayerCount(playerCount + 1);
  }, [playerCount, setPlayerCount]);

  const removePlayer = useCallback(
    (id) => {
      if (playerCount <= MIN_PLAYERS) return;
      setDraftPlayers((prev) =>
        prev.filter((p) => p.id !== id).map((p, index) => ({ ...p, id: index + 1 })),
      );
    },
    [playerCount],
  );

  const updatePlayer = useCallback((id, field, value) => {
    setDraftPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }, []);

  const startGame = useCallback(() => {
    const result = validateSetup(draftPlayers);
    setShowErrors(true);
    if (!result.isValid) return false;

    setupGame(draftPlayers.map(createPlayer));
    updateSettings({ playerCount: draftPlayers.length });
    return true;
  }, [draftPlayers, setupGame, updateSettings]);

  return {
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
  };
}
