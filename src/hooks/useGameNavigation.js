import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export function useGameNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate(ROUTES.HOME),
    goSetup: (mode) => navigate(mode ? `${ROUTES.SETUP}?mode=${mode}` : ROUTES.SETUP),
    goGame: () => navigate(ROUTES.GAME),
    goWinner: () => navigate(ROUTES.WINNER),
    goLeaderboard: () => navigate(ROUTES.LEADERBOARD),
    goRules: () => navigate(ROUTES.RULES),
    goSettings: () => navigate(ROUTES.SETTINGS),
  };
}
