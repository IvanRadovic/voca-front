import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  useCategories,
  useMyApplications,
  useMyFeedbacks,
  useMySaved,
} from "../hooks/queries";
import { useLeaveFeedback, useUpdateProfile } from "../hooks/mutations";
import { extractError } from "../lib/api";
import CallCard from "../components/CallCard";
import Spinner from "../components/ui/Spinner";
import Field from "../components/ui/Field";
import Select from "../components/ui/Select";
import DateField from "../components/ui/DateField";
import ChipMultiSelect from "../components/ui/ChipMultiSelect";
import {
  APPLICATION_STATUS_STYLES,
  EDUCATION_LEVELS,
  GENDERS,
} from "../lib/constants";
import { applicationStatusLabel, localizeCategories } from "../lib/labels";
import { formatDate } from "../lib/format";
import { profileSchema, type ProfileValues } from "../lib/schemas";
import type { User } from "../types";

type Tab = "profile" | "applications" | "wishlist" | "reviews";

export default function Profile() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("profile");

  const tabs: [Tab, string][] = [
    ["profile", t("nav.profile")],
    ["applications", t("profile.myApplications")],
    ["wishlist", t("profile.wishlist")],
    ["reviews", t("profile.myReviews")],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold">{t("profile.title")}</h1>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === key
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileForm />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "wishlist" && <WishlistTab />}
      {tab === "reviews" && <ReviewsTab />}
    </div>
  );
}

/* -------------------- Profile form -------------------- */

function ProfileForm() {
  const { user, setUser } = useAuth();
  const { t, lang } = useLanguage();
  const { data: categories = [] } = useCategories();
  const updateProfile = useUpdateProfile();
  const [savedMsg, setSavedMsg] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      city: user?.city ?? "",
      date_of_birth: user?.date_of_birth ?? "",
      education_level: user?.education_level ?? "",
      gender: user?.gender ?? "",
      headline: user?.headline ?? "",
      about: user?.about ?? "",
      education: user?.education ?? "",
      work_experience: user?.work_experience ?? "",
      skills: user?.skills ?? "",
      linkedin: user?.linkedin ?? "",
      interests: user?.interests?.map((i) => i.id) ?? [],
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSavedMsg(false);
    try {
      const updated = (await updateProfile.mutateAsync(values)) as User;
      setUser(updated);
      setSavedMsg(true);
    } catch (err) {
      setServerError(extractError(err));
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="card max-w-2xl space-y-4 p-6"
      noValidate
    >
      {savedMsg && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {lang === "cnr" ? "Sačuvano!" : "Saved!"}
        </div>
      )}
      {serverError && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("auth.name")} error={errors.name?.message}>
          <input className="input" {...register("name")} />
        </Field>
        <Field label={t("auth.city")}>
          <input className="input" {...register("city")} />
        </Field>
        <Field label={t("auth.dob")}>
          <Controller
            control={control}
            name="date_of_birth"
            render={({ field }) => (
              <DateField
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="-"
              />
            )}
          />
        </Field>
        <Field label={t("auth.education")}>
          <Controller
            control={control}
            name="education_level"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="-"
                options={EDUCATION_LEVELS.map((l) => ({
                  value: l.value,
                  label: lang === "cnr" ? l.cnr : l.en,
                }))}
              />
            )}
          />
        </Field>
        <Field label={t('profile.gender')}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="—"
                options={GENDERS.map((g) => ({ value: g.value, label: lang === 'cnr' ? g.cnr : g.en }))}
              />
            )}
          />
        </Field>
      </div>

      <Field label={t("profile.headline")}>
        <input
          className="input"
          placeholder={t("form.headlinePlaceholder")}
          {...register("headline")}
        />
      </Field>
      <Field label={t("profile.about")} error={errors.about?.message}>
        <textarea className="input" rows={3} {...register("about")} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("profile.educationDetails")}>
          <textarea className="input" rows={3} {...register("education")} />
        </Field>
        <Field label={t("profile.experience")}>
          <textarea className="input" rows={3} {...register("work_experience")} />
        </Field>
      </div>
      <Field label={t("profile.skills")}>
        <input className="input" {...register("skills")} />
      </Field>
      <Field label={t("profile.linkedin")} error={errors.linkedin?.message}>
        <input
          className="input"
          placeholder="https://linkedin.com/in/…"
          {...register("linkedin")}
        />
      </Field>

      <Field label={t("profile.interests")}>
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <ChipMultiSelect
              options={localizeCategories(categories, lang)}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <button className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <Spinner className="h-4 w-4 text-white" />
        ) : (
          t("profile.save")
        )}
      </button>
    </form>
  );
}

