import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePublicNvo } from '../hooks/queries';
import CallCard from '../components/CallCard';
import Avatar from '../components/ui/Avatar';
import { PageSpinner } from '../components/ui/Spinner';
import { formatDate } from '../lib/format';

export default function NvoPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { data, isLoading } = usePublicNvo(id);

  if (isLoading) return <PageSpinner />;
  if (!data) return <div className="py-20 text-center text-gray-500">{t('common.noResults')}</div>;

  const { nvo, stats, calls } = data;

  return (
    <div className="animate-fade-in">
      <section className="border-b border-gray-100 bg-gradient-to-b from-brand-50 to-white py-12 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <Avatar name={nvo.organization_name} size={72} />
          <div>
            <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold">
              {nvo.organization_name}
              {nvo.verified && (
                <span className="text-brand-600" title="Verified">
                  ✓
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t('nvo.memberSince')} {formatDate(nvo.member_since, lang)}
            </p>
          </div>
          {nvo.website && (
            <a href={nvo.website} target="_blank" rel="noreferrer" className="text-sm text-brand-600 hover:underline">
              {nvo.website}
            </a>
          )}
          <div className="mt-2 flex gap-8">
            <Stat label={t('landing.statsCalls')} value={stats.calls} />
            <Stat label={t('landing.statsApplications')} value={stats.applications} />
            <Stat label={t('dashboard.stats.rating')} value={stats.average_rating || '—'} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {nvo.description && (
          <div className="mb-10">
            <h2 className="mb-2 text-lg font-bold">{t('nvo.about')}</h2>
            <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">{nvo.description}</p>
          </div>
        )}

        <h2 className="mb-5 text-xl font-bold">{t('nvo.openCalls')}</h2>
        {calls.length === 0 ? (
          <p className="text-sm text-gray-400">{t('common.noResults')}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {calls.map((c) => (
              <CallCard key={c.id} call={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-brand-600">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
