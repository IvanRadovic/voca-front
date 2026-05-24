import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import { useLanguage } from "../context/LanguageContext";
import { useCalls } from "../hooks/queries";
import { PageSpinner } from "../components/ui/Spinner";
import BrowseViewSwitcher from "../components/BrowseViewSwitcher";
import { callTypeLabel } from "../lib/labels";
import { formatPrice } from "../lib/format";
import type { Call } from "../types";

const MONTHS: Record<string, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  cnr: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
};
const WEEKDAYS: Record<string, string[]> = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  cnr: ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"],
};

const eventDate = (c: Call) => new Date(c.start_date ?? c.application_deadline);

export default function CalendarPage() {
  const { t, lang } = useLanguage();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const { data, isLoading } = useCalls({ per_page: 100 });
  const calls = data?.data ?? [];

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Call[]>();
    for (const c of calls) {
      const key = eventDate(c).toDateString();
      map.set(key, [...(map.get(key) ?? []), c]);
    }
    return map;
  }, [calls]);

  const selectedEvents = eventsByDay.get(selected.toDateString()) ?? [];
  const monthLabel = `${MONTHS[lang][cursor.getMonth()]} ${cursor.getFullYear()}`;
  const selectedLabel = `${selected.getDate()}. ${MONTHS[lang][selected.getMonth()]} ${selected.getFullYear()}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("calendar.title")}</h1>
          <p className="text-sm text-gray-500">{t("calendar.subtitle")}</p>
        </div>
        <BrowseViewSwitcher active="calendar" />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card overflow-hidden">
            {/* Month header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
              <button onClick={() => setCursor((d) => subMonths(d, 1))} className="btn-ghost" aria-label="prev">
                ‹
              </button>
              <h2 className="text-lg font-semibold">{monthLabel}</h2>
              <button onClick={() => setCursor((d) => addMonths(d, 1))} className="btn-ghost" aria-label="next">
                ›
              </button>
            </div>

            {/* Weekday row */}
            <div className="grid grid-cols-7 border-b border-gray-100 text-center text-[11px] font-medium text-gray-400 dark:border-gray-800 sm:text-xs">
              {WEEKDAYS[lang].map((w) => (
                <div key={w} className="py-2">
                  {w}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7">
              {days.map((day) => {
                const events = eventsByDay.get(day.toDateString()) ?? [];
                const muted = !isSameMonth(day, cursor);
                const today = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selected);
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => setSelected(day)}
                    className={`flex min-h-14 flex-col border-b border-r border-gray-100 p-1 text-left transition dark:border-gray-800 sm:min-h-24 sm:p-1.5 ${
                      muted ? "bg-gray-50 dark:bg-gray-900/40" : ""
                    } ${isSelected ? "ring-2 ring-inset ring-brand-500" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                  >
                    <span
                      className={`mb-1 inline-flex h-6 w-6 items-center justify-center self-end rounded-full text-xs ${
                        today ? "bg-brand-600 font-bold text-white" : "text-gray-400"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Desktop: event titles */}
                    <div className="hidden flex-1 space-y-1 sm:block">
                      {events.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          className="block truncate rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                          title={c.title}
                        >
                          {c.title}
                        </span>
                      ))}
                      {events.length > 3 && (
                        <span className="block text-[10px] text-gray-400">+{events.length - 3}</span>
                      )}
                    </div>

                    {/* Mobile: dots */}
                    {events.length > 0 && (
                      <div className="mt-auto flex flex-wrap justify-center gap-0.5 pb-0.5 sm:hidden">
                        {events.slice(0, 4).map((c) => (
                          <span key={c.id} className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day agenda */}
          <aside>
            <h3 className="mb-3 font-semibold">{selectedLabel}</h3>
            {selectedEvents.length === 0 ? (
              <p className="card p-6 text-center text-sm text-gray-400">{t("common.noResults")}</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((c) => (
                  <Link key={c.id} to={`/calls/${c.id}`} className="card block p-3 hover:shadow-card-hover">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-brand-600">{callTypeLabel(c.type, lang)}</span>
                      <span className="text-xs text-gray-400">{format(eventDate(c), "HH:mm")}</span>
                    </div>
                    <p className="mt-1 font-semibold leading-snug">{c.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {c.is_online ? t("common.online") : c.location ?? "—"} · {formatPrice(c.price, t("common.free"))}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
