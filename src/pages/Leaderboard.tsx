import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useLeaderboard } from "../hooks/queries";
import { PageSpinner } from "../components/ui/Spinner";
import Select from "../components/ui/Select";
import Avatar from "../components/ui/Avatar";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [city, setCity] = useState("");
  const { data: rows = [], isLoading } = useLeaderboard(city);

  // City options derived from the (unfiltered) result set on first load.
  const { data: allRows = [] } = useLeaderboard("");
  const cities = useMemo(
    () => Array.from(new Set(allRows.map((r) => r.city).filter(Boolean))) as string[],
    [allRows],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">🏆 {t("game.leaderboardTitle")}</h1>
          <p className="text-sm text-gray-500">{t("game.leaderboardSubtitle")}</p>
        </div>
        <div className="w-48">
          <Select
            value={city}
            onChange={setCity}
            clearable
            clearLabel={t("game.allCities")}
            placeholder={t("game.allCities")}
            options={cities.map((c) => ({ value: c, label: c }))}
          />
        </div>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">{t("game.emptyLeaderboard")}</div>
      ) : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {rows.map((r) => {
            const isMe = user?.name === r.name;
            return (
              <div
                key={`${r.rank}-${r.name}`}
                className={`flex items-center gap-4 p-4 ${isMe ? "bg-brand-50 dark:bg-brand-900/20" : ""}`}
              >
                <span className="w-8 text-center text-lg font-bold text-gray-400">
                  {MEDALS[r.rank - 1] ?? r.rank}
                </span>
                <Avatar name={r.name} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-xs text-gray-400">
                    {r.city ?? "—"} · {t("game.level")} {r.level}
                  </p>
                </div>
                <span className="font-bold text-brand-600">
                  {r.points} <span className="text-xs font-normal text-gray-400">{t("game.points")}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
