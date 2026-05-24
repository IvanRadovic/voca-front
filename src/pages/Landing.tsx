import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import {
  useCalls,
  useCategories,
  useFeed,
  usePlatformStats,
  useRecentStories,
} from "../hooks/queries";
import CallCard from "../components/CallCard";
import PartnersSlider from "../components/PartnersSlider";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import {
  categoryImage,
  HERO_ILLUSTRATION,
  FEATURE_IMAGES,
} from "../lib/images";
import { categoryLabel } from "../lib/labels";
import type { TranslationKey } from "../i18n/translations";

const TESTIMONIALS = [
  {
    name: "Ana, 22",
    en: "Through BIP TECH I found a coding bootcamp that changed my career path completely.",
    cnr: "Preko BIP TECH pronašla sam programerski kamp koji mi je potpuno promijenio karijeru.",
  },
  {
    name: "Marko, 19",
    en: "I joined a startup weekend and met my future co-founders here.",
    cnr: "Prijavio sam se na startup vikend i upoznao buduće saradnike.",
  },
  {
    name: "Jelena, 25",
    en: "The photography workshop was amazing - easy to find and apply in one click.",
    cnr: "Radionica fotografije bila je sjajna - lako za pronaći i prijaviti u jednom kliku.",
  },
];

const WHY: { title: TranslationKey; desc: TranslationKey; icon: string }[] = [
  { title: "landing.why1Title", desc: "landing.why1Desc", icon: "✨" },
  { title: "landing.why2Title", desc: "landing.why2Desc", icon: "⚡" },
  { title: "landing.why3Title", desc: "landing.why3Desc", icon: "✓" },
  { title: "landing.why4Title", desc: "landing.why4Desc", icon: "🌐" },
];

const STEPS: { title: TranslationKey; desc: TranslationKey; img: string }[] = [
  {
    title: "landing.step1Title",
    desc: "landing.step1Desc",
    img: FEATURE_IMAGES.discover,
  },
  {
    title: "landing.step2Title",
    desc: "landing.step2Desc",
    img: FEATURE_IMAGES.apply,
  },
  {
    title: "landing.step3Title",
    desc: "landing.step3Desc",
    img: FEATURE_IMAGES.grow,
  },
];