/* -------------------- Applications -------------------- */

function ApplicationsTab() {
  const { lang } = useLanguage();
  const { data: apps = [], isPending } = useMyApplications();
  const [reviewFor, setReviewFor] = useState<number | null>(null);

  if (isPending) return <Spinner className="mx-auto mt-10 h-7 w-7" />;
  if (apps.length === 0) return <Empty />;

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div key={app.id} className="card p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link
                to={`/calls/${app.call?.id}`}
                className="font-semibold hover:text-brand-600"
              >
                {app.call?.title}
              </Link>
              <p className="text-xs text-gray-400">
                {formatDate(app.created_at, lang)}
              </p>
            </div>
            <span className={`chip ${APPLICATION_STATUS_STYLES[app.status]}`}>
              {applicationStatusLabel(app.status, lang)}
            </span>
          </div>

          {app.status === "completed" && app.call && (
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
              {reviewFor === app.call.id ? (
                <ReviewForm
                  callId={app.call.id}
                  onDone={() => setReviewFor(null)}
                />
              ) : (
                <button
                  onClick={() => setReviewFor(app.call!.id)}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  {lang === "cnr" ? "Ostavi recenziju" : "Leave a review"}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewForm({
  callId,
  onDone,
}: {
  callId: number;
  onDone: () => void;
}) {
  const { t, lang } = useLanguage();
  const leave = useLeaveFeedback(callId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    leave.mutate(
      { rating, comment },
      { onSuccess: onDone, onError: (err) => setError(extractError(err)) },
    );
  };

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-xl ${n <= rating ? "text-amber-500" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="input"
        rows={2}
        placeholder={lang === "cnr" ? "Tvoj komentar…" : "Your comment…"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={submit}
        disabled={leave.isPending}
        className="btn-primary"
      >
        {leave.isPending ? (
          <Spinner className="h-4 w-4 text-white" />
        ) : (
          t("common.submit")
        )}
      </button>
    </div>
  );
}

/* -------------------- Wishlist -------------------- */

function WishlistTab() {
  const { data: calls = [], isPending } = useMySaved();
  if (isPending) return <Spinner className="mx-auto mt-10 h-7 w-7" />;
  if (calls.length === 0) return <Empty />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {calls.map((c) => (
        <CallCard key={c.id} call={c} />
      ))}
    </div>
  );
}

/* -------------------- Reviews -------------------- */

function ReviewsTab() {
  const { lang } = useLanguage();
  const { data: reviews = [], isPending } = useMyFeedbacks();
  if (isPending) return <Spinner className="mx-auto mt-10 h-7 w-7" />;
  if (reviews.length === 0) return <Empty />;
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/calls/${r.call?.id}`}
              className="font-semibold hover:text-brand-600"
            >
              {r.call?.title}
            </Link>
            <span className="text-amber-500">{"★".repeat(r.rating)}</span>
          </div>
          {r.comment && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {r.comment}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {formatDate(r.created_at, lang)}
          </p>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  const { t } = useLanguage();
  return (
    <div className="card p-10 text-center text-gray-500 dark:text-gray-400">
      {t("common.noResults")}
    </div>
  );
}
