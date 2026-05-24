import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { usePost } from "../hooks/queries";
import { useDeletePost } from "../hooks/mutations";
import Modal from "../components/ui/Modal";
import PostForm from "../components/PostForm";
import { PageSpinner } from "../components/ui/Spinner";
import { renderMarkdown } from "../lib/markdown";
import { formatDate } from "../lib/format";

export default function PostPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = usePost(slug);
  const del = useDeletePost();
  const [editing, setEditing] = useState(false);

  if (isLoading) return <PageSpinner />;
  if (isError || !post) return <div className="py-24 text-center text-gray-500">{t("posts.empty")}</div>;

  const onDelete = () => {
    if (!confirm(`${t("posts.delete")}: ${post.title}?`)) return;
    del.mutate(post.id, {
      onSuccess: () => {
        toast.success("✓");
        navigate(post.type === "resource" ? "/resursi" : "/blog");
      },
    });
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 animate-fade-in">
      <Link to={post.type === "resource" ? "/resursi" : "/blog"} className="text-sm text-brand-600 hover:underline">
        ← {post.type === "resource" ? t("posts.resourcesTitle") : t("posts.blogTitle")}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-extrabold leading-tight">{post.title}</h1>
        {post.can_edit && (
          <div className="flex shrink-0 gap-1">
            <button onClick={() => setEditing(true)} className="btn-ghost text-xs">
              {t("posts.edit")}
            </button>
            <button onClick={onDelete} className="btn-ghost text-xs text-rose-600">
              {t("posts.delete")}
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-400">
        {post.author?.name} · {formatDate(post.published_at, lang)}
      </p>

      {post.cover_image && (
        <img src={post.cover_image} alt="" className="mt-6 h-64 w-full rounded-2xl object-cover" />
      )}

      <div
        className="prose prose-sm mt-6 max-w-none text-gray-700 dark:prose-invert dark:text-gray-300 sm:prose-base"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
      />

      {editing && (
        <Modal open onClose={() => setEditing(false)} maxWidth="max-w-2xl">
          <h2 className="mb-4 text-lg font-bold">{t("posts.edit")}</h2>
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <PostForm
              initial={post}
              defaultType={post.type}
              onSuccess={() => setEditing(false)}
              onCancel={() => setEditing(false)}
            />
          </div>
        </Modal>
      )}
    </article>
  );
}
