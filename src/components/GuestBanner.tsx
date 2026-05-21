import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';

// Conversion nudge shown to non-authenticated visitors so they can browse
// freely but are encouraged to register / apply.
export default function GuestBanner() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { openAuth } = useModal();

  if (isAuthenticated) return null;

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-900/40 dark:bg-brand-900/20 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-brand-800 dark:text-brand-200">{t('guest.bannerTitle')}</p>
        <p className="text-sm text-brand-700/80 dark:text-brand-300/80">{t('guest.bannerText')}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => openAuth('login')} className="btn-secondary">
          {t('guest.login')}
        </button>
        <button onClick={() => openAuth('signup')} className="btn-primary">
          {t('guest.register')}
        </button>
      </div>
    </div>
  );
}
