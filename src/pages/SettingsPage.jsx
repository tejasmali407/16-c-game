import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Body, SmallText } from '@/components/ui/typography';
import { useSettings } from '@/context/SettingsContext';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useToast } from '@/context/ToastContext';
import { useGame } from '@/context/GameContext';
import { clearLeaderboard } from '@/utils/localStorage';
import { PWAInstallButton } from '@/components/common/PWAInstallButton';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/common/LanguageSelector';

export function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { pageTransition } = useMotionConfig();
  const toast = useToast();
  const { resetGame } = useGame();
  const { t } = useTranslation();

  const handleResetData = () => {
    clearLeaderboard();
    resetGame();
    toast.success(t("toastDataReset"));
  };

  return (
    <motion.div {...pageTransition} className="space-y-6">
      <SectionTitle
        title={t("settings")}
        subtitle={t("customizeExperience")}
        align="center"
      />

      <div className="glass-card space-y-5 p-5 md:p-6">
        <SettingToggle
          label={t("soundEffects")}
          description={t("soundEffectsDesc")}
          checked={settings.soundEnabled}
          onChange={(soundEnabled) => updateSettings({ soundEnabled })}
          t={t}
        />
        <SettingToggle
          label={t("animations")}
          description={t("animationsDesc")}
          checked={settings.animationsEnabled}
          onChange={(animationsEnabled) => updateSettings({ animationsEnabled })}
          t={t}
        />

        <div className="border-t border-border/20 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Body className="font-semibold">{t("language")}</Body>
            <SmallText className="mt-0.5">{t("languageDesc")}</SmallText>
          </div>
          <LanguageSelector />
        </div>

        <div className="border-t border-border/20 pt-4 flex flex-col gap-3">
          <div>
            <Body className="font-semibold">{t("installApp")}</Body>
            <SmallText className="mt-0.5">{t("installAppDesc")}</SmallText>
          </div>
          <PWAInstallButton showFallback={true} />
        </div>

        <div className="border-t border-border/20 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Body className="font-semibold">{t("resetGameData")}</Body>
            <SmallText className="mt-0.5">{t("resetGameDataDesc")}</SmallText>
          </div>
          <AnimatedButton
            type="button"
            variant="danger"
            size="sm"
            onClick={handleResetData}
          >
            {t("reset")}
          </AnimatedButton>
        </div>
      </div>

      <SmallText className="block text-center">
        {t("settingsFooter", { count: settings.playerCount, theme: settings.theme })}
      </SmallText>
    </motion.div>
  );
}

function SettingToggle({ label, description, checked, onChange, t }) {
  return (
    <label className="flex flex-col sm:flex-row cursor-pointer sm:items-center sm:justify-between gap-4">
      <div>
        <Body className="font-semibold">{label}</Body>
        <SmallText className="mt-0.5">{description}</SmallText>
      </div>
      <AnimatedButton
        type="button"
        variant={checked ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        {checked ? t("on") : t("off")}
      </AnimatedButton>
    </label>
  );
}

