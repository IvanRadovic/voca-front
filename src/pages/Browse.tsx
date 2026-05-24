import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCalls, useCategories } from '../hooks/queries';
import CallCard from '../components/CallCard';
import GuestBanner from '../components/GuestBanner';
import BrowseViewSwitcher from '../components/BrowseViewSwitcher';
import Select from '../components/ui/Select';
import { PageSpinner } from '../components/ui/Spinner';
import { CALL_TYPES, CALL_TYPE_LABELS } from '../lib/constants';
import { categoryLabel } from '../lib/labels';

export default function Browse() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const { data: categories = [] } = useCategories();

  const type = params.get('type') ?? '';
  const category = params.get('category') ?? '';
  const online = params.get('online') ?? '';
  const search = params.get('search') ?? '';
  const page = Number(params.get('page') ?? 1);

  const [searchInput, setSearchInput] = useState(search);

  const queryParams = useMemo(
    () => ({
      type: type || undefined,
      category: category || undefined,
      online: online || undefined,
      search: search || undefined,
      page,
      per_page: 12,
    }),
    [type, category, online, search, page],
  );

  const { data, isPending, isFetching } = useCalls(queryParams);
  const calls = data?.data ?? [];
  const meta = data?.meta;

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

  const locationOptions = [
    { v: '', l: t('common.all') },
    { v: '1', l: t('common.online') },
    { v: '0', l: lang === 'cnr' ? 'Uživo' : 'In person' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('browse.title')}</h1>
        <BrowseViewSwitcher active="list" />
      </div>

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
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t('browse.filters')}</h2>
            <button onClick={clearFilters} className="text-xs text-brand-600 hover:underline">
              {t('browse.clear')}
            </button>
          </div>

          <div>
            <label className="label">{t('browse.type')}</label>
            <Select
              value={type}
              onChange={(v) => updateParam('type', v)}
              clearable
              clearLabel={t('common.all')}
              placeholder={t('common.all')}
              options={CALL_TYPES.map((ct) => ({ value: ct, label: CALL_TYPE_LABELS[ct][lang] }))}
            />
          </div>

          <div>
            <label className="label">{t('browse.category')}</label>
            <Select
              value={category}
              onChange={(v) => updateParam('category', v)}
              clearable
              clearLabel={t('common.all')}
              placeholder={t('common.all')}
              options={categories.map((c) => ({ value: c.slug, label: categoryLabel(c.slug, lang, c.name) }))}
            />
          </div>

          <div>
            <label className="label">{t('browse.location')}</label>
            <div className="flex gap-2">
              {locationOptions.map((opt) => (
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

        <div>
          {isPending ? (
            <PageSpinner />
          ) : calls.length === 0 ? (
            <div className="card p-12 text-center text-gray-500 dark:text-gray-400">{t('common.noResults')}</div>
          ) : (
            <>
              <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
                {calls.map((call) => (
                  <CallCard key={call.id} call={call} />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button className="btn-secondary" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                    ‹
                  </button>
                  <span className="text-sm text-gray-500">
                    {meta.current_page} / {meta.last_page}
                  </span>
                  <button className="btn-secondary" disabled={page >= meta.last_page} onClick={() => goToPage(page + 1)}>
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
