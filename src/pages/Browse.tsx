import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import CallCard from '../components/CallCard';
import GuestBanner from '../components/GuestBanner';
import Spinner from '../components/ui/Spinner';
import { CALL_TYPES, CALL_TYPE_LABELS } from '../lib/constants';
import type { Call, Category, Paginated } from '../types';

export default function Browse() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();

  const [calls, setCalls] = useState<Call[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<Paginated<Call>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(params.get('search') ?? '');

  const type = params.get('type') ?? '';
  const category = params.get('category') ?? '';
  const online = params.get('online') ?? '';
  const search = params.get('search') ?? '';
  const page = Number(params.get('page') ?? 1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Paginated<Call>>('/calls', {
        params: {
          type: type || undefined,
          category: category || undefined,
          online: online || undefined,
          search: search || undefined,
          page,
          per_page: 12,
        },
      });
      setCalls(data.data);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  }, [type, category, online, search, page]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setParams(new URLSearchParams());
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t('browse.title')}</h1>

      <div className="mb-6">
        <GuestBanner />
      </div>

      <form onSubmit={submitSearch} className="mb-6 flex gap-2">
        <input
          className="input"
          placeholder={t('browse.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          {t('common.search')}
        </button>
      </form>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t('browse.filters')}</h2>
            <button onClick={clearFilters} className="text-xs text-brand-600 hover:underline">
              {t('browse.clear')}
            </button>
          </div>

          <div>
            <label className="label">{t('browse.type')}</label>
            <select className="input" value={type} onChange={(e) => updateParam('type', e.target.value)}>
              <option value="">{t('common.all')}</option>
              {CALL_TYPES.map((ct) => (
                <option key={ct} value={ct}>
                  {CALL_TYPE_LABELS[ct][lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{t('browse.category')}</label>
            <select className="input" value={category} onChange={(e) => updateParam('category', e.target.value)}>
              <option value="">{t('common.all')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{t('browse.location')}</label>
            <div className="flex gap-2">
              {[
                { v: '', l: t('common.all') },
                { v: '1', l: t('common.online') },
                { v: '0', l: lang === 'cnr' ? 'Uživo' : 'In person' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => updateParam('online', opt.v)}
                  className={`chip flex-1 border py-1.5 ${
                    online === opt.v
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : calls.length === 0 ? (
            <div className="card p-12 text-center text-gray-500 dark:text-gray-400">
              {t('common.noResults')}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {calls.map((call) => (
                  <CallCard key={call.id} call={call} />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    className="btn-secondary"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    ‹
                  </button>
                  <span className="text-sm text-gray-500">
                    {meta.current_page} / {meta.last_page}
                  </span>
                  <button
                    className="btn-secondary"
                    disabled={page >= meta.last_page}
                    onClick={() => goToPage(page + 1)}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
