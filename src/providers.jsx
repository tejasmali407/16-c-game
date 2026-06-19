import { GameProvider } from '@/context/GameContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ToastProvider } from '@/context/ToastContext';
import { PWAInstallProvider } from '@/context/PWAInstallContext';
import { LanguageProvider } from '@/context/LanguageContext';

export function AppProviders({ children }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <ToastProvider>
          <PWAInstallProvider>
            <GameProvider>{children}</GameProvider>
          </PWAInstallProvider>
        </ToastProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
