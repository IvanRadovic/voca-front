import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useMentors } from "../hooks/queries";
import { PageSpinner } from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";

export default function MentorsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const { data: mentors = [], isPending } = useMentors(search);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("mentors.title")}</h1>
        <p className="text-sm text-gray-500">{t("mentors.subtitle")}</p>
      </div>

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
                  <p className="truncate text-sm text-gray-500">{m.title}</p>
                </div>
              </div>
              {m.bio && <p className="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{m.bio}</p>}
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
  );
}
