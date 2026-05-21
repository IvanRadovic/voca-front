import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApplicants } from '../hooks/queries';
import { useAnnounce, useUpdateApplicationStatus } from '../hooks/mutations';
import { extractError } from '../lib/api';
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
  const { data: apps = [], isPending } = useApplicants(call.id);
  const updateStatus = useUpdateApplicationStatus(call.id);
  const announce = useAnnounce(call.id);

  const [showAnnounce, setShowAnnounce] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const sendAnnouncement = () => {
    setNotice(null);
    announce.mutate(
      { subject, body },
      {
        onSuccess: (data) => {
          setNotice(data.message);
          setSubject('');
          setBody('');
          setShowAnnounce(false);
        },
        onError: (err) => setNotice(extractError(err)),
      },
    );
  };

  const setStatus = (app: Application, status: ApplicationStatus) =>
    updateStatus.mutate({ id: app.id, status });

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
        {showAnnounce ? (
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
              <button onClick={() => setShowAnnounce(false)} className="btn-secondary">
                {t('common.cancel')}
              </button>
              <button onClick={sendAnnouncement} disabled={!subject || !body || announce.isPending} className="btn-primary">
                {announce.isPending ? <Spinner className="h-4 w-4 text-white" /> : t('common.submit')}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAnnounce(true)} className="btn-secondary text-sm">
            {lang === 'cnr' ? '✉ Pošalji obavještenje svima' : '✉ Email all applicants'}
          </button>
        )}
      </div>

      {isPending ? (
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
                    onClick={() => setStatus(app, 'accepted')}
                    className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setStatus(app, 'rejected')}
                    className="rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setStatus(app, 'completed')}
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
