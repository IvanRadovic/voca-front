import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModal';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { dark } = useTheme();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={dark ? 'dark' : 'light'}
        toastOptions={{ className: 'font-sans' }}
      />
    </div>
  );
}
