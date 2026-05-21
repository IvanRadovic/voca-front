import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import type { TranslationKey } from '../i18n/translations';

export default function HowItWorks() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { openAuth } = useModal();
  const navigate = useNavigate();

  const youthSteps: [TranslationKey, TranslationKey][] = [
    ['how.youth1Title', 'how.youth1Desc'],
    ['how.youth2Title', 'how.youth2Desc'],
    ['how.youth3Title', 'how.youth3Desc'],
    ['how.youth4Title', 'how.youth4Desc'],
  ];
  const nvoSteps: [TranslationKey, TranslationKey][] = [
    ['how.nvo1Title', 'how.nvo1Desc'],
    ['how.nvo2Title', 'how.nvo2Desc'],
    ['how.nvo3Title', 'how.nvo3Desc'],
  ];
  const faqs: [TranslationKey, TranslationKey][] = [
    ['how.faq1Q', 'how.faq1A'],
    ['how.faq2Q', 'how.faq2A'],
    ['how.faq3Q', 'how.faq3A'],
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-brand-50 to-white py-16 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">{t('how.heroTitle')}</h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">{t('how.heroSubtitle')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14">
        {/* For youth */}
        <h2 className="mb-6 text-2xl font-bold">{t('how.youthTitle')}</h2>
        <div className="mb-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {youthSteps.map(([title, desc], i) => (
            <div key={title} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold">{t(title)}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(desc)}</p>
            </div>
          ))}
        </div>

        {/* For NGOs */}
        <h2 className="mb-6 text-2xl font-bold">{t('how.nvoTitle')}</h2>
        <div className="mb-14 grid gap-5 sm:grid-cols-3">
          {nvoSteps.map(([title, desc], i) => (
            <div key={title} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold">{t(title)}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(desc)}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="mb-6 text-2xl font-bold">{t('how.faqTitle')}</h2>
        <div className="mb-14 space-y-3">
          {faqs.map(([q, a]) => (
            <Faq key={q} question={t(q)} answer={t(a)} />
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-brand-600 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-bold">{t('landing.ctaTitle')}</h2>
          <p className="mt-2 text-brand-100">{t('landing.ctaSubtitle')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => navigate('/calls')} className="btn bg-white text-brand-700 hover:bg-brand-50">
                {t('hero.browse')}
              </button>
            ) : (
              <>
                <button onClick={() => openAuth('signup')} className="btn bg-white text-brand-700 hover:bg-brand-50">
                  {t('hero.ctaYouth')}
                </button>
                <button
                  onClick={() => openAuth('nvo')}
                  className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  {t('hero.ctaNvo')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
      >
        {question}
        <span className={`transition ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && <p className="px-5 pb-4 text-sm text-gray-500 dark:text-gray-400">{answer}</p>}
    </div>
  );
}
