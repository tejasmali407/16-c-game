import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/localStorage';

const defaultSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  playerCount: 4,
  theme: 'dark',
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...getItem(STORAGE_KEYS.SETTINGS, {}),
  }));

  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      setItem(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
    }),
    [settings, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
