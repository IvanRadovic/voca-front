import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLanguage } from "../context/LanguageContext";
import { useSavePost } from "../hooks/mutations";
import { extractError } from "../lib/api";
import { renderMarkdown } from "../lib/markdown";
import Field from "./ui/Field";
import Select from "./ui/Select";
import Spinner from "./ui/Spinner";
import type { Post, PostType } from "../types";

interface Values {
  type: PostType;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
}

export default function PostForm({
  initial,
  defaultType,
  onSuccess,
  onCancel,
}: {
  initial?: Post | null;
  defaultType: PostType;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const save = useSavePost(initial?.id);
  const [cover, setCover] = useState<File | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      type: initial?.type ?? defaultType,
      title: initial?.title ?? "",
      excerpt: initial?.excerpt ?? "",
      body: initial?.body ?? "",
      published: initial ? initial.published_at !== null : true,
    },
  });

  const body = watch("body");

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const fd = new FormData();
    fd.append("type", values.type);
    fd.append("title", values.title);
    fd.append("excerpt", values.excerpt ?? "");
    fd.append("body", values.body);
    fd.append("published", values.published ? "1" : "0");
    if (cover) fd.append("cover_image", cover);
    try {
      await save.mutateAsync(fd);
      onSuccess();
    } catch (err) {
      setServerError(extractError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {serverError && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_160px]">
        <Field label={`${t("postForm.title")} *`} error={errors.title?.message}>
          <input className="input" {...register("title", { required: true })} />
        </Field>
        <Field label={t("postForm.type")}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(v) => field.onChange(v as PostType)}
                options={[
                  { value: "resource", label: t("postType.resource") },
                  { value: "blog", label: t("postType.blog") },
                ]}
              />
            )}
          />
        </Field>
      </div>

      <Field label={t("postForm.excerpt")}>
        <input className="input" maxLength={300} {...register("excerpt")} />
      </Field>

      <Field label={t("postForm.cover")}>
        <input type="file" accept="image/*" className="text-xs" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
      </Field>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="label mb-0">{t("postForm.body")} *</span>
          <div className="flex gap-1 text-xs">
            {(["write", "preview"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setTab(v)}
                className={`rounded-md px-2 py-1 ${tab === v ? "bg-brand-600 text-white" : "text-gray-500"}`}
              >
                {v === "write" ? t("postForm.write") : t("postForm.preview")}
              </button>
            ))}
          </div>
        </div>
        {tab === "write" ? (
          <textarea className="input font-mono text-sm" rows={10} {...register("body", { required: true })} />
        ) : (
          <div
            className="prose prose-sm max-w-none rounded-lg border border-gray-200 p-3 dark:prose-invert dark:border-gray-700"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
          />
        )}
        <p className="mt-1 text-xs text-gray-400">{t("postForm.bodyHint")}</p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-brand-600" {...register("published")} />
        {t("postForm.published")}
      </label>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t("common.cancel")}
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : t("common.submit")}
        </button>
      </div>
    </form>
  );
}
