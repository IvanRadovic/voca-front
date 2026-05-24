import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';
import Avatar from './ui/Avatar';
import meFlag from 'flag-icons/flags/4x3/me.svg';
import usFlag from 'flag-icons/flags/4x3/us.svg';

function LangButton({ lang, onClick }: { lang: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
  );
}

function ThemeButton({ dark, onClick }: { dark: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isNvo, isYouth, isAdmin, logout } = useAuth();
  const { t, lang, toggle: toggleLang } = useLanguage();
  const { dark, toggle: toggleTheme } = useTheme();
  const { openAuth } = useModal();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Shared nav links for desktop bar + mobile drawer.
  const links = [
    { to: '/calls', label: t('nav.calls') },
    { to: '/kako-funkcionise', label: t('nav.how') },
    { to: '/resursi', label: t('nav.resources') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/mentori', label: t('nav.mentors') },
    { to: '/lider-tabla', label: t('nav.leaderboard') },
    ...(isAuthenticated && isNvo ? [{ to: '/dashboard', label: t('nav.dashboard') }] : []),
    ...(isAuthenticated && isYouth ? [{ to: '/profile', label: t('nav.profile') }] : []),
    ...(isAdmin ? [{ to: '/admin/mentori', label: t('nav.adminMentors') }] : []),
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition hover:text-brand-600 ${
      isActive ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300'
    }`;

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileOpen(false);
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right controls */}
        <div className="hidden items-center gap-2 lg:flex">
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
              <button onClick={() => openAuth('login')} className="btn-ghost">
                {t('nav.login')}
              </button>
              <button onClick={() => openAuth('signup')} className="btn-primary">
                {t('nav.signup')}
              </button>
            </div>
          )}
          <LangButton lang={lang} onClick={toggleLang} />
          <ThemeButton dark={dark} onClick={toggleTheme} />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <Dialog open={mobileOpen} onClose={setMobileOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition duration-200 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="flex w-72 max-w-[82vw] flex-col overflow-y-auto bg-white p-5 shadow-2xl transition duration-300 ease-out data-[closed]:translate-x-full dark:bg-gray-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-extrabold">Voca</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {isAuthenticated && (
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                <Avatar name={user!.name} src={user!.avatar} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user!.name}</p>
                  <p className="truncate text-xs text-gray-400">{user!.email}</p>
                </div>
              </div>
            )}

            {/* Links */}
            <nav className="flex flex-col">
              {links.map((l, i) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={({ isActive }) =>
                    `animate-fade-in rounded-lg px-3 py-2.5 text-[15px] font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="my-4 h-px bg-gray-100 dark:bg-gray-800" />

            {/* Auth actions */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth('login');
                  }}
                  className="btn-secondary"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth('signup');
                  }}
                  className="btn-primary"
                >
                  {t('nav.signup')}
                </button>
              </div>
            )}

            {/* Language + theme */}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
              <span className="text-sm text-gray-500">{lang === 'cnr' ? 'Jezik / Tema' : 'Language / Theme'}</span>
              <div className="flex items-center gap-2">
                <LangButton lang={lang} onClick={toggleLang} />
                <ThemeButton dark={dark} onClick={toggleTheme} />
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  );
}
