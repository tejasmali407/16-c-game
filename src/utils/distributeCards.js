export function distributeCards(players, shuffledCards) {
  // Deep copy players and ensure they have an empty cards array
  const newPlayers = players.map((p) => ({ ...p, cards: [] }));
  let currentCardIndex = 0;

  // Distribute exactly 4 cards to each player sequentially
  for (let i = 0; i < newPlayers.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (currentCardIndex < shuffledCards.length) {
        newPlayers[i].cards.push(shuffledCards[currentCardIndex]);
        currentCardIndex++;
      }
    }
  }

  return newPlayers;
}
