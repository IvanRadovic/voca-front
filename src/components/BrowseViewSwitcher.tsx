import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

type View = "list" | "calendar" | "map";

export default function BrowseViewSwitcher({ active }: { active: View }) {
  const { t } = useLanguage();
  const items: { key: View; to: string; label: string; icon: string }[] = [
    { key: "list", to: "/calls", label: t("browse.list"), icon: "▤" },
    { key: "calendar", to: "/kalendar", label: t("calendar.title"), icon: "📅" },
    { key: "map", to: "/mapa", label: t("map.title"), icon: "🗺️" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
      {items.map((it) => (
        <Link
          key={it.key}
          to={it.to}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            active === it.key
              ? "bg-brand-600 text-white"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <span className="mr-1">{it.icon}</span>
          {it.label}
        </Link>
      ))}
    </div>
  );
}
