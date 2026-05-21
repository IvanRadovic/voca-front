import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import CallCard from '../components/CallCard';
import Spinner from '../components/ui/Spinner';
import type { Call, Category, PlatformStats } from '../types';

const TESTIMONIALS = [
  {
    name: 'Ana, 22',
    en: 'Through Voca I found a coding bootcamp that changed my career path completely.',
    cnr: 'Preko Voca pronašla sam programerski kamp koji mi je potpuno promijenio karijeru.',
  },
  {
    name: 'Marko, 19',
    en: 'I joined a startup weekend and met my future co-founders here.',
    cnr: 'Prijavio sam se na startup vikend i upoznao buduće saradnike.',
  },
  {
    name: 'Jelena, 25',
    en: 'The photography workshop was amazing — easy to find and apply in one click.',
    cnr: 'Radionica fotografije bila je sjajna — lako za pronaći i prijaviti u jednom kliku.',
  },
];

export default function Landing() {
  const { isAuthenticated, isYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { openAuth } = useModal();
  const navigate = useNavigate();

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [latest, setLatest] = useState<Call[]>([]);
  const [recommended, setRecommended] = useState<Call[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, callsRes, catRes] = await Promise.all([
          api.get('/stats'),
          api.get('/calls', { params: { per_page: 8 } }),
          api.get('/categories'),
        ]);
        setStats(statsRes.data);
        setLatest(callsRes.data.data);
        setCategories(catRes.data.data);
        if (isAuthenticated && isYouth) {
          const feed = await api.get('/feed', { params: { per_page: 4 } });
          setRecommended(feed.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, isYouth]);

  const statItems = stats
    ? [
        { label: t('landing.statsNvos'), value: stats.nvos },
        { label: t('landing.statsCalls'), value: stats.calls },
        { label: t('landing.statsYouth'), value: stats.youth },
        { label: t('landing.statsApplications'), value: stats.applications },
      ]
    : [];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-white">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-100">{t('hero.subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!isAuthenticated ? (
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
            ) : (
              <button onClick={() => navigate('/calls')} className="btn bg-white text-brand-700 hover:bg-brand-50">
                {t('hero.browse')}
              </button>
            )}
          </div>

          {stats && (
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {statItems.map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-extrabold">{s.value}</p>
                  <p className="text-sm text-brand-100">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* Categories quick filters */}
        <section className="py-12">
          <h2 className="mb-5 text-xl font-bold">{t('landing.categories')}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/calls?category=${c.slug}`}
                className="chip border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="pb-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('landing.recommended')}</h2>
              <Link to="/calls" className="text-sm font-medium text-brand-600 hover:underline">
                {t('common.viewAll')}
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          </section>
        )}

        {/* Latest */}
        {!loading && latest.length > 0 && (
          <section className="pb-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('landing.latest')}</h2>
              <Link to="/calls" className="text-sm font-medium text-brand-600 hover:underline">
                {t('common.viewAll')}
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="pb-16">
          <h2 className="mb-5 text-xl font-bold">{t('landing.testimonials')}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((tm) => (
              <div key={tm.name} className="card p-6">
                <p className="text-gray-600 dark:text-gray-300">“{lang === 'cnr' ? tm.cnr : tm.en}”</p>
                <p className="mt-4 text-sm font-semibold text-brand-600">{tm.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
