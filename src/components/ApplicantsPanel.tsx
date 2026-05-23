import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApplicants } from '../hooks/queries';
import { useAnnounce, useUpdateApplicationStatus } from '../hooks/mutations';
import { api, extractError } from '../lib/api';
import Modal from './ui/Modal';
import Spinner from './ui/Spinner';
import Avatar from './ui/Avatar';
import Select from './ui/Select';
import { APPLICATION_STATUS_STYLES } from '../lib/constants';
import { formatDate } from '../lib/format';
import type { Application, Call, ApplicationStatus } from '../types';

interface Props {
  call: Call;
  onClose: () => void;
}

export default function ApplicantsPanel({ call, onClose }: Props) {
  const { t, lang } = useLanguage();

  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data: apps = [], isPending } = useApplicants(call.id, {
    status: status || undefined,
    sort,
    search: search || undefined,
  });
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

  const setAppStatus = (app: Application, value: ApplicationStatus) =>
    updateStatus.mutate({ id: app.id, status: value });

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await api.get(`/calls/${call.id}/applicants/export`, {
        params: { status: status || undefined, sort, search: search || undefined },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applicants-call-${call.id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{t('dashboard.applicants')}</h2>
          <p className="text-sm text-gray-500">{call.title}</p>
        </div>
        <button onClick={exportCsv} disabled={exporting || apps.length === 0} className="btn-secondary text-sm">
          {exporting ? <Spinner className="h-4 w-4" /> : `⬇ ${t('applicants.export')}`}
        </button>
      </div>

      {notice && (
        <div className="mb-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          {notice}
        </div>
      )}

      {/* Announce */}
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

      {/* Filters */}
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput);
          }}
          className="sm:col-span-1"
        >
          <input
            className="input"
            placeholder={t('applicants.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <Select
          value={status}
          onChange={setStatus}
          clearable
          clearLabel={t('applicants.allStatuses')}
          placeholder={t('applicants.allStatuses')}
          options={[
            { value: 'pending', label: 'pending' },
            { value: 'accepted', label: 'accepted' },
            { value: 'rejected', label: 'rejected' },
            { value: 'completed', label: 'completed' },
          ]}
        />
        <Select
          value={sort}
          onChange={setSort}
          options={[
            { value: 'newest', label: t('applicants.sortNewest') },
            { value: 'oldest', label: t('applicants.sortOldest') },
            { value: 'name', label: t('applicants.sortName') },
            { value: 'age', label: t('applicants.sortAge') },
            { value: 'status', label: 'status' },
          ]}
        />
      </div>

      {isPending ? (
        <Spinner className="mx-auto my-8 h-7 w-7" />
      ) : apps.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">{t('common.noResults')}</p>
      ) : (
        <div className="max-h-[50vh] space-y-2 overflow-y-auto">
          {apps.map((app) => (
            <ApplicantRow
              key={app.id}
              app={app}
              expanded={expanded === app.id}
              onToggle={() => setExpanded(expanded === app.id ? null : app.id)}
              onStatus={(s) => setAppStatus(app, s)}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

function ApplicantRow({
  app,
  expanded,
  onToggle,
  onStatus,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (s: ApplicationStatus) => void;
}) {
  const { t, lang } = useLanguage();
  const u = app.user;
  const hasDetails = !!(u?.about || u?.education || u?.work_experience || u?.skills);

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={u?.name ?? '?'} src={u?.avatar} size={36} />
          <div>
            <p className="text-sm font-semibold">{u?.name}</p>
            <p className="text-xs text-gray-400">
              {u?.email}
              {u?.age ? ` · ${u.age}` : ''}
              {u?.city ? ` · ${u.city}` : ''}
            </p>
          </div>
        </div>
        <span className={`chip ${APPLICATION_STATUS_STYLES[app.status]}`}>{app.status}</span>
      </div>

      {u?.headline && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{u.headline}</p>}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button onClick={onToggle} className="text-xs font-medium text-brand-600 hover:underline">
          {expanded ? t('applicant.hide') : t('applicant.details')}
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => onStatus('accepted')}
            className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
          >
            Accept
          </button>
          <button
            onClick={() => onStatus('rejected')}
            className="rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
          >
            Reject
          </button>
          <button
            onClick={() => onStatus('completed')}
            className="rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-200"
          >
            Complete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
          {!hasDetails && <p className="text-gray-400">{t('applicant.noInfo')}</p>}
          {u?.about && <Detail label={t('profile.about')} value={u.about} />}
          {u?.education && <Detail label={t('profile.educationDetails')} value={u.education} />}
          {u?.work_experience && <Detail label={t('profile.experience')} value={u.work_experience} />}
          {u?.skills && <Detail label={t('profile.skills')} value={u.skills} />}
          {u?.interests && u.interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {u.interests.map((i) => (
                <span key={i.id} className="chip bg-gray-100 text-gray-500 dark:bg-gray-800">
                  {i.name}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400">
            {u?.phone && <>📞 {u.phone} · </>}
            {u?.linkedin && (
              <a href={u.linkedin} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                LinkedIn
              </a>
            )}
            {' · '}
            {lang === 'cnr' ? 'Prijavljen' : 'Applied'}: {formatDate(app.created_at, lang)}
          </p>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">{value}</p>
    </div>
  );
}
