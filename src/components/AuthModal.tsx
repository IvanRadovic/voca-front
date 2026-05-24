import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Modal from "./ui/Modal";
import Spinner from "./ui/Spinner";
import Field from "./ui/Field";
import Select from "./ui/Select";
import ChipMultiSelect from "./ui/ChipMultiSelect";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useLanguage } from "../context/LanguageContext";
import { useCategories } from "../hooks/queries";
import { extractError } from "../lib/api";
import { EDUCATION_LEVELS } from "../lib/constants";
import { localizeCategories } from "../lib/labels";
import {
  loginSchema,
  youthSchema,
  nvoSchema,
  type LoginValues,
  type YouthValues,
  type NvoValues,
} from "../lib/schemas";
import type { User } from "../types";

export default function AuthModal() {
  const { authOpen, authMode, closeAuth, setAuthMode } = useModal();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // After auth: greet the user and send them to the right place by role.
  const handleSuccess = (user: User, isNew: boolean) => {
    closeAuth();
    toast.success(`${isNew ? t("toast.registered") : t("toast.welcome")}, ${user.name}!`);
    navigate(user.role === "nvo" ? "/dashboard" : "/calls");
  };

  if (!authOpen) return null;

  const title =
    authMode === "login"
      ? t("auth.loginTitle")
      : authMode === "signup"
        ? t("auth.signupTitle")
        : t("auth.nvoTitle");

  return (
    <Modal
      open={authOpen}
      onClose={closeAuth}
      maxWidth={authMode === "login" ? "max-w-md" : "max-w-lg"}
    >
      <h2 className="mb-1 text-xl font-bold">{title}</h2>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">BIP TECH</p>

      {authMode === "login" && <LoginForm onSuccess={handleSuccess} />}
      {authMode === "signup" && <YouthForm onSuccess={handleSuccess} />}
      {authMode === "nvo" && <NvoForm onSuccess={handleSuccess} />}

      <div className="mt-5 space-y-1 text-center text-sm text-gray-500 dark:text-gray-400">
        {authMode === "login" ? (
          <>
            <p>
              {t("auth.noAccount")}{" "}
              <button
                className="font-medium text-brand-600 hover:underline"
                onClick={() => setAuthMode("signup")}
              >
                {t("auth.asYouth")}
              </button>
            </p>
            <p>
              <button
                className="font-medium text-brand-600 hover:underline"
                onClick={() => setAuthMode("nvo")}
              >
                {t("auth.asNvo")}
              </button>
            </p>
          </>
        ) : (
          <p>
            {t("auth.haveAccount")}{" "}
            <button
              className="font-medium text-brand-600 hover:underline"
              onClick={() => setAuthMode("login")}
            >
              {t("nav.login")}
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
}

/* -------------------- Login -------------------- */

function LoginForm({ onSuccess }: { onSuccess: (user: User, isNew: boolean) => void }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const user = await login(values.email, values.password);
      onSuccess(user, false);
    } catch (err) {
      setServerError(extractError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <ServerError message={serverError} />
      <Field label={t("auth.email")} error={errors.email?.message}>
        <input type="email" className="input" {...register("email")} />
      </Field>
      <Field label={t("auth.password")} error={errors.password?.message}>
        <input type="password" className="input" {...register("password")} />
      </Field>
      <SubmitButton loading={isSubmitting} label={t("auth.loginTitle")} />
      <SocialPlaceholder />
    </form>
  );
}

/* -------------------- Youth signup -------------------- */

function YouthForm({ onSuccess }: { onSuccess: (user: User, isNew: boolean) => void }) {
  const { registerYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { data: categories = [] } = useCategories();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<YouthValues>({
    resolver: zodResolver(youthSchema),
    defaultValues: { interests: [] },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const user = await registerYouth(values);
      onSuccess(user, true);
    } catch (err) {
      setServerError(extractError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <ServerError message={serverError} />
      <Field label={t("auth.name")} error={errors.name?.message}>
        <input className="input" {...register("name")} />
      </Field>
      <Field label={t("auth.email")} error={errors.email?.message}>
        <input type="email" className="input" {...register("email")} />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t("auth.password")} error={errors.password?.message}>
          <input type="password" className="input" {...register("password")} />
        </Field>
        <Field
          label={t("auth.passwordConfirm")}
          error={errors.password_confirmation?.message}
        >
          <input
            type="password"
            className="input"
            {...register("password_confirmation")}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t("auth.city")}>
          <input className="input" {...register("city")} />
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
      </div>
      <Field label={t("profile.interests")}>
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <ChipMultiSelect
              options={localizeCategories(categories, lang)}
              value={field.value ?? []}
              onChange={field.onChange}
              scroll
            />
          )}
        />
      </Field>
      <SubmitButton loading={isSubmitting} label={t("auth.signupTitle")} />
    </form>
  );
}

/* -------------------- NGO signup -------------------- */

function NvoForm({ onSuccess }: { onSuccess: (user: User, isNew: boolean) => void }) {
  const { registerNvo } = useAuth();
  const { t } = useLanguage();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NvoValues>({ resolver: zodResolver(nvoSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const user = await registerNvo(values);
      onSuccess(user, true);
    } catch (err) {
      setServerError(extractError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <ServerError message={serverError} />
      <Field label={t("auth.name")} error={errors.name?.message}>
        <input className="input" {...register("name")} />
      </Field>
      <Field
        label={t("auth.orgName")}
        error={errors.organization_name?.message}
      >
        <input className="input" {...register("organization_name")} />
      </Field>
      <Field label={t("auth.email")} error={errors.email?.message}>
        <input type="email" className="input" {...register("email")} />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t("auth.password")} error={errors.password?.message}>
          <input type="password" className="input" {...register("password")} />
        </Field>
        <Field
          label={t("auth.passwordConfirm")}
          error={errors.password_confirmation?.message}
        >
          <input
            type="password"
            className="input"
            {...register("password_confirmation")}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t("auth.pib")}>
          <input className="input" {...register("pib")} />
        </Field>
        <Field label={t("auth.website")} error={errors.website?.message}>
          <input
            className="input"
            placeholder="https://"
            {...register("website")}
          />
        </Field>
      </div>
      <Field label={t("auth.description")}>
        <textarea className="input" rows={3} {...register("description")} />
      </Field>
      <SubmitButton loading={isSubmitting} label={t("auth.nvoTitle")} />
    </form>
  );
}

/* -------------------- shared bits -------------------- */

function ServerError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
      {message}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" className="btn-primary w-full" disabled={loading}>
      {loading ? <Spinner className="h-4 w-4 text-white" /> : label}
    </button>
  );
}

function SocialPlaceholder() {
  const { t } = useLanguage();
  return (
    <div className="mt-4">
      <div className="my-3 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        {t("auth.socialNote")}
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="btn-secondary cursor-not-allowed opacity-60"
        >
          Google
        </button>
        <button
          type="button"
          disabled
          className="btn-secondary cursor-not-allowed opacity-60"
        >
          LinkedIn
        </button>
      </div>
    </div>
  );
}
