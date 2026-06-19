export function generateCards(players) {
  const deck = [];
  players.forEach((player) => {
    for (let i = 0; i < 4; i++) {
      deck.push({
        id: `${player.chitthiName}-${i}-${Math.random().toString(36).substring(2, 9)}`,
        name: player.chitthiName,
        ownerChitthi: player.chitthiName,
      });
    }
  });
  return deck;
}
