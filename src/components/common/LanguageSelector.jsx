import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/utils/cn';

export function LanguageSelector({ className, compact = false }) {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        type="button"
        onClick={() => setSelectedLanguage('en')}
        className={cn(
          "rounded-xl border font-semibold transition-all tap-highlight-none min-h-[44px] flex items-center justify-center gap-1.5",
          compact 
            ? "px-2.5 py-1 text-xs min-w-[44px]"
            : "px-3 py-1.5 text-xs sm:text-sm gap-1.5",
          selectedLanguage === 'en'
            ? "border-primary bg-primary/20 text-foreground shadow-glow-cyan"
            : "border-border/50 bg-background/25 text-muted-foreground hover:bg-background/40"
        )}
      >
        {compact ? (
          <span>EN</span>
        ) : (
          <>
            <span>🇬🇧</span>
            <span>English</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => setSelectedLanguage('mr')}
        className={cn(
          "rounded-xl border font-semibold transition-all tap-highlight-none min-h-[44px] flex items-center justify-center gap-1.5",
          compact 
            ? "px-2.5 py-1 text-xs min-w-[44px]"
            : "px-3 py-1.5 text-xs sm:text-sm gap-1.5",
          selectedLanguage === 'mr'
            ? "border-primary bg-primary/20 text-foreground shadow-glow-cyan"
            : "border-border/50 bg-background/25 text-muted-foreground hover:bg-background/40"
        )}
      >
        {compact ? (
          <span>MR</span>
        ) : (
          <>
            <span>🇮🇳</span>
            <span>मराठी</span>
          </>
        )}
      </button>
    </div>
  );
}
