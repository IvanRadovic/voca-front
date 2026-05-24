import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import { useCall, useCallFeedbacks, useSimilarCalls } from "../hooks/queries";
import { useApply, useToggleSave, useCoverLetter } from "../hooks/mutations";
import AiTextButton from "../components/AiTextButton";
import { extractError } from "../lib/api";
import CallCard from "../components/CallCard";
import Spinner, { PageSpinner } from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import { CALL_TYPE_LABELS, PREREQUISITES } from "../lib/constants";
import { categoryLabel } from "../lib/labels";
import { formatDate, formatDateTime, formatPrice, isPast } from "../lib/format";
import { googleCalendarUrl } from "../lib/calendarLink";

export default function CallDetails() {
  const { id } = useParams();
  const { isAuthenticated, isYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { openAuth } = useModal();

  const { data: call, isLoading } = useCall(id);
  const { data: similar = [] } = useSimilarCalls(id);
  const { data: feedbacks = [] } = useCallFeedbacks(id);
  const apply = useApply(id ?? "");
  const toggleSave = useToggleSave();
  const coverLetter = useCoverLetter();

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (call) {
      setApplied(!!call.has_applied);
      setSaved(!!call.is_saved);
    }
  }, [call]);

  if (isLoading) return <PageSpinner />;
  if (!call)
    return (
      <div className="py-20 text-center text-gray-500">
        {t("common.noResults")}
      </div>
    );

  const deadlinePassed =
    isPast(call.application_deadline) || call.status !== "active";
  const typeLabel = CALL_TYPE_LABELS[call.type]?.[lang] ?? call.type;

  const handleApply = () => {
    if (!isAuthenticated) return openAuth("login");
    setNotice(null);
    apply.mutate(undefined, {
      onSuccess: () => {
        setApplied(true);
        setNotice(
          lang === "cnr"
            ? "Uspješno ste se prijavili!"
            : "You have applied successfully!",
        );
      },
      onError: (err) => setNotice(extractError(err)),
    });
  };

  const handleSave = () => {
    if (!isAuthenticated) return openAuth("login");
    toggleSave.mutate(call.id, { onSuccess: (data) => setSaved(data.saved) });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <div className="relative mb-6 h-64 overflow-hidden rounded-2xl sm:h-80">
        {call.image ? (
          <img
            src={call.image}
            alt={call.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-sky-400">
            <span className="text-4xl font-extrabold text-white/90">
              {typeLabel}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {typeLabel}
            </span>
            {call.categories?.map((c) => (
              <span
                key={c.id}
                className="chip bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {categoryLabel(c.slug, lang, c.name)}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold">{call.title}</h1>
          {call.subtitle && (
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              {call.subtitle}
            </p>
          )}

          <h2 className="mb-2 mt-8 text-lg font-bold">{t("detail.about")}</h2>
          <div
            className="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: call.description }}
          />

          {call.prerequisites.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 font-semibold">
                {t("detail.prerequisites")}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {call.prerequisites.map((p) => {
                  const meta = PREREQUISITES.find((x) => x.value === p);
                  return (
                    <li
                      key={p}
                      className="chip bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {meta ? meta[lang] : p}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold">
              {t("detail.reviews")}{" "}
              {feedbacks.length > 0 && (
                <span className="text-amber-500">★ {call.average_rating}</span>
              )}
            </h2>
            {feedbacks.length === 0 ? (
              <p className="text-sm text-gray-400">{t("common.noResults")}</p>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={fb.user?.name ?? "?"} size={32} />
                        <span className="text-sm font-medium">
                          {fb.user?.name}
                        </span>
                      </div>
                      <span className="text-amber-500">
                        {"★".repeat(fb.rating)}
                      </span>
                    </div>
                    {fb.comment && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {fb.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card sticky top-20 p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-brand-600">
                {formatPrice(call.price, t("common.free"))}
              </span>
              {call.average_rating > 0 && (
                <span className="text-amber-500">★ {call.average_rating}</span>
              )}
            </div>

            <dl className="space-y-3 text-sm">
              <Row
                label={t("common.deadline")}
                value={formatDateTime(call.application_deadline, lang)}
              />
              <Row
                label={lang === "cnr" ? "Početak" : "Starts"}
                value={formatDate(call.start_date, lang)}
              />
              <Row
                label={t("browse.location")}
                value={
                  call.is_online ? t("common.online") : (call.location ?? "-")
                }
              />
              {call.max_participants && (
                <Row
                  label={t("detail.participants")}
                  value={String(call.max_participants)}
                />
              )}
            </dl>

            <a
              href={googleCalendarUrl(call)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-brand-600 hover:underline"
            >
              📅 {t("detail.addToCalendar")}
            </a>

            {notice && (
              <div className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {notice}
              </div>
            )}

            {(isYouth || !isAuthenticated) && (
              <div className="mt-5 space-y-2">
                <button
                  onClick={handleApply}
                  disabled={applied || deadlinePassed || apply.isPending}
                  className="btn-primary w-full"
                >
                  {apply.isPending ? (
                    <Spinner className="h-4 w-4 text-white" />
                  ) : applied ? (
                    t("common.applied")
                  ) : deadlinePassed ? (
                    t("detail.deadlinePassed")
                  ) : !isAuthenticated ? (
                    t("detail.loginToApply")
                  ) : (
                    t("detail.applyNow")
                  )}
                </button>
                <button onClick={handleSave} className="btn-secondary w-full">
                  {saved ? `★ ${t("common.saved")}` : `☆ ${t("common.save")}`}
                </button>
                {isYouth && (
                  <AiTextButton
                    className="btn-ghost w-full"
                    label={t("ai.coverLetter")}
                    title={t("ai.coverLetter")}
                    generate={() => coverLetter.mutateAsync({ call_id: call.id, lang })}
                  />
                )}
                {!isAuthenticated && (
                  <p className="pt-1 text-center text-xs text-gray-400">
                    {t("guest.applyHint")}
                  </p>
                )}
              </div>
            )}
          </div>

          {call.nvo && (
            <div className="card p-5">
              <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                {t("detail.organizer")}
              </p>
              {call.nvo.nvo_id ? (
                <Link
                  to={`/nvo/${call.nvo.nvo_id}`}
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <Avatar name={call.nvo.organization_name} size={40} />
                  <p className="flex items-center gap-1 font-semibold hover:text-brand-600">
                    {call.nvo.organization_name}
                    {call.nvo.verified && (
                      <span className="text-brand-600" title="Verified">
                        ✓
                      </span>
                    )}
                  </p>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar name={call.nvo.organization_name} size={40} />
                  <p className="font-semibold">{call.nvo.organization_name}</p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-xl font-bold">{t("detail.similar")}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <CallCard key={s.id} call={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
