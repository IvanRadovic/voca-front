import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/queries";
import Modal from "../components/ui/Modal";
import PostForm from "../components/PostForm";
import { PageSpinner } from "../components/ui/Spinner";
import { formatDate } from "../lib/format";
import type { PostType } from "../types";

const GRADIENTS = ["from-sky-500 to-cyan-400", "from-emerald-500 to-teal-400", "from-orange-500 to-amber-400", "from-rose-500 to-pink-400"];

export default function PostsPage({ type }: { type: PostType }) {
  const { t, lang } = useLanguage();
  const { user, isNvo } = useAuth();
  const canAuthor = isNvo || user?.role === "admin";

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isPending } = usePosts({ type, search: search || undefined, page, per_page: 9 });
  const posts = data?.data ?? [];
  const meta = data?.meta;

  const title = type === "resource" ? t("posts.resourcesTitle") : t("posts.blogTitle");
  const subtitle = type === "resource" ? t("posts.resourcesSubtitle") : t("posts.blogSubtitle");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {canAuthor && (
          <button onClick={() => setFormOpen(true)} className="btn-primary">
            + {t("posts.new")}
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(searchInput);
        }}
        className="mb-6 flex max-w-md gap-2"
      >
        <input
          className="input"
          placeholder={t("posts.searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn-secondary">{t("common.search")}</button>
      </form>

      {isPending ? (
        <PageSpinner />
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">{t("posts.empty")}</div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/clanci/${p.slug}`}
                className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="h-36 overflow-hidden">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${GRADIENTS[p.id % GRADIENTS.length]}`} />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold leading-snug group-hover:text-brand-600">{p.title}</h3>
                  {p.excerpt && <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{p.excerpt}</p>}
                  <p className="mt-auto pt-3 text-xs text-gray-400">{formatDate(p.published_at, lang)}</p>
                </div>
              </Link>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ‹
              </button>
              <span className="text-sm text-gray-500">
                {meta.current_page} / {meta.last_page}
              </span>
              <button className="btn-secondary" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>
                ›
              </button>
            </div>
          )}
        </>
      )}

      {formOpen && (
        <Modal open onClose={() => setFormOpen(false)} maxWidth="max-w-2xl">
          <h2 className="mb-4 text-lg font-bold">{t("posts.new")}</h2>
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <PostForm defaultType={type} onSuccess={() => setFormOpen(false)} onCancel={() => setFormOpen(false)} />
          </div>
        </Modal>
      )}
    </div>
  );
}
