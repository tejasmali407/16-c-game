import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SplashPage } from '@/pages/SplashPage';
import { HomePage } from '@/pages/HomePage';
import { SetupPage } from '@/pages/SetupPage';
import { GamePage } from '@/pages/GamePage';
import { WinnerPage } from '@/pages/WinnerPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { HowToPlayPage } from '@/pages/HowToPlayPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const ROUTES = {
  SPLASH: '/',
  HOME: '/home',
  SETUP: '/setup',
  GAME: '/game',
  WINNER: '/winner',
  LEADERBOARD: '/leaderboard',
  RULES: '/rules',
  SETTINGS: '/settings',
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.SPLASH} element={<SplashPage />} />

      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SETUP} element={<SetupPage />} />
        <Route path={ROUTES.GAME} element={<GamePage />} />
        <Route path={ROUTES.WINNER} element={<WinnerPage />} />
        <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
        <Route path={ROUTES.RULES} element={<HowToPlayPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
