import { useState } from "react";
import { Link } from "react-router-dom";
import type { Call } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import { useToggleSave } from "../hooks/mutations";
import { CALL_TYPE_LABELS } from "../lib/constants";
import { formatDate, formatPrice } from "../lib/format";
import { callTypeImage } from "../lib/images";
import ImageWithFallback from "./ui/ImageWithFallback";

export default function CallCard({ call }: { call: Call }) {
  const { isAuthenticated, isYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { openAuth } = useModal();
  const toggle = useToggleSave();
  const [saved, setSaved] = useState(!!call.is_saved);

  const typeLabel = CALL_TYPE_LABELS[call.type]?.[lang] ?? call.type;

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuth("login");
      return;
    }
    toggle.mutate(call.id, { onSuccess: (data) => setSaved(data.saved) });
  };

  return (
    <Link
      to={`/calls/${call.id}`}
      className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={call.image ?? callTypeImage(call.type)}
          alt={call.title}
          seed={call.id}
          label={typeLabel}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 chip bg-white/90 text-gray-800 shadow-sm backdrop-blur">
          {typeLabel}
        </span>
        {isYouth && (
          <button
            onClick={toggleSave}
            disabled={toggle.isPending}
            aria-label={t("common.save")}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-gray-700 shadow-sm transition hover:text-brand-600"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className={saved ? "text-brand-600" : ""}
            >
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
          <span>
            {call.is_online ? t("common.online") : (call.location ?? "-")}
          </span>
          {call.average_rating > 0 && (
            <span className="flex items-center gap-0.5 text-amber-500">
              ★ {call.average_rating}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-brand-600">
          {call.title}
        </h3>
        {call.subtitle && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {call.subtitle}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 text-xs">
          <span className="text-gray-400">
            {t("common.deadline")}:{" "}
            {formatDate(call.application_deadline, lang)}
          </span>
          <span className="font-semibold text-brand-600">
            {formatPrice(call.price, t("common.free"))}
          </span>
        </div>
      </div>
    </Link>
  );
}