export default function Landing() {
  const { isAuthenticated, isYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { openAuth } = useModal();
  const navigate = useNavigate();

  const { data: stats } = usePlatformStats();
  const { data: categories = [] } = useCategories();
  const { data: latestPage, isLoading: loading } = useCalls({ per_page: 8 });
  const latest = latestPage?.data ?? [];
  const { data: recommended = [] } = useFeed(isAuthenticated && isYouth);
  const { data: stories = [] } = useRecentStories();

  const statItems = stats
    ? [
        { label: t("landing.statsNvos"), value: stats.nvos },
        { label: t("landing.statsCalls"), value: stats.calls },
        { label: t("landing.statsYouth"), value: stats.youth },
        { label: t("landing.statsApplications"), value: stats.applications },
      ]
    : [];

  // Opportunities are the headline: personalized for youth, latest otherwise.
  const featured = recommended.length > 0 ? recommended : latest;
  const featuredHeading =
    recommended.length > 0
      ? t("landing.recommended")
      : t("landing.featuredTitle");

  return (
    <div className="animate-fade-in">
      {/* ---------- Hero (split: text + illustration) ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <span className="chip mb-5 bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {t("hero.ctaYouth")}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-300">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => openAuth("signup")}
                    className="btn-primary px-5 py-2.5"
                  >
                    {t("hero.ctaYouth")}
                  </button>
                  <button
                    onClick={() => openAuth("nvo")}
                    className="btn-secondary px-5 py-2.5"
                  >
                    {t("hero.ctaNvo")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/calls")}
                  className="btn-primary px-5 py-2.5"
                >
                  {t("hero.browse")}
                </button>
              )}
              <Link to="/kako-funkcionise" className="btn-ghost px-5 py-2.5">
                {t("nav.how")} →
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={HERO_ILLUSTRATION}
              alt=""
              className="w-full max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* ---------- Stats band ---------- */}
      {stats && (
        <section className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
            {statItems.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-600 sm:text-4xl">
                  {s.value}+
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Featured opportunities (headline section) ---------- */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-white to-brand-50/50 py-14 dark:border-gray-800 dark:from-gray-950 dark:to-brand-900/10">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-700/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-800/20" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {featuredHeading}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
              {t("landing.featuredSubtitle")}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 8).map((call, i) => (
                <div
                  key={call.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <CallCard call={call} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-9 text-center">
            <button
              onClick={() => navigate("/calls")}
              className="btn-primary px-7 py-3 text-base"
            >
              {t("hero.browse")} →
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ---------- How it works ---------- */}
        <section className="py-14">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("landing.howTitle")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t("landing.howSubtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card overflow-hidden">
                <div className="flex h-44 items-center justify-center bg-brand-50 p-6 dark:bg-brand-900/20">
                  <img src={step.img} alt={t(step.title)} className="h-full" />
                </div>
                <div className="p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold">{t(step.title)}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t(step.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Categories with images ---------- */}
        <section className="py-6">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
            {t("landing.categories")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => {
              const name = categoryLabel(c.slug, lang, c.name);
              return (
                <Link
                  key={c.id}
                  to={`/calls?category=${c.slug}`}
                  className="group relative h-32 overflow-hidden rounded-xl"
                >
                  <ImageWithFallback
                    src={categoryImage(c.slug)}
                    alt={name}
                    seed={i + 1}
                    label={name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                  <span className="absolute bottom-3 left-3 font-semibold text-white">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* ---------- Partners (NGOs) slider ---------- */}
      <section className="bg-gray-50 py-14 dark:bg-gray-900/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("landing.partnersTitle")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t("landing.partnersSubtitle")}
            </p>
          </div>
          <PartnersSlider />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ---------- Why BIP TECH ---------- */}
        <section className="py-14">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            {t("landing.whyTitle")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((f) => (
              <div key={f.title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl dark:bg-brand-900/30">
                  {f.icon}
                </span>
                <h3 className="mt-4 font-semibold">{t(f.title)}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t(f.desc)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Stories / Testimonials ---------- */}
        <section className="pb-14">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            {stories.length > 0
              ? t("landing.stories")
              : t("landing.testimonials")}
          </h2>
          {stories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-3">
              {stories.slice(0, 6).map((s) => (
                <div key={s.id} className="card overflow-hidden">
                  {s.image && (
                    <img
                      src={s.image}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      “{s.body}”
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Avatar
                        name={s.author?.name ?? "?"}
                        src={s.author?.avatar}
                        size={28}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-600">
                          {s.author?.name}
                        </p>
                        {s.call && (
                          <p className="truncate text-xs text-gray-400">
                            {s.call.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-3">
              {TESTIMONIALS.map((tm) => (
                <div key={tm.name} className="card p-6">
                  <div className="mb-2 text-amber-500">★★★★★</div>
                  <p className="text-gray-600 dark:text-gray-300">
                    “{lang === "cnr" ? tm.cnr : tm.en}”
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-600">
                    {tm.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ---------- CTA band ---------- */}
      <section className="bg-brand-600">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white">
          <h2 className="text-3xl font-extrabold">{t("landing.ctaTitle")}</h2>
          <p className="mt-3 text-brand-100">{t("landing.ctaSubtitle")}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/calls")}
                className="btn bg-white px-6 py-2.5 text-brand-700 hover:bg-brand-50"
              >
                {t("hero.browse")}
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth("signup")}
                  className="btn bg-white px-6 py-2.5 text-brand-700 hover:bg-brand-50"
                >
                  {t("hero.ctaYouth")}
                </button>
                <button
                  onClick={() => openAuth("nvo")}
                  className="btn border border-white/40 bg-white/10 px-6 py-2.5 text-white hover:bg-white/20"
                >
                  {t("hero.ctaNvo")}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
