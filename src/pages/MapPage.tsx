import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useLanguage } from "../context/LanguageContext";
import { useCalls } from "../hooks/queries";
import { PageSpinner } from "../components/ui/Spinner";
import BrowseViewSwitcher from "../components/BrowseViewSwitcher";
import { locationToCoords } from "../lib/cities";
import { callTypeLabel } from "../lib/labels";

// Bundled Leaflet marker assets (no external CDN dependency).
const markerIcon = new Icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapPage() {
  const { t, lang } = useLanguage();
  const { data, isLoading } = useCalls({ per_page: 100 });
  const calls = data?.data ?? [];

  const pinned = useMemo(
    () =>
      calls
        .filter((c) => !c.is_online)
        .map((c) => ({ call: c, coords: locationToCoords(c.location) }))
        .filter((x): x is { call: typeof x.call; coords: [number, number] } => x.coords !== null),
    [calls],
  );
  const online = useMemo(() => calls.filter((c) => c.is_online), [calls]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("map.title")}</h1>
          <p className="text-sm text-gray-500">{t("map.subtitle")}</p>
        </div>
        <BrowseViewSwitcher active="map" />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="card overflow-hidden" style={{ height: 520 }}>
            <MapContainer center={[42.6, 19.2]} zoom={8} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {pinned.map(({ call, coords }) => (
                <Marker key={call.id} position={coords} icon={markerIcon}>
                  <Popup>
                    <strong>{call.title}</strong>
                    <br />
                    {callTypeLabel(call.type, lang)} · {call.location}
                    <br />
                    <Link to={`/calls/${call.id}`} className="text-brand-600">
                      {t("common.readMore")}
                    </Link>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Online opportunities side list */}
          <aside>
            <h2 className="mb-3 font-semibold">{t("map.onlineList")}</h2>
            <div className="space-y-2">
              {online.length === 0 ? (
                <p className="text-sm text-gray-400">{t("common.noResults")}</p>
              ) : (
                online.map((c) => (
                  <Link key={c.id} to={`/calls/${c.id}`} className="card block p-3 hover:shadow-card-hover">
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-xs text-gray-400">{callTypeLabel(c.type, lang)} · {t("common.online")}</p>
                  </Link>
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
