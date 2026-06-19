import { useSettings } from '@/context/SettingsContext';

const reduced = {
  pageTransition: {},
  hoverScale: {},
  tapScale: {},
  staggerItem: () => ({}),
  fadeIn: { initial: { opacity: 1 }, animate: { opacity: 1 } },
};

export function useMotionConfig() {
  const { settings } = useSettings();
  const enabled = settings.animationsEnabled;

  if (!enabled) return reduced;

  return {
    pageTransition: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.35 },
    },
    hoverScale: { scale: 1.02 },
    tapScale: { scale: 0.97 },
    staggerItem: (index) => ({
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.06, duration: 0.35, ease: 'easeOut' },
    }),
  };
}
