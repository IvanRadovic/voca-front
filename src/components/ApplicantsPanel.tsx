import { useEffect, useState } from 'react';
import { api, extractError } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import Modal from './ui/Modal';
import Spinner from './ui/Spinner';
import Avatar from './ui/Avatar';
import { APPLICATION_STATUS_STYLES } from '../lib/constants';
import { formatDate } from '../lib/format';
import type { Application, Call, ApplicationStatus } from '../types';

interface Props {
  call: Call;
  onClose: () => void;
}

export default function ApplicantsPanel({ call, onClose }: Props) {
  const { t, lang } = useLanguage();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [announce, setAnnounce] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get(`/calls/${call.id}/applicants`)
      .then(({ data }) => setApps(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [call.id]);

  const updateStatus = async (app: Application, status: ApplicationStatus) => {
    await api.put(`/applications/${app.id}/status`, { status });
    setApps((p) => p.map((a) => (a.id === app.id ? { ...a, status } : a)));
  };

  const sendAnnouncement = async () => {
    setNotice(null);
    try {
      const { data } = await api.post(`/calls/${call.id}/announce`, { subject, body });
      setNotice(data.message);
      setSubject('');
      setBody('');
      setAnnounce(false);
    } catch (err) {
      setNotice(extractError(err));
    }
  };

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <h2 className="mb-1 text-lg font-bold">{t('dashboard.applicants')}</h2>
      <p className="mb-4 text-sm text-gray-500">{call.title}</p>

      {notice && (
        <div className="mb-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          {notice}
        </div>
      )}

      <div className="mb-4">
        {announce ? (
          <div className="card space-y-2 p-3">
            <input
              className="input"
              placeholder={lang === 'cnr' ? 'Naslov poruke' : 'Subject'}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="input"
              rows={3}
              placeholder={lang === 'cnr' ? 'Poruka svim prijavljenima…' : 'Message to all applicants…'}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setAnnounce(false)} className="btn-secondary">
                {t('common.cancel')}
              </button>
              <button onClick={sendAnnouncement} disabled={!subject || !body} className="btn-primary">
                {t('common.submit')}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAnnounce(true)} className="btn-secondary text-sm">
            {lang === 'cnr' ? '✉ Pošalji obavještenje svima' : '✉ Email all applicants'}
          </button>
        )}
      </div>

      {loading ? (
        <Spinner className="mx-auto my-8 h-7 w-7" />
      ) : apps.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">{t('common.noResults')}</p>
      ) : (
        <div className="max-h-[50vh] space-y-2 overflow-y-auto">
          {apps.map((app) => (
            <div key={app.id} className="card p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={app.user?.name ?? '?'} size={36} />
                  <div>
                    <p className="text-sm font-semibold">{app.user?.name}</p>
                    <p className="text-xs text-gray-400">{app.user?.email}</p>
                  </div>
                </div>
                <span className={`chip ${APPLICATION_STATUS_STYLES[app.status]}`}>{app.status}</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {app.user?.interests?.slice(0, 4).map((i) => (
                    <span key={i.id} className="chip bg-gray-100 text-gray-500 dark:bg-gray-800">
                      {i.name}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400">· {formatDate(app.created_at, lang)}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateStatus(app, 'accepted')}
                    className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app, 'rejected')}
                    className="rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(app, 'completed')}
                    className="rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-200"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
