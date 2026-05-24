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
} from "date-fns";
import { useLanguage } from "../context/LanguageContext";
import { useCalls } from "../hooks/queries";
import { PageSpinner } from "../components/ui/Spinner";
import BrowseViewSwitcher from "../components/BrowseViewSwitcher";
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
        <div className="card overflow-hidden">
          {/* Month header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
            <button onClick={() => setCursor((d) => subMonths(d, 1))} className="btn-ghost">
              ‹
            </button>
            <h2 className="text-lg font-semibold">
              {MONTHS[lang][cursor.getMonth()]} {cursor.getFullYear()}
            </h2>
            <button onClick={() => setCursor((d) => addMonths(d, 1))} className="btn-ghost">
              ›
            </button>
          </div>

          {/* Weekday row */}
          <div className="grid grid-cols-7 border-b border-gray-100 text-center text-xs font-medium text-gray-400 dark:border-gray-800">
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
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-24 border-b border-r border-gray-100 p-1.5 dark:border-gray-800 ${
                    muted ? "bg-gray-50 dark:bg-gray-900/40" : ""
                  }`}
                >
                  <div
                    className={`mb-1 text-right text-xs ${
                      today ? "font-bold text-brand-600" : "text-gray-400"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((c) => (
                      <Link
                        key={c.id}
                        to={`/calls/${c.id}`}
                        className="block truncate rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
                        title={c.title}
                      >
                        {c.title}
                      </Link>
                    ))}
                    {events.length > 3 && (
                      <span className="block text-[10px] text-gray-400">+{events.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
