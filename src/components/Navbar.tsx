import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';
import Avatar from './ui/Avatar';
import meFlag from 'flag-icons/flags/4x3/me.svg';
import usFlag from 'flag-icons/flags/4x3/us.svg';

export default function Navbar() {
  const { user, isAuthenticated, isNvo, logout } = useAuth();
  const { t, lang, toggle: toggleLang } = useLanguage();
  const { dark, toggle: toggleTheme } = useTheme();
  const { openAuth } = useModal();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition hover:text-brand-600 ${
      isActive ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300'
    }`;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success(t('toast.loggedOut'));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-extrabold text-white">
            V
          </span>
          <span className="text-lg font-extrabold tracking-tight">Voca</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/calls" className={linkClass}>
            {t('nav.calls')}
          </NavLink>
          <NavLink to="/kako-funkcionise" className={linkClass}>
            {t('nav.how')}
          </NavLink>
          <NavLink to="/lider-tabla" className={linkClass}>
            {t('nav.leaderboard')}
          </NavLink>
          {isAuthenticated && isNvo && (
            <NavLink to="/dashboard" className={linkClass}>
              {t('nav.dashboard')}
            </NavLink>
          )}
          {isAuthenticated && !isNvo && (
            <NavLink to="/profile" className={linkClass}>
              {t('nav.profile')}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((p) => !p)} className="flex items-center gap-2">
                <Avatar name={user!.name} src={user!.avatar} size={34} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-48 animate-fade-in rounded-xl border border-gray-100 bg-white py-1 shadow-card dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                      <p className="truncate text-sm font-semibold">{user!.name}</p>
                      <p className="truncate text-xs text-gray-400">{user!.email}</p>
                    </div>
                    <Link
                      to={isNvo ? '/dashboard' : '/profile'}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {isNvo ? t('nav.dashboard') : t('nav.profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => openAuth('login')} className="btn-ghost hidden sm:inline-flex">
                {t('nav.login')}
              </button>
              <button onClick={() => openAuth('signup')} className="btn-primary">
                {t('nav.signup')}
              </button>
            </div>
          )}

          {/* Language + theme toggles, after the auth actions */}
          <button
            onClick={toggleLang}
            className="flex items-center rounded-lg border border-gray-200 p-1 transition hover:border-brand-400 dark:border-gray-700"
            aria-label="Toggle language"
            title={lang === 'cnr' ? 'Crnogorski' : 'English'}
          >
            <img
              src={lang === 'cnr' ? meFlag : usFlag}
              alt={lang === 'cnr' ? 'CNR' : 'EN'}
              className="h-4 w-6 rounded-sm object-cover"
            />
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-gray-200 p-1.5 text-gray-600 transition hover:border-brand-400 dark:border-gray-700 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
