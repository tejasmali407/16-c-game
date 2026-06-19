import { motion } from 'framer-motion';
import { Layers, Zap } from 'lucide-react';
import { Body, SmallText } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useMotionConfig } from '@/hooks/useMotionConfig';

export function StackButton({
  label = 'Draw from stack',
  sublabel,
  count = 0,
  onClick,
  disabled = false,
  isWinnerReady = false,
  className,
}) {
  const { hoverScale, tapScale } = useMotionConfig();

  return (
    <div className="relative inline-block">
      {/* Intense pulsing glow rings when winner is found */}
      {isWinnerReady && (
        <>
          <div className="absolute -inset-4 rounded-3xl bg-[#FF7043]/30 blur-xl animate-ping" style={{ animationDuration: '1.2s' }} />
          <div className="absolute -inset-2 rounded-2xl bg-[#FFD54F]/20 blur-md animate-ping" style={{ animationDuration: '0.8s' }} />
        </>
      )}

      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileHover={disabled ? undefined : { ...hoverScale, y: -4 }}
        whileTap={disabled ? undefined : tapScale}
        className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-4 px-8 py-10 transition-all duration-300 select-none cursor-pointer',
          // Golden orange gradient and styling
          isWinnerReady
            ? 'w-60 h-60 border-[#FFD54F] bg-gradient-to-br from-[#FF7043] via-[#FF5722] to-[#FFD54F] text-white shadow-[0_0_50px_rgba(255,112,67,0.8)]'
            : 'w-48 h-48 border-[#FF7043]/30 bg-gradient-to-br from-[#1F1230] via-[#2D1A47] to-[#1F1230] text-[#D1C4E9] shadow-lg hover:border-[#FF7043]/70',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        aria-label={label}
      >
        {/* Shine highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Pulse scale animation */}
        <motion.div
          animate={
            disabled
              ? undefined
              : isWinnerReady
              ? { scale: [1, 1.08, 1] }
              : { y: [0, -4, 0] }
          }
          transition={
            isWinnerReady
              ? { repeat: Infinity, duration: 0.6, ease: 'easeInOut' }
              : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
          }
          className="relative z-10 flex flex-col items-center gap-3"
        >
          <div className="relative">
            <div
              className={cn(
                "absolute -inset-3 rounded-full blur-xl",
                isWinnerReady ? "bg-[#FFD54F]/40" : "bg-[#FF7043]/20"
              )}
              aria-hidden
            />
            <div
              className={cn(
                "relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors",
                isWinnerReady
                  ? "border-[#FFD54F] bg-[#120B1A]/40 text-[#FFD54F]"
                  : "border-[#FF7043]/30 bg-[#FF7043]/10 text-[#FF7043]"
              )}
            >
              {isWinnerReady ? (
                <Zap className="h-9 w-9 text-[#FFD54F]" aria-hidden />
              ) : (
                <Layers className="h-8 w-8 text-[#FF7043]" aria-hidden />
              )}
            </div>
          </div>

          <div className="text-center space-y-1">
            <Body className={cn("font-black tracking-wider uppercase text-lg", isWinnerReady ? "text-white" : "text-white")}>
              {label}
            </Body>
            {sublabel && (
              <SmallText className={cn("text-[10px] font-bold tracking-wide leading-tight", isWinnerReady ? "text-white/95" : "text-[#D1C4E9]/80")}>
                {sublabel}
              </SmallText>
            )}
          </div>
        </motion.div>

        {/* Count badge */}
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#120B1A] bg-[#FFD54F] text-sm font-black text-[#120B1A] shadow-md"
          >
            {count}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
export default StackButton;
