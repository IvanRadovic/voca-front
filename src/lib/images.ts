// Themed imagery for the landing page. We use LoremFlickr (keyworded Creative
// Commons photos) so each category/section gets a relevant, varied image
// without bundling assets. <ImageWithFallback> degrades to a gradient on error.

const FLICKR = (keywords: string, w = 600, h = 400, lock = 1) =>
  `https://loremflickr.com/${w}/${h}/${keywords}?lock=${lock}`;

// Maps a category slug to a search keyword that yields a fitting photo.
const CATEGORY_KEYWORDS: Record<string, string> = {
  it: 'technology,computer',
  programming: 'coding,programming',
  design: 'design,creative',
  marketing: 'marketing,office',
  entrepreneurship: 'startup,business',
  business: 'business,meeting',
  sport: 'sport,running',
  music: 'music,concert',
  film: 'cinema,film',
  photography: 'photography,camera',
  writing: 'writing,notebook',
  volunteering: 'volunteer,community',
  travel: 'travel,adventure',
  languages: 'books,library',
  psychology: 'mind,people',
  ecology: 'nature,green',
  fitness: 'fitness,gym',
  art: 'art,gallery',
  'personal-development': 'success,growth',
  health: 'health,wellness',
};

export function categoryImage(slug: string, lock = 7): string {
  const keyword = CATEGORY_KEYWORDS[slug] ?? 'youth,students';
  return FLICKR(keyword, 600, 400, lock);
}

export const HERO_IMAGE = FLICKR('students,friends,diverse', 1600, 1000, 11);

// Imagery for the "opportunity types" showcase.
export const TYPE_IMAGES: Record<string, string> = {
  seminar: FLICKR('seminar,lecture', 600, 400, 21),
  conference: FLICKR('conference,audience', 600, 400, 22),
  workshop: FLICKR('workshop,hands', 600, 400, 23),
  camp: FLICKR('camp,outdoor', 600, 400, 24),
  competition: FLICKR('competition,trophy', 600, 400, 25),
  volunteering: FLICKR('volunteer,community', 600, 400, 26),
};

// "How it works" / feature illustrations.
export const FEATURE_IMAGES = {
  discover: FLICKR('students,laptop', 800, 600, 31),
  apply: FLICKR('handshake,team', 800, 600, 32),
  grow: FLICKR('graduation,success', 800, 600, 33),
};

// Gradient fallbacks (varied, no purple).
export const FALLBACK_GRADIENTS = [
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-pink-400',
  'from-blue-600 to-sky-400',
  'from-teal-500 to-emerald-400',
];
