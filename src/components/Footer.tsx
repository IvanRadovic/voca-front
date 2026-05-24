import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();
  const cnr = lang === 'cnr';

  const pages = [
    { to: '/', label: t('nav.home') },
    { to: '/calls', label: t('nav.calls') },
    { to: '/kako-funkcionise', label: t('nav.how') },
    { to: '/mentori', label: t('nav.mentors') },
  ];

  const content = [
    { to: '/resursi', label: t('nav.resources') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/lider-tabla', label: t('nav.leaderboard') },
    { to: '/kalendar', label: t('calendar.title') },
    { to: '/mapa', label: t('map.title') },
  ];

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-extrabold text-white">
              B
            </span>
            <span className="font-extrabold tracking-tight">BIP TECH</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('hero.subtitle')}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">{cnr ? 'Stranice' : 'Pages'}</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            {pages.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">{cnr ? 'Sadržaj' : 'Content'}</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            {content.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">BIP TECH</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {cnr
              ? 'Povezujemo mlade sa prilikama organizacija širom regiona.'
              : 'Connecting young people with opportunities from organizations across the region.'}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400 dark:border-gray-800">
        © {new Date().getFullYear()} BIP TECH. {cnr ? 'Sva prava zadržana.' : 'All rights reserved.'}
      </div>
    </footer>
  );
}
