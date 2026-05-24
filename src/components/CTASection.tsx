import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import { CTA_PHOTO } from '../lib/images';

// The shared, identical "ready for your next opportunity" banner used at the
// bottom of every page. Bold gradient + photo overlay + grid + floating blobs.
export default function CTASection() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { openAuth } = useModal();
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500 bg-gradient-animated animate-gradient px-6 py-16 text-center shadow-card-hover sm:px-10">
        <img
          src={CTA_PHOTO}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-grid-light opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 animate-blob bg-accent-400/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 animate-blob bg-sky-300/30 blur-3xl [animation-delay:3s]" aria-hidden />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="animate-fade-up text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t('landing.ctaTitle')}
          </h2>
          <p className="animate-fade-up mt-3 text-lg text-white/85 [animation-delay:100ms]">
            {t('landing.ctaSubtitle')}
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3 [animation-delay:200ms]">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/calls')}
                className="btn bg-white px-7 py-3 text-base font-semibold text-brand-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-50"
              >
                {t('hero.browse')} →
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signup')}
                  className="btn bg-white px-7 py-3 text-base font-semibold text-brand-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-50"
                >
                  {t('hero.ctaYouth')}
                </button>
                <button
                  onClick={() => openAuth('nvo')}
                  className="btn border border-white/40 bg-white/10 px-7 py-3 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  {t('hero.ctaNvo')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
