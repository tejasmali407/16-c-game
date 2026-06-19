import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, Home, Settings, Trophy, Menu, X } from 'lucide-react';
import { ROUTES } from '@/routes';
import { cn } from '@/utils/cn';
import { useTranslation } from '@/hooks/useTranslation';

const navItems = [
  { to: ROUTES.HOME, key: 'home', icon: Home },
  { to: ROUTES.LEADERBOARD, key: 'leaderboard', icon: Trophy },
  { to: ROUTES.RULES, key: 'rules', icon: BookOpen },
  { to: ROUTES.SETTINGS, key: 'settings', icon: Settings },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = pathname === ROUTES.HOME;

  if (isHome) {
    return null;
  }

  const drawerItems = [
    { to: ROUTES.HOME, label: t('home'), icon: Home },
    { to: ROUTES.LEADERBOARD, label: t('leaderboard'), icon: Trophy },
    { to: ROUTES.RULES, label: t('rules'), icon: BookOpen },
    { to: ROUTES.SETTINGS, label: t('settings'), icon: Settings },
  ];

  return (
    <header className="w-full h-16 md:h-[72px] mb-6 md:mb-8 relative z-50">
      <div
        className="glass-card flex items-center justify-between w-full h-full px-4 md:px-5 lg:px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Section (Left) */}
        <div className="flex-1 md:flex-initial md:min-w-[120px] lg:min-w-[180px] flex justify-start">
          <NavLink
            to={ROUTES.HOME}
            className="flex items-center gap-2 shrink-0 select-none tap-highlight-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl p-1 min-h-[44px]"
            aria-label="16 Chitthi Home"
          >
            <img
              src="/favicon.svg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/pwa-192x192.png';
              }}
              alt="16 Chitthi Logo"
              className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 aspect-square object-contain transition-all duration-200"
            />
            <span className="font-display font-black text-xs tracking-widest uppercase text-white hidden lg:inline-block whitespace-nowrap">
              16 CHITTHI
            </span>
          </NavLink>
        </div>

        {/* Center Links Section (Tablet & Desktop - Centered) */}
        <div className="hidden md:flex items-center justify-center gap-6 xl:gap-8 flex-1 whitespace-nowrap">
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'relative tap-highlight-none flex items-center justify-center gap-2 rounded-xl px-2.5 py-2 lg:px-3 lg:py-2.5 text-small font-semibold transition-all duration-300 min-h-[44px] border border-transparent whitespace-nowrap hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isActive
                    ? 'text-[#FFD54F] bg-[#FFD54F]/10 border-[#FFD54F]/30 shadow-[0_0_15px_rgba(255,213,79,0.25)]'
                    : 'text-muted-foreground hover:bg-surface/80 hover:text-white hover:border-primary/20 hover:shadow-[0_0_15px_rgba(255,213,79,0.15)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-4 w-4 shrink-0 transition-transform duration-200" aria-hidden />
                  <span className="whitespace-nowrap">{t(key)}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#FFD54F] shadow-[0_0_8px_rgba(255,213,79,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Actions Section (Right - Hamburger on Mobile, spacer on Desktop/Tablet to keep center nav centered) */}
        <div className="flex-1 md:flex-initial md:min-w-[120px] lg:min-w-[180px] flex justify-end items-center">
          {/* Mobile Hamburger menu */}
          <div className="md:hidden">
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface/60 border border-white/10 text-white hover:bg-surface/80 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </Dialog.Trigger>

              <AnimatePresence>
                {isOpen && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                      />
                    </Dialog.Overlay>

                    <Dialog.Content asChild>
                      <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-[300px] h-full bg-background/95 border-l border-border/40 p-6 shadow-2xl flex flex-col focus:outline-none"
                      >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between mb-8">
                          <Dialog.Title className="text-heading-md text-white font-extrabold uppercase tracking-wider">
                            Menu
                          </Dialog.Title>
                          <Dialog.Close asChild>
                            <button
                              type="button"
                              aria-label="Close navigation menu"
                              className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface/60 border border-white/10 text-white hover:bg-surface/80 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </Dialog.Close>
                        </div>

                        {/* Accessibility Description */}
                        <Dialog.Description className="sr-only">
                          Navigation menu links
                        </Dialog.Description>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
                          {drawerItems.map(({ to, label, icon: Icon }, index) => {
                            const isActive = pathname === to;
                            return (
                              <NavLink
                                key={`${to}-${index}`}
                                to={to}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  'tap-highlight-none flex items-center gap-3 rounded-xl px-4 py-3.5 text-lg font-bold transition-all duration-200 min-h-[48px] border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:scale-[1.02] active:scale-[0.98]',
                                  isActive
                                    ? 'bg-primary/20 text-[#FFD54F] shadow-[inset_0_0_12px_rgba(255,213,79,0.15)] border-primary/30'
                                    : 'text-muted-foreground hover:bg-surface/80 hover:text-white',
                                )}
                              >
                                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                                <span>{label}</span>
                              </NavLink>
                            );
                          })}
                        </nav>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}


