import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-extrabold text-white">
              V
            </span>
            <span className="font-extrabold">Voca</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('hero.subtitle')}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t('nav.calls')}</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/calls" className="hover:text-brand-600">
                {t('browse.title')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Voca</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Voca. All rights reserved.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400 dark:border-gray-800">
        Powered by <span className="font-semibold text-gray-500 dark:text-gray-300">BIP TECH</span>
      </div>
    </footer>
  );
}
