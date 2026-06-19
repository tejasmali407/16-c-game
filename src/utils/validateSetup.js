import { MIN_PLAYERS } from '@/data/setup';

/**
 * Validate setup form before starting a game.
 * @param {import('@/utils/types').SetupDraftPlayer[]} players
 * @returns {import('@/utils/types').SetupValidationResult}
 */
export function validateSetup(players) {
  const globalErrors = [];
  const playerErrors = {};

  if (players.length < MIN_PLAYERS) {
    globalErrors.push('errMinPlayers');
  }

  const chitthiNameMap = new Map();

  players.forEach((player) => {
    const errors = {};
    const trimmedName = player.name.trim();
    const trimmedChitthi = player.chitthiName.trim();

    if (!trimmedName) {
      errors.name = 'errNameRequired';
    }

    if (!trimmedChitthi) {
      errors.chitthiName = 'errChitthiRequired';
    } else {
      const key = trimmedChitthi.toLowerCase();
      if (chitthiNameMap.has(key)) {
        errors.chitthiName = 'errChitthiUnique';
        const otherId = chitthiNameMap.get(key);
        if (!playerErrors[otherId]?.chitthiName) {
          playerErrors[otherId] = {
            ...playerErrors[otherId],
            chitthiName: 'errChitthiUnique',
          };
        }
      } else {
        chitthiNameMap.set(key, player.id);
      }
    }

    if (Object.keys(errors).length > 0) {
      playerErrors[player.id] = { ...playerErrors[player.id], ...errors };
    }
  });

  return {
    isValid: globalErrors.length === 0 && Object.keys(playerErrors).length === 0,
    globalErrors,
    playerErrors,
  };
}
