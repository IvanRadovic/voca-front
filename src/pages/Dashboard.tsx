import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import CallForm from '../components/CallForm';
import ApplicantsPanel from '../components/ApplicantsPanel';
import { CALL_TYPE_LABELS } from '../lib/constants';
import { formatDate } from '../lib/format';
import type { Call, NvoStats } from '../types';

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const { t, lang } = useLanguage();

  const [stats, setStats] = useState<NvoStats | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Call | null>(null);
  const [applicantsFor, setApplicantsFor] = useState<Call | null>(null);

  const [intro, setIntro] = useState(user?.nvo?.intro_message ?? '');
  const [introSaved, setIntroSaved] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, callsRes] = await Promise.all([api.get('/nvo/stats'), api.get('/nvo/calls')]);
      setStats(statsRes.data);
      setCalls(callsRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setIntro(user?.nvo?.intro_message ?? '');
  }, [user]);

  const saveIntro = async () => {
    await api.put('/profile/nvo', { intro_message: intro });
    setIntroSaved(true);
    refresh();
    setTimeout(() => setIntroSaved(false), 2000);
  };

  const deleteCall = async (call: Call) => {
    if (!confirm(`${t('dashboard.delete')}: ${call.title}?`)) return;
    await api.delete(`/calls/${call.id}`);
    setCalls((p) => p.filter((c) => c.id !== call.id));
  };

  const onFormSuccess = () => {
    setFormOpen(false);
    setEditing(null);
    loadAll();
  };

  const statCards = stats
    ? [
        { label: t('dashboard.stats.calls'), value: stats.calls_count },
        { label: t('dashboard.stats.applications'), value: stats.applications_count },
        { label: t('dashboard.stats.views'), value: stats.total_views },
        { label: t('dashboard.stats.rating'), value: stats.average_rating || '—' },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-sm text-gray-500">{user?.nvo?.organization_name}</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          + {t('dashboard.newCall')}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-3xl font-extrabold text-brand-600">{s.value}</p>
            <p className="mt-1 text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* My calls table */}
        <div>
          <h2 className="mb-4 text-lg font-bold">{t('dashboard.myCalls')}</h2>
          {loading ? (
            <Spinner className="mx-auto mt-10 h-7 w-7" />
          ) : calls.length === 0 ? (
            <div className="card p-10 text-center text-gray-500">{t('common.noResults')}</div>
          ) : (
            <div className="card divide-y divide-gray-100 dark:divide-gray-800">
              {calls.map((call) => (
                <div key={call.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <Link to={`/calls/${call.id}`} className="font-semibold hover:text-brand-600">
                      {call.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="chip bg-gray-100 text-gray-600 dark:bg-gray-800">
                        {CALL_TYPE_LABELS[call.type][lang]}
                      </span>
                      <span>{call.status}</span>
                      <span>· {call.applications_count ?? 0} {t('dashboard.applicants').toLowerCase()}</span>
                      <span>· {formatDate(call.application_deadline, lang)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setApplicantsFor(call)} className="btn-ghost text-xs">
                      {t('dashboard.applicants')}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(call);
                        setFormOpen(true);
                      }}
                      className="btn-ghost text-xs"
                    >
                      {t('dashboard.edit')}
                    </button>
                    <button onClick={() => deleteCall(call)} className="btn-ghost text-xs text-rose-600">
                      {t('dashboard.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: intro + recent feedback */}
        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-2 font-semibold">{t('dashboard.intro')}</h3>
            <textarea className="input" rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
            <button onClick={saveIntro} className="btn-primary mt-2 w-full text-sm">
              {introSaved ? '✓' : t('profile.save')}
            </button>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-semibold">{t('dashboard.recentFeedback')}</h3>
            {stats && stats.recent_feedbacks.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_feedbacks.map((fb) => (
                  <div key={fb.id} className="border-b border-gray-100 pb-2 last:border-0 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{fb.user?.name}</span>
                      <span className="text-amber-500">{'★'.repeat(fb.rating)}</span>
                    </div>
                    {fb.comment && <p className="text-xs text-gray-500">{fb.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t('common.noResults')}</p>
            )}
          </div>
        </aside>
      </div>

      {/* Create / edit modal */}
      {formOpen && (
        <Modal open onClose={() => setFormOpen(false)} maxWidth="max-w-2xl">
          <h2 className="mb-4 text-lg font-bold">
            {editing ? t('dashboard.edit') : t('dashboard.newCall')}
          </h2>
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <CallForm initial={editing} onSuccess={onFormSuccess} onCancel={() => setFormOpen(false)} />
          </div>
        </Modal>
      )}

      {applicantsFor && <ApplicantsPanel call={applicantsFor} onClose={() => setApplicantsFor(null)} />}
    </div>
  );
}
