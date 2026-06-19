/**
 * Select a card to pass for a robot player.
 * Logic:
 * - Count card names in robot hand.
 * - Keep the most repeated card name.
 * - Pass the card with the lowest count (non-matching).
 * - If all cards are different, pass a random card.
 * 
 * @param {object} robotPlayer
 * @returns {string|null} Card ID to pass
 */
export function chooseCardToPass(robotPlayer) {
  if (!robotPlayer || !robotPlayer.cards || robotPlayer.cards.length === 0) {
    return null;
  }

  // Count occurrences of card names in the hand
  const counts = {};
  robotPlayer.cards.forEach((card) => {
    counts[card.name] = (counts[card.name] || 0) + 1;
  });

  // Find the card name with the highest count (the one the robot wants to collect)
  let maxCount = -1;
  let keepName = '';
  Object.keys(counts).forEach((name) => {
    if (counts[name] > maxCount) {
      maxCount = counts[name];
      keepName = name;
    }
  });

  // Candidates for passing are cards that do not match the collected name
  let candidates = robotPlayer.cards.filter((card) => card.name !== keepName);

  // If all cards in hand are identical, fall back to selecting any card
  if (candidates.length === 0) {
    candidates = robotPlayer.cards;
  }

  // Choose one card from the candidates at random
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex].id;
}
