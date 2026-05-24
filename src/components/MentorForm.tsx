import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { useApplyMentor, useSaveMentor } from "../hooks/mutations";
import { extractError } from "../lib/api";
import Field from "./ui/Field";
import Spinner from "./ui/Spinner";
import type { MentorAdmin } from "../types";

interface Values {
  name: string;
  title: string;
  title_en: string;
  expertise: string;
  bio: string;
  bio_en: string;
  email: string;
  linkedin: string;
  is_active: boolean;
}

export default function MentorForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: {
  mode: "apply" | "admin";
  initial?: MentorAdmin | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const apply = useApplyMentor();
  const save = useSaveMentor(initial?.id);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      name: initial?.name ?? "",
      title: initial?.title ?? "",
      title_en: initial?.title_en ?? "",
      expertise: initial?.expertise ?? "",
      bio: initial?.bio ?? "",
      bio_en: initial?.bio_en ?? "",
      email: initial?.email ?? "",
      linkedin: initial?.linkedin ?? "",
      is_active: initial?.is_active ?? true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("title", values.title);
    fd.append("title_en", values.title_en ?? "");
    fd.append("expertise", values.expertise ?? "");
    fd.append("bio", values.bio ?? "");
    fd.append("bio_en", values.bio_en ?? "");
    fd.append("email", values.email ?? "");
    fd.append("linkedin", values.linkedin ?? "");
    if (mode === "admin") fd.append("is_active", values.is_active ? "1" : "0");
    if (photo) fd.append("avatar", photo);

    try {
      if (mode === "apply") {
        await apply.mutateAsync(fd);
        toast.success(t("mentorApply.sent"));
      } else {
        await save.mutateAsync(fd);
      }
      onSuccess();
    } catch (err) {
      setError(extractError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={`${t("mentorApply.name")} *`} error={errors.name?.message}>
          <input className="input" {...register("name", { required: true })} />
        </Field>
        <Field label={`${t("mentorApply.role")} *`} error={errors.title?.message}>
          <input className="input" {...register("title", { required: true })} />
        </Field>
      </div>
      <Field label={t("mentorApply.expertise")}>
        <input className="input" placeholder="IT, Programming, Career" {...register("expertise")} />
      </Field>
      <Field label={t("mentorApply.bio")}>
        <textarea className="input" rows={3} {...register("bio")} />
      </Field>

      <fieldset className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t("mentorApply.englishSection")}
        </legend>
        <Field label={t("mentorApply.roleEn")}>
          <input className="input" {...register("title_en")} />
        </Field>
        <Field label={t("mentorApply.bioEn")}>
          <textarea className="input" rows={3} {...register("bio_en")} />
        </Field>
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t("mentorApply.email")}>
          <input type="email" className="input" {...register("email")} />
        </Field>
        <Field label="LinkedIn">
          <input className="input" placeholder="https://" {...register("linkedin")} />
        </Field>
      </div>
      <Field label={t("mentorApply.photo")}>
        <input type="file" accept="image/*" className="text-xs" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
      </Field>

      {mode === "admin" && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-brand-600" {...register("is_active")} />
          {t("adminMentors.active")}
        </label>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t("common.cancel")}
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? (
            <Spinner className="h-4 w-4 text-white" />
          ) : mode === "apply" ? (
            t("mentorApply.submit")
          ) : (
            t("common.submit")
          )}
        </button>
      </div>
    </form>
  );
}
