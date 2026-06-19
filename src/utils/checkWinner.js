export function checkWinner(player) {
  if (!player || !player.cards || player.cards.length !== 4) return false;
  
  const firstCardName = player.cards[0].name;
  return player.cards.every((card) => card.name === firstCardName);
}
