import { useLanguage } from "../context/LanguageContext";
import { useMyGamification } from "../hooks/queries";
import Spinner from "./ui/Spinner";
import { BADGES } from "../lib/constants";

export default function Achievements() {
  const { t, lang } = useLanguage();
  const { data, isPending } = useMyGamification();

  if (isPending || !data) return <Spinner className="mx-auto mt-10 h-7 w-7" />;

  const { level } = data;

  return (
    <div className="space-y-6">
      {/* Level + points */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t("game.level")}</p>
            <p className="text-4xl font-extrabold text-brand-600">{level.level}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{level.points}</p>
            <p className="text-sm text-gray-500">{t("game.points")}</p>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 transition-all"
            style={{ width: `${level.progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          {level.next_threshold === null
            ? t("game.maxLevel")
            : `${level.next_threshold - level.points} ${t("game.points")} ${t("game.toNext")}`}
        </p>
      </div>

      {/* Badges */}
      <div>
        <h3 className="mb-3 font-semibold">{t("game.badges")}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.badges.map((b) => {
            const meta = BADGES[b.key];
            if (!meta) return null;
            return (
              <div
                key={b.key}
                className={`card flex items-center gap-3 p-4 transition ${
                  b.earned ? "" : "opacity-40 grayscale"
                }`}
                title={lang === "cnr" ? meta.descCnr : meta.descEn}
              >
                <span className="text-2xl">{meta.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{lang === "cnr" ? meta.cnr : meta.en}</p>
                  <p className="truncate text-xs text-gray-400">
                    {lang === "cnr" ? meta.descCnr : meta.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
