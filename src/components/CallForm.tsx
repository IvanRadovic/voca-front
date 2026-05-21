import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "./ui/Spinner";
import Field from "./ui/Field";
import Select from "./ui/Select";
import DateField from "./ui/DateField";
import ChipMultiSelect from "./ui/ChipMultiSelect";
import { useLanguage } from "../context/LanguageContext";
import { useCategories } from "../hooks/queries";
import { useSaveCall } from "../hooks/mutations";
import { extractError } from "../lib/api";
import { CALL_TYPES, CALL_TYPE_LABELS, PREREQUISITES } from "../lib/constants";
import { callSchema, type CallValues } from "../lib/schemas";
import type { Call } from "../types";

interface CallFormProps {
  initial?: Call | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const toLocal = (v?: string | null) => (v ? v.slice(0, 16) : "");

export default function CallForm({
  initial,
  onSuccess,
  onCancel,
}: CallFormProps) {
  const { t, lang } = useLanguage();
  const { data: categories = [] } = useCategories();
  const save = useSaveCall(initial?.id);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CallValues>({
    resolver: zodResolver(callSchema),
    defaultValues: {
      title: initial?.title ?? "",
      subtitle: initial?.subtitle ?? "",
      description: initial?.description ?? "",
      type: initial?.type ?? "seminar",
      application_deadline: toLocal(initial?.application_deadline),
      start_date: toLocal(initial?.start_date),
      end_date: toLocal(initial?.end_date),
      location: initial?.location ?? "",
      is_online: initial?.is_online ?? false,
      max_participants: initial?.max_participants
        ? String(initial.max_participants)
        : "",
      price: initial?.price ? String(initial.price) : "0",
      status: initial?.status ?? "active",
      categories: initial?.categories?.map((c) => c.id) ?? [],
      prerequisites: initial?.prerequisites ?? ["none"],
    },
  });

  const isOnline = watch("is_online");

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("subtitle", values.subtitle ?? "");
    fd.append("description", values.description);
    fd.append("type", values.type);
    fd.append("application_deadline", values.application_deadline);
    if (values.start_date) fd.append("start_date", values.start_date);
    if (values.end_date) fd.append("end_date", values.end_date);
    fd.append(
      "location",
      values.is_online ? "Online" : (values.location ?? ""),
    );
    fd.append("is_online", values.is_online ? "1" : "0");
    if (values.max_participants)
      fd.append("max_participants", values.max_participants);
    fd.append("price", values.price || "0");
    fd.append("status", values.status);
    values.categories.forEach((id) => fd.append("categories[]", String(id)));
    values.prerequisites.forEach((p) => fd.append("prerequisites[]", p));
    if (imageFile) fd.append("image", imageFile);

    try {
      await save.mutateAsync(fd);
      onSuccess();
    } catch (err) {
      setServerError(extractError(err));
    }
  });

  const prereqOptions = PREREQUISITES.map((p) => ({
    value: p.value,
    label: p[lang],
  }));

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {serverError}
        </div>
      )}

      <Field label="Title *" error={errors.title?.message}>
        <input className="input" maxLength={100} {...register("title")} />
      </Field>
      <Field label="Subtitle">
        <input className="input" maxLength={150} {...register("subtitle")} />
      </Field>
      <Field label="Description *" error={errors.description?.message}>
        <textarea className="input" rows={5} {...register("description")} />
      </Field>

      <Field label="Image (max 5MB)">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 transition hover:border-brand-400 dark:border-gray-600">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="mb-2 h-32 rounded-lg object-cover"
            />
          ) : (
            <span>Drag &amp; drop or click to upload</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </label>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={`${t("browse.type")} *`} error={errors.type?.message}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={CALL_TYPES.map((c) => ({
                  value: c,
                  label: CALL_TYPE_LABELS[c][lang],
                }))}
              />
            )}
          />
        </Field>
        <Field label="Status">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(v) => field.onChange(v as CallValues["status"])}
                options={[
                  { value: "active", label: "Active" },
                  { value: "finished", label: "Finished" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
            )}
          />
        </Field>
        <Field
          label={`${t("common.deadline")} *`}
          error={errors.application_deadline?.message}
        >
          <Controller
            control={control}
            name="application_deadline"
            render={({ field }) => (
              <DateField
                value={field.value}
                onChange={field.onChange}
                withTime
              />
            )}
          />
        </Field>
        <Field label="Price (€)">
          <input
            type="number"
            min="0"
            step="0.01"
            className="input"
            {...register("price")}
          />
        </Field>
        <Field label="Start date">
          <Controller
            control={control}
            name="start_date"
            render={({ field }) => (
              <DateField
                value={field.value ?? ""}
                onChange={field.onChange}
                withTime
                placeholder="-"
              />
            )}
          />
        </Field>
        <Field label="End date">
          <Controller
            control={control}
            name="end_date"
            render={({ field }) => (
              <DateField
                value={field.value ?? ""}
                onChange={field.onChange}
                withTime
                placeholder="-"
              />
            )}
          />
        </Field>
        <Field label="Max participants">
          <input
            type="number"
            min="1"
            className="input"
            {...register("max_participants")}
          />
        </Field>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-600"
              {...register("is_online")}
            />
            {t("common.online")}
          </label>
        </div>
      </div>

      {!isOnline && (
        <Field label={t("browse.location")} error={errors.location?.message}>
          <input className="input" {...register("location")} />
        </Field>
      )}

      <Field
        label={`${t("browse.category")} *`}
        error={errors.categories?.message}
      >
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <ChipMultiSelect
              options={categories}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field label={t("detail.prerequisites")}>
        <Controller
          control={control}
          name="prerequisites"
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {prereqOptions.map((p) => (
                <label
                  key={p.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand-600"
                    checked={field.value.includes(p.value)}
                    onChange={() =>
                      field.onChange(
                        field.value.includes(p.value)
                          ? field.value.filter((x) => x !== p.value)
                          : [...field.value, p.value],
                      )
                    }
                  />
                  {p.label}
                </label>
              ))}
            </div>
          )}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t("common.cancel")}
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner className="h-4 w-4 text-white" />
          ) : (
            t("common.submit")
          )}
        </button>
      </div>
    </form>
  );
}
