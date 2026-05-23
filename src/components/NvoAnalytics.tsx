import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useNvoAnalytics } from '../hooks/queries';
import Spinner from './ui/Spinner';
import Select from './ui/Select';

const BRAND = '#0284c7';
const ACCENT = '#f97316';

export default function NvoAnalytics() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState(6);
  const { data, isPending } = useNvoAnalytics(period);

  const periodOptions = [3, 6, 12].map((p) => ({ value: String(p), label: `${p} ${t('analytics.months')}` }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t('dashboard.analytics')}</h2>
        <div className="w-40">
          <Select value={String(period)} onChange={(v) => setPeriod(Number(v))} options={periodOptions} />
        </div>
      </div>

      {isPending || !data ? (
        <Spinner className="mx-auto mt-10 h-7 w-7" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label={t('dashboard.stats.calls')} value={data.calls_count} />
            <Stat label={t('analytics.applications')} value={data.applications_count} />
            <Stat label={t('dashboard.stats.views')} value={data.total_views} />
            <Stat label={t('dashboard.stats.rating')} value={data.average_rating || '—'} />
          </div>

          {/* Status breakdown */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.by_status).map(([k, v]) => (
              <span key={k} className="chip border border-gray-200 px-3 py-1 text-sm dark:border-gray-700">
                {k}: <strong className="ml-1">{v}</strong>
              </span>
            ))}
          </div>

          {data.applications_count === 0 && data.calls_count === 0 ? (
            <p className="card p-8 text-center text-sm text-gray-400">{t('analytics.noData')}</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title={t('analytics.byMonth')}>
                <LineChart data={data.series} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" name={t('analytics.applications')} stroke={BRAND} strokeWidth={2} />
                  <Line type="monotone" dataKey="calls" name={t('analytics.calls')} stroke={ACCENT} strokeWidth={2} />
                </LineChart>
              </ChartCard>

              <ChartCard title={t('analytics.ageDist')}>
                <BarChart data={data.age_distribution} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name={t('analytics.applications')} fill={BRAND} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>

              {data.city_distribution.length > 0 && (
                <ChartCard title={t('analytics.cities')}>
                  <BarChart
                    data={data.city_distribution}
                    layout="vertical"
                    margin={{ top: 8, right: 8, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="city" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartCard>
              )}

              {data.top_categories.length > 0 && (
                <div className="card p-5">
                  <h3 className="mb-4 font-semibold">{t('analytics.topCategories')}</h3>
                  <div className="space-y-2">
                    {data.top_categories.map((c) => {
                      const max = data.top_categories[0].count || 1;
                      return (
                        <div key={c.name}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>{c.name}</span>
                            <span className="text-gray-400">{c.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-2 rounded-full bg-brand-500"
                              style={{ width: `${(c.count / max) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-5">
      <p className="text-3xl font-extrabold text-brand-600">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
