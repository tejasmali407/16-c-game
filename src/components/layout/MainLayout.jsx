import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export function MainLayout() {
  return (
    <ScreenContainer>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </ScreenContainer>
  );
}
