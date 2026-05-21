import { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import Spinner from './ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';
import { api, extractError } from '../lib/api';
import { EDUCATION_LEVELS } from '../lib/constants';
import type { Category } from '../types';

export default function AuthModal() {
  const { authOpen, authMode, closeAuth, setAuthMode } = useModal();
  const { login, registerYouth, registerNvo } = useAuth();
  const { t, lang } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState<number[]>([]);

  useEffect(() => {
    if (authOpen && categories.length === 0) {
      api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
    }
  }, [authOpen, categories.length]);

  // Reset form whenever the modal mode changes or it is reopened.
  useEffect(() => {
    setForm({});
    setInterests([]);
    setError(null);
  }, [authMode, authOpen]);

  if (!authOpen) return null;

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const toggleInterest = (id: number) =>
    setInterests((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (authMode === 'login') {
        await login(form.email, form.password);
      } else if (authMode === 'signup') {
        await registerYouth({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          city: form.city || null,
          date_of_birth: form.date_of_birth || null,
          education_level: form.education_level || null,
          interests,
        });
      } else {
        await registerNvo({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          organization_name: form.organization_name,
          pib: form.pib || null,
          website: form.website || null,
          description: form.description || null,
        });
      }
      closeAuth();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const title =
    authMode === 'login'
      ? t('auth.loginTitle')
      : authMode === 'signup'
        ? t('auth.signupTitle')
        : t('auth.nvoTitle');

  return (
    <Modal open={authOpen} onClose={closeAuth} maxWidth={authMode === 'login' ? 'max-w-md' : 'max-w-lg'}>
      <h2 className="mb-1 text-xl font-bold">{title}</h2>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Voca</p>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {authMode !== 'login' && (
          <div>
            <label className="label">{authMode === 'nvo' ? t('auth.name') : t('auth.name')}</label>
            <input className="input" required value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} />
          </div>
        )}

        {authMode === 'nvo' && (
          <div>
            <label className="label">{t('auth.orgName')}</label>
            <input
              className="input"
              required
              value={form.organization_name ?? ''}
              onChange={(e) => set('organization_name', e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="label">{t('auth.email')}</label>
          <input
            type="email"
            className="input"
            required
            value={form.email ?? ''}
            onChange={(e) => set('email', e.target.value)}
          />
        </div>

        <div className={authMode === 'login' ? '' : 'grid grid-cols-1 gap-3 sm:grid-cols-2'}>
          <div>
            <label className="label">{t('auth.password')}</label>
            <input
              type="password"
              className="input"
              required
              minLength={8}
              value={form.password ?? ''}
              onChange={(e) => set('password', e.target.value)}
            />
          </div>
          {authMode !== 'login' && (
            <div>
              <label className="label">{t('auth.passwordConfirm')}</label>
              <input
                type="password"
                className="input"
                required
                value={form.password_confirmation ?? ''}
                onChange={(e) => set('password_confirmation', e.target.value)}
              />
            </div>
          )}
        </div>

        {authMode === 'signup' && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t('auth.city')}</label>
                <input className="input" value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('auth.dob')}</label>
                <input
                  type="date"
                  className="input"
                  value={form.date_of_birth ?? ''}
                  onChange={(e) => set('date_of_birth', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">{t('auth.education')}</label>
              <select
                className="input"
                value={form.education_level ?? ''}
                onChange={(e) => set('education_level', e.target.value)}
              >
                <option value="">—</option>
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lang === 'cnr' ? lvl.cnr : lvl.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{t('profile.interests')}</label>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                {categories.map((c) => {
                  const active = interests.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleInterest(c.id)}
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
          </>
        )}

        {authMode === 'nvo' && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t('auth.pib')}</label>
                <input className="input" value={form.pib ?? ''} onChange={(e) => set('pib', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('auth.website')}</label>
                <input
                  className="input"
                  placeholder="https://"
                  value={form.website ?? ''}
                  onChange={(e) => set('website', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">{t('auth.description')}</label>
              <textarea
                className="input"
                rows={3}
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Spinner className="h-4 w-4 text-white" /> : title}
        </button>
      </form>

      {/* Social login placeholders (MVP). */}
      {authMode === 'login' && (
        <div className="mt-4">
          <div className="my-3 flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            {t('auth.socialNote')}
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" disabled className="btn-secondary cursor-not-allowed opacity-60">
              Google
            </button>
            <button type="button" disabled className="btn-secondary cursor-not-allowed opacity-60">
              LinkedIn
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-1 text-center text-sm text-gray-500 dark:text-gray-400">
        {authMode === 'login' ? (
          <>
            <p>
              {t('auth.noAccount')}{' '}
              <button className="font-medium text-brand-600 hover:underline" onClick={() => setAuthMode('signup')}>
                {t('auth.asYouth')}
              </button>
            </p>
            <p>
              <button className="font-medium text-brand-600 hover:underline" onClick={() => setAuthMode('nvo')}>
                {t('auth.asNvo')}
              </button>
            </p>
          </>
        ) : (
          <p>
            {t('auth.haveAccount')}{' '}
            <button className="font-medium text-brand-600 hover:underline" onClick={() => setAuthMode('login')}>
              {t('nav.login')}
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
}
