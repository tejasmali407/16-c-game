import { robotPlayerNames, robotChitthiNames } from '@/data/robotNames';

export function getLocalizedValue(value, selectedLanguage) {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object') {
    return value[selectedLanguage] || value.en || "";
  }
  return "";
}

export function getLocalizedPlayerName(player, selectedLanguage) {
  if (!player) return "";
  if (player.displayName) {
    return getLocalizedValue(player.displayName, selectedLanguage);
  }
  return player.name;
}

export function getLocalizedCardName(card, selectedLanguage) {
  if (!card) return "";
  if (card.displayName) {
    return getLocalizedValue(card.displayName, selectedLanguage);
  }
  return card.name;
}

export function getLocalizedLeaderboardName(name, selectedLanguage) {
  if (!name) return "";
  const found = robotPlayerNames.find(
    (r) => r.internalName.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (found) {
    return getLocalizedValue(found.displayName, selectedLanguage);
  }
  return name;
}

export function getLocalizedChitthiName(name, selectedLanguage) {
  if (!name) return "";
  const found = robotChitthiNames.find(
    (c) => c.internalName.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (found) {
    return getLocalizedValue(found.displayName, selectedLanguage);
  }
  return name;
}
