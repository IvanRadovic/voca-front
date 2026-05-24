import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/queries";
import Modal from "../components/ui/Modal";
import PostForm from "../components/PostForm";
import CTASection from "../components/CTASection";
import PageHero from "../components/ui/PageHero";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { PageSpinner } from "../components/ui/Spinner";
import { formatDate } from "../lib/format";
import { localized } from "../lib/localize";
import { RESOURCES_PHOTO, BLOG_PHOTO } from "../lib/images";
import type { PostType } from "../types";

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
  const heroImage = type === "resource" ? RESOURCES_PHOTO : BLOG_PHOTO;

  return (
    <>
      <PageHero eyebrow={lang === "cnr" ? "Uči i raste" : "Learn & grow"} title={title} subtitle={subtitle} image={heroImage} />

      <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput);
          }}
          className="flex max-w-md flex-1 gap-2"
        >
          <input
            className="input"
            placeholder={t("posts.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn-secondary">{t("common.search")}</button>
        </form>
        {canAuthor && (
          <button onClick={() => setFormOpen(true)} className="btn-primary">
            + {t("posts.new")}
          </button>
        )}
      </div>

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
                className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative h-40 overflow-hidden">
                  <ImageWithFallback
                    src={p.cover_image ?? heroImage}
                    alt=""
                    seed={p.id}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold leading-snug group-hover:text-brand-600">{localized(lang, p.title, p.title_en)}</h3>
                  {localized(lang, p.excerpt, p.excerpt_en) && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{localized(lang, p.excerpt, p.excerpt_en)}</p>
                  )}
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

      <CTASection />
    </>
  );
}
