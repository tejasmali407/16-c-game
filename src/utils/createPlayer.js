/**
 * Build a game-ready player from setup form data.
 */
export function createPlayer({ id, name, chitthiName, isRobot = false }) {
  return {
    id,
    name: name.trim(),
    chitthiName: chitthiName.trim(),
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
