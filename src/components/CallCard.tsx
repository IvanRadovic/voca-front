import { useState } from "react";
import { Link } from "react-router-dom";
import type { Call } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import { useToggleSave } from "../hooks/mutations";
import { CALL_TYPE_LABELS } from "../lib/constants";
import { formatDate, formatPrice } from "../lib/format";

const GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-rose-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-blue-600 to-sky-400",
  "from-amber-500 to-yellow-400",
  "from-teal-500 to-emerald-400",
];

export default function CallCard({ call }: { call: Call }) {
  const { isAuthenticated, isYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { openAuth } = useModal();
  const toggle = useToggleSave();
  const [saved, setSaved] = useState(!!call.is_saved);

  const typeLabel = CALL_TYPE_LABELS[call.type]?.[lang] ?? call.type;
  const gradient = GRADIENTS[call.id % GRADIENTS.length];

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
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative h-40 overflow-hidden">
        {call.image ? (
          <img
            src={call.image}
            alt={call.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
          >
            <span className="text-3xl font-extrabold text-white/90">
              {typeLabel}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 chip bg-white/90 text-gray-800 shadow-sm">
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
