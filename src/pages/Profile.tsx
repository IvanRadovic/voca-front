import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, extractError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import CallCard from '../components/CallCard';
import Spinner from '../components/ui/Spinner';
import { APPLICATION_STATUS_STYLES, EDUCATION_LEVELS } from '../lib/constants';
import { formatDate } from '../lib/format';
import type { Application, Call, Category, Feedback } from '../types';

type Tab = 'profile' | 'applications' | 'wishlist' | 'reviews';

export default function Profile() {
  const { user, setUser, refresh } = useAuth();
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold">{t('profile.title')}</h1>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        {([
          ['profile', t('nav.profile')],
          ['applications', t('profile.myApplications')],
          ['wishlist', t('profile.wishlist')],
          ['reviews', t('profile.myReviews')],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && user && (
        <ProfileForm user={user} onSaved={refresh} setUser={setUser} lang={lang} t={t} />
      )}
      {tab === 'applications' && <ApplicationsTab lang={lang} t={t} />}
      {tab === 'wishlist' && <WishlistTab t={t} />}
      {tab === 'reviews' && <ReviewsTab t={t} lang={lang} />}
    </div>
  );
}

/* -------------------- Profile form -------------------- */

function ProfileForm({ user, onSaved, setUser, lang, t }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [interests, setInterests] = useState<number[]>(user.interests?.map((i: Category) => i.id) ?? []);
  const [form, setForm] = useState({
    name: user.name ?? '',
    city: user.city ?? '',
    date_of_birth: user.date_of_birth ?? '',
    education_level: user.education_level ?? '',
    bio: user.bio ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  const toggle = (id: number) =>
    setInterests((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);
    try {
      const { data } = await api.put('/profile', { ...form, interests });
      setUser(data.data);
      setMsg(lang === 'cnr' ? 'Sačuvano!' : 'Saved!');
      onSaved();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6">
      {msg && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{t('auth.name')}</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('auth.city')}</label>
          <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('auth.dob')}</label>
          <input
            type="date"
            className="input"
            value={form.date_of_birth ?? ''}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t('auth.education')}</label>
          <select
            className="input"
            value={form.education_level ?? ''}
            onChange={(e) => setForm({ ...form, education_level: e.target.value })}
          >
            <option value="">—</option>
            {EDUCATION_LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lang === 'cnr' ? lvl.cnr : lvl.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Bio</label>
        <textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>

      <div>
        <label className="label">{t('profile.interests')}</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = interests.includes(c.id);
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`chip border transition ${
                  active
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-brand-400 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <button className="btn-primary" disabled={saving}>
        {saving ? <Spinner className="h-4 w-4 text-white" /> : t('profile.save')}
      </button>
    </form>
  );
}

/* -------------------- Applications -------------------- */

function ApplicationsTab({ lang, t }: any) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewFor, setReviewFor] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get('/my/applications')
      .then(({ data }) => setApps(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Spinner className="mx-auto mt-10 h-7 w-7" />;
  if (apps.length === 0) return <Empty t={t} />;

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div key={app.id} className="card p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link to={`/calls/${app.call?.id}`} className="font-semibold hover:text-brand-600">
                {app.call?.title}
              </Link>
              <p className="text-xs text-gray-400">{formatDate(app.created_at, lang)}</p>
            </div>
            <span className={`chip ${APPLICATION_STATUS_STYLES[app.status]}`}>{app.status}</span>
          </div>

          {app.status === 'completed' && (
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
              {reviewFor === app.call?.id ? (
                <ReviewForm callId={app.call!.id} onDone={() => { setReviewFor(null); }} lang={lang} t={t} />
              ) : (
                <button
                  onClick={() => setReviewFor(app.call?.id ?? null)}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  {lang === 'cnr' ? 'Ostavi recenziju' : 'Leave a review'}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewForm({ callId, onDone, lang, t }: any) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post(`/calls/${callId}/feedbacks`, { rating, comment });
      onDone();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} className={`text-xl ${n <= rating ? 'text-amber-500' : 'text-gray-300'}`}>
            ★
          </button>
        ))}
      </div>
      <textarea
        className="input"
        rows={2}
        placeholder={lang === 'cnr' ? 'Tvoj komentar…' : 'Your comment…'}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submit} disabled={saving} className="btn-primary">
        {saving ? <Spinner className="h-4 w-4 text-white" /> : t('common.submit')}
      </button>
    </div>
  );
}

/* -------------------- Wishlist -------------------- */

function WishlistTab({ t }: any) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/my/saved')
      .then(({ data }) => setCalls(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mx-auto mt-10 h-7 w-7" />;
  if (calls.length === 0) return <Empty t={t} />;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {calls.map((c) => (
        <CallCard key={c.id} call={c} />
      ))}
    </div>
  );
}

/* -------------------- Reviews -------------------- */

function ReviewsTab({ t, lang }: any) {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/my/feedbacks')
      .then(({ data }) => setReviews(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mx-auto mt-10 h-7 w-7" />;
  if (reviews.length === 0) return <Empty t={t} />;

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="flex items-center justify-between">
            <Link to={`/calls/${r.call?.id}`} className="font-semibold hover:text-brand-600">
              {r.call?.title}
            </Link>
            <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
          </div>
          {r.comment && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>}
          <p className="mt-1 text-xs text-gray-400">{formatDate(r.created_at, lang)}</p>
        </div>
      ))}
    </div>
  );
}

function Empty({ t }: any) {
  return <div className="card p-10 text-center text-gray-500 dark:text-gray-400">{t('common.noResults')}</div>;
}
