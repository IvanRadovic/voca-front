import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useMentors } from "../hooks/queries";
import { PageSpinner } from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import MentorForm from "../components/MentorForm";
import CTASection from "../components/CTASection";
import PageHero from "../components/ui/PageHero";
import { localized } from "../lib/localize";
import { MENTORS_PHOTO } from "../lib/images";

export default function MentorsPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);
  const { data: mentors = [], isPending } = useMentors(search);

  return (
    <>
      <PageHero
        eyebrow={lang === "cnr" ? "Mentorstvo" : "Mentorship"}
        title={t("mentors.title")}
        subtitle={t("mentors.subtitle")}
        image={MENTORS_PHOTO}
      >
        <button onClick={() => setApplyOpen(true)} className="btn bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-50">
          {t("mentor.become")}
        </button>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-10">

      {applyOpen && (
        <Modal open onClose={() => setApplyOpen(false)} maxWidth="max-w-lg">
          <h2 className="mb-4 text-lg font-bold">{t("mentorApply.title")}</h2>
          <MentorForm mode="apply" onSuccess={() => setApplyOpen(false)} onCancel={() => setApplyOpen(false)} />
        </Modal>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(input);
        }}
        className="mb-6 flex max-w-md gap-2"
      >
        <input
          className="input"
          placeholder={t("mentors.searchPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn-secondary">{t("common.search")}</button>
      </form>

      {isPending ? (
        <PageSpinner />
      ) : mentors.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">{t("mentors.empty")}</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m) => (
            <Link key={m.id} to={`/mentori/${m.id}`} className="card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} src={m.avatar} size={48} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.name}</p>
                  <p className="truncate text-sm text-gray-500">{localized(lang, m.title, m.title_en)}</p>
                  {m.rating !== null && (
                    <p className="text-xs font-medium text-amber-500">★ {m.rating.toFixed(1)} <span className="text-gray-400">({m.reviews_count})</span></p>
                  )}
                </div>
              </div>
              {localized(lang, m.bio, m.bio_en) && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{localized(lang, m.bio, m.bio_en)}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                {m.expertise.slice(0, 3).map((e) => (
                  <span key={e} className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {e}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>

      <CTASection />
    </>
  );
}
