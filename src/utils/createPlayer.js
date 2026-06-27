/**
 * Build a game-ready player from setup form data.
 */
export function createPlayer({ id, name, displayName, chitthiName, chitthiDisplayName, isRobot = false }) {
  return {
    id,
    name: name.trim(),
    displayName,
    chitthiName: chitthiName.trim(),
    chitthiDisplayName,
    isRobot,
    cards: [],
    score: 0,
    penalties: 0,
    reactionTime: null,
  };
}

/** Create empty draft rows for the setup form. */
export function createDraftPlayers(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: '',
    chitthiName: '',
  }));
}
