import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import {
  useCalls,
  useFeed,
  usePlatformStats,
  useRecentStories,
} from "../hooks/queries";
import CallCard from "../components/CallCard";
import CTASection from "../components/CTASection";
import PartnersSlider from "../components/PartnersSlider";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import SectionDivider from "../components/ui/SectionDivider";
import { HERO_ILLUSTRATION, FEATURE_IMAGES } from "../lib/images";
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
  { title: "landing.step1Title", desc: "landing.step1Desc", img: FEATURE_IMAGES.discover },
  { title: "landing.step2Title", desc: "landing.step2Desc", img: FEATURE_IMAGES.apply },
  { title: "landing.step3Title", desc: "landing.step3Desc", img: FEATURE_IMAGES.grow },
];

export default function Landing() {
  const { isAuthenticated, isYouth } = useAuth();
  const { t, lang } = useLanguage();
  const { openAuth } = useModal();
  const navigate = useNavigate();
  const cnr = lang === "cnr";

  const { data: stats } = usePlatformStats();
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

  const featured = recommended.length > 0 ? recommended : latest;
  const featuredHeading =
    recommended.length > 0 ? t("landing.recommended") : t("landing.featuredTitle");

  return (
    <div className="animate-fade-in">
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-brand-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-blob rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-700/20" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 animate-blob rounded-full bg-accent-400/20 blur-3xl [animation-delay:4s]" aria-hidden />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              {t("hero.ctaYouth")}
            </span>
            <h1 className="animate-fade-up mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight [animation-delay:80ms] sm:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="animate-fade-up mt-5 max-w-xl text-lg text-gray-600 [animation-delay:160ms] dark:text-gray-300">
              {t("hero.subtitle")}
            </p>
            <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
              {!isAuthenticated ? (
                <>
                  <button onClick={() => openAuth("signup")} className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5">
                    {t("hero.ctaYouth")}
                  </button>
                  <button onClick={() => openAuth("nvo")} className="btn-secondary px-6 py-3 text-base">
                    {t("hero.ctaNvo")}
                  </button>
                </>
              ) : (
                <button onClick={() => navigate("/calls")} className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5">
                  {t("hero.browse")}
                </button>
              )}
              <Link to="/kako-funkcionise" className="btn-ghost px-5 py-3 text-base">
                {t("nav.how")} →
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="pointer-events-none absolute inset-0 -z-10 m-auto h-64 w-64 rounded-full bg-gradient-to-br from-brand-400/40 to-sky-300/40 blur-3xl" aria-hidden />
            <img
              src={HERO_ILLUSTRATION}
              alt=""
              className="w-full max-w-md animate-float-slow drop-shadow-2xl lg:max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* ---------- Stats (overlapping card) ---------- */}
      {stats && (
        <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4">
          <div className="card grid grid-cols-2 gap-4 px-6 py-6 shadow-card-hover sm:grid-cols-4">
            {statItems.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-600 sm:text-4xl">{s.value}+</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Featured opportunities ---------- */}
      <section className="relative isolate overflow-hidden bg-brand-50 py-16 dark:bg-gray-900">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 animate-blob rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-800/20" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-8 h-72 w-72 animate-blob rounded-full bg-sky-200/40 blur-3xl [animation-delay:3s] dark:bg-sky-900/20" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm dark:border-brand-800 dark:bg-gray-950 dark:text-brand-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              {t("landing.featuredBadge")}
            </span>
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
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <CallCard call={call} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <button onClick={() => navigate("/calls")} className="btn-primary px-7 py-3 text-base shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5">
              {t("hero.browse")} →
            </button>
          </div>
        </div>
      </section>
      <SectionDivider bgClassName="bg-brand-50 dark:bg-gray-900" className="text-white dark:text-gray-950" />

      {/* ---------- How it works ---------- */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
            {cnr ? "Jednostavno" : "Simple"}
          </span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{t("landing.howTitle")}</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t("landing.howSubtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-card-hover">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand-50 to-sky-50 p-6 dark:from-brand-900/20 dark:to-gray-900">
                <img src={step.img} alt={t(step.title)} className="h-full transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold">{t(step.title)}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(step.desc)}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ---------- Partners (full-width banner) ---------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-50 via-sky-50 to-white py-16 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-300/20 blur-3xl" aria-hidden />
        <div className="relative">
          <div className="mx-auto mb-10 max-w-3xl px-4 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
              {cnr ? "Partneri" : "Partners"}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("landing.partnersTitle")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t("landing.partnersSubtitle")}</p>
          </div>
          <PartnersSlider />
        </div>
      </section>

      {/* ---------- Why (tinted, icon tiles) ---------- */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
            {t("landing.whyTitle")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((f, i) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-brand-50/50 p-6 transition hover:-translate-y-1 hover:shadow-card-hover dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/40"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-100/60 transition group-hover:scale-150 dark:bg-brand-900/30" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-xl shadow-sm">
                  {f.icon}
                </span>
                <h3 className="relative mt-4 font-semibold">{t(f.title)}</h3>
                <p className="relative mt-1 text-sm text-gray-500 dark:text-gray-400">{t(f.desc)}</p>
                <span className="absolute bottom-3 right-4 text-5xl font-black text-brand-100 dark:text-gray-800">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stories (dark band, distinct from Why) ---------- */}
      <SectionDivider bgClassName="bg-white dark:bg-gray-950" className="text-gray-900 dark:text-gray-900" />
      <section className="relative isolate overflow-hidden bg-gray-900 py-16 dark:bg-gray-900">
        <div className="absolute inset-0 bg-grid-light opacity-30" aria-hidden />
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 animate-blob rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-400">
              {cnr ? "Iskustva" : "Experiences"}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {stories.length > 0 ? t("landing.stories") : t("landing.testimonials")}
            </h2>
          </div>

          {stories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-3">
              {stories.slice(0, 6).map((s) => (
                <div key={s.id} className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
                  {s.image && <img src={s.image} alt="" className="h-40 w-full object-cover" />}
                  <div className="p-6">
                    <span className="text-4xl leading-none text-brand-400">“</span>
                    <p className="-mt-2 text-gray-200">{s.body}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Avatar name={s.author?.name ?? "?"} src={s.author?.avatar} size={28} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-300">{s.author?.name}</p>
                        {s.call && <p className="truncate text-xs text-gray-400">{s.call.title}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-3">
              {TESTIMONIALS.map((tm) => (
                <div key={tm.name} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
                  <div className="mb-2 text-amber-400">★★★★★</div>
                  <p className="text-gray-200">“{cnr ? tm.cnr : tm.en}”</p>
                  <p className="mt-4 text-sm font-semibold text-brand-300">{tm.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <SectionDivider bgClassName="bg-gray-900 dark:bg-gray-900" className="text-gray-50 dark:text-gray-950" />

      {/* ---------- CTA ---------- */}
      <CTASection />
    </div>
  );
}
