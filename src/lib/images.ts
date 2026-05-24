// Curated, deterministic imagery for the landing page.
//
// NOTE: every image is a hand-picked Unsplash photo (free to use, no attribution
// required) referenced by a fixed URL - NOT a random source - so the same photo
// always shows. To swap any image, just replace its URL below.
// <ImageWithFallback> degrades to a colored gradient if a photo fails to load.

const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

// Bundled vector illustrations (in /public/illustrations) - always available,
// no network dependency. Generated from the open-source unDraw set.
export const HERO_ILLUSTRATION = "/illustrations/hero.svg";
export const EMPTY_ILLUSTRATION = "/illustrations/empty.svg";

// Shared photographic backgrounds for hero / CTA banners.
export const HERO_PHOTO = u("1522202176988-66273c2fd55f", 1600, 900); // young team collaborating
export const CTA_PHOTO = u("1529156069898-49953e39b3ac", 1600, 900); // group of friends/volunteers
export const CALLS_PHOTO = u("1524178232363-1fb2b075b655", 1600, 900); // lecture hall / learning
export const HOW_PHOTO = u("1531482615713-2afd69097998", 1600, 900); // people working together
export const RESOURCES_PHOTO = u("1456513080510-7bf3a84b82f8", 1600, 900); // notebook / study
export const BLOG_PHOTO = u("1499750310107-5fef28a66643", 1600, 900); // writing / laptop
export const MENTORS_PHOTO = u("1543269865-cbf427effbad", 1600, 900); // mentoring / conversation

// Photos by opportunity type (used as a fallback when a call has no image).
const CALL_TYPE_IMAGES: Record<string, string> = {
  seminar: u("1524178232363-1fb2b075b655", 800, 500), // lecture hall
  conference: u("1540575467063-178a50c2df87", 800, 500), // conference
  education: u("1503676260728-1c00da094a0b", 800, 500), // classroom
  camp: u("1504280390367-361c6d9f38f4", 800, 500), // camp / tents
  competition: u("1552664730-d307ca884978", 800, 500), // team competition
  course: u("1517245386807-bb43f82c33c4", 800, 500), // study desk
  workshop: u("1556761175-b413da4baf72", 800, 500), // workshop / hands-on
  mentorship: u("1543269865-cbf427effbad", 800, 500), // mentoring / talk
  volunteering: u("1593113598332-cd288d649433", 800, 500), // volunteers
};

export function callTypeImage(type: string): string {
  return CALL_TYPE_IMAGES[type] ?? u("1523240795612-9a054b0db644", 800, 500);
}

// "How it works" steps.
export const FEATURE_IMAGES = {
  discover: "/illustrations/discover.svg",
  apply: "/illustrations/apply.svg",
  grow: "/illustrations/grow.svg",
};

// Category tiles - topic/scene photos (kept object-focused on purpose).
const CATEGORY_IMAGES: Record<string, string> = {
  it: u("1518770660439-4636190af475", 600, 400), // circuit board
  programming: u("1461749280684-dccba630e2f6", 600, 400), // code on screen
  design: u("1561070791-2526d30994b5", 600, 400), // design desk
  marketing: u("1460925895917-afdab827c52f", 600, 400), // analytics
  entrepreneurship: u("1664575602554-2087b04935a5", 600, 400), // startup
  business: u("1497032205916-ac775f0649ae", 600, 400), // office desk
  sport: u("1461896836934-ffe607ba8211", 600, 400), // stadium
  music: u("1511671782779-c97d3d27a1d4", 600, 400), // concert
  film: u("1485846234645-a62644f84728", 600, 400), // cinema
  photography: u("1452587925148-ce544e77e70d", 600, 400), // camera
  writing: u("1455390582262-044cdead277a", 600, 400), // notebook
  volunteering: u("1593113598332-cd288d649433", 600, 400), // volunteers
  travel: u("1488646953014-85cb44e25828", 600, 400), // travel
  languages: u("1481627834876-b7833e8f5570", 600, 400), // books
  psychology: u("1559757148-5c350d0d3c56", 600, 400), // mind
  ecology: u("1441974231531-c6227db76b6e", 600, 400), // forest
  fitness: u("1534438327276-14e5300c3a48", 600, 400), // gym
  art: u("1513364776144-60967b0f800f", 600, 400), // gallery
  "personal-development": u("1507537297725-24a1c029d3ca", 600, 400), // path/growth
  health: u("1505751172876-fa1923c5c528", 600, 400), // health
};

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? u("1523240795612-9a054b0db644", 600, 400);
}

// Gradient fallbacks (varied, no purple).
export const FALLBACK_GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-pink-400",
  "from-blue-600 to-sky-400",
  "from-teal-500 to-emerald-400",
];
