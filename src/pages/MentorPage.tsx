import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useMentor } from "../hooks/queries";
import { useRequestMentorship } from "../hooks/mutations";
import { extractError } from "../lib/api";
import { PageSpinner } from "../components/ui/Spinner";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import { localized } from "../lib/localize";
import { callTypeLabel } from "../lib/labels";
import { formatDate } from "../lib/format";
import type { MentorCallSummary } from "../types";

export default function MentorPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { isAuthenticated, isYouth } = useAuth();
  const { openAuth } = useModal();
  const { data: mentor, isLoading, isError } = useMentor(id);
  const request = useRequestMentorship(id ?? "");

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <PageSpinner />;
  if (isError || !mentor) return <div className="py-24 text-center text-gray-500">{t("mentors.empty")}</div>;

  const submit = () => {
    setError(null);
    request.mutate(message, {
      onSuccess: () => {
        setSent(true);
        setMessage("");
        toast.success(t("mentor.requestSent"));
      },
      onError: (err) => setError(extractError(err)),
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-in">
      <Link to="/mentori" className="text-sm text-brand-600 hover:underline">
        ← {t("mentors.title")}
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <Avatar name={mentor.name} src={mentor.avatar} size={72} />
        <div>
          <h1 className="text-2xl font-extrabold">{mentor.name}</h1>
          <p className="text-gray-500">{localized(lang, mentor.title, mentor.title_en)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
            {mentor.rating !== null && (
              <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                ★ {mentor.rating.toFixed(1)}
                <span className="text-gray-400">
                  ({mentor.reviews_count} {t("mentor.reviewsCount")})
                </span>
              </span>
            )}
            {mentor.linkedin && (
              <a href={mentor.linkedin} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {mentor.expertise.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">{t("mentor.expertise")}</h2>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.map((e) => (
              <span key={e} className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {localized(lang, mentor.bio, mentor.bio_en) && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">{t("mentor.about")}</h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{localized(lang, mentor.bio, mentor.bio_en)}</p>
        </div>
      )}

      {mentor.calls.upcoming.length > 0 && (
        <CallList title={t("mentor.upcomingCalls")} calls={mentor.calls.upcoming} lang={lang} />
      )}
      {mentor.calls.past.length > 0 && (
        <CallList title={t("mentor.pastCalls")} calls={mentor.calls.past} lang={lang} />
      )}

      {mentor.reviews.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">{t("mentor.reviews")}</h2>
          <div className="space-y-3">
            {mentor.reviews.map((r, i) => (
              <div key={i} className="card p-4">
                <p className="text-amber-500">{"★".repeat(r.rating)}<span className="text-gray-300 dark:text-gray-600">{"★".repeat(5 - r.rating)}</span></p>
                {r.comment && <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">"{r.comment}"</p>}
                {r.author && <p className="mt-1 text-xs text-gray-400">— {r.author}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request a conversation */}
      <div className="card mt-8 p-5">
        <h2 className="mb-3 font-semibold">{t("mentor.request")}</h2>
        {!isAuthenticated || !isYouth ? (
          <button onClick={() => openAuth("login")} className="btn-primary">
            {t("mentor.loginToRequest")}
          </button>
        ) : sent ? (
          <p className="text-sm text-emerald-600">✓ {t("mentor.requestSent")}</p>
        ) : (
          <div className="space-y-2">
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <textarea
              className="input"
              rows={3}
              placeholder={t("mentor.requestPlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={submit} disabled={!message || request.isPending} className="btn-primary">
              {request.isPending ? <Spinner className="h-4 w-4 text-white" /> : t("mentor.request")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CallList({
  title,
  calls,
  lang,
}: {
  title: string;
  calls: MentorCallSummary[];
  lang: "cnr" | "en";
}) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</h2>
      <div className="space-y-2">
        {calls.map((c) => (
          <Link
            key={c.id}
            to={`/calls/${c.id}`}
            className="card flex items-center justify-between gap-3 p-3 transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{c.title}</p>
              <p className="text-xs text-gray-400">
                {callTypeLabel(c.type, lang)}
                {c.start_date ? ` · ${formatDate(c.start_date, lang)}` : ""}
                {c.is_online ? (lang === "cnr" ? " · Online" : " · Online") : c.location ? ` · ${c.location}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-brand-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
