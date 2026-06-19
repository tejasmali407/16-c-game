import { AnimatedButton } from '@/components/common/AnimatedButton';
import { SmallText } from '@/components/ui/typography';
import { usePWAInstall } from '@/context/PWAInstallContext';
import { useTranslation } from '@/hooks/useTranslation';

export function PWAInstallButton({ showFallback = true }) {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const { t } = useTranslation();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <div className="flex flex-col items-center gap-2 w-full text-center">
        <AnimatedButton
          type="button"
          variant="success"
          onClick={installApp}
          className="flex items-center gap-2.5 w-full justify-center min-h-[44px] group"
        >
          <img 
            src="/favicon.svg" 
            onError={(e) => { e.target.onerror = null; e.target.src = "/pwa-192x192.png"; }}
            alt="16 Chitthi Logo" 
            className="h-6 w-6 md:h-7 md:w-7 object-contain aspect-square rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
          <span>{t("playInApp")}</span>
        </AnimatedButton>
      </div>
    );
  }

  if (showFallback) {
    return (
      <div className="rounded-xl border border-border/20 bg-secondary/5 p-4 text-center w-full">
        <SmallText className="text-muted-foreground text-xs leading-normal">
          {t("pwaFallbackMessage")}
        </SmallText>
      </div>
    );
  }

  return null;
}
