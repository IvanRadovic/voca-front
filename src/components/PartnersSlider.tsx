// Auto-scrolling marquee of NGO partners. Two opposing rows make a fuller,
// more dynamic banner. Logos are monogram badges so nothing depends on
// external assets.

const PARTNERS: { name: string; color: string }[] = [
  { name: 'Tech Youth Hub', color: 'from-sky-500 to-cyan-400' },
  { name: 'Green Future', color: 'from-emerald-500 to-teal-400' },
  { name: 'Creative Arts Collective', color: 'from-rose-500 to-pink-400' },
  { name: 'EU Youth Network', color: 'from-blue-600 to-sky-400' },
  { name: 'Digital Montenegro', color: 'from-cyan-500 to-blue-400' },
  { name: 'Volonteri CG', color: 'from-orange-500 to-amber-400' },
  { name: 'STEM Akademija', color: 'from-teal-500 to-emerald-400' },
  { name: 'Mladi Lideri', color: 'from-indigo-500 to-blue-400' },
  { name: 'Eco Balkan', color: 'from-lime-500 to-emerald-400' },
  { name: 'Future Skills', color: 'from-amber-500 to-orange-400' },
];

function monogram(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function LogoChip({ name, color }: { name: string; color: string }) {
  return (
    <div className="mx-3 flex w-60 shrink-0 items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-card backdrop-blur transition hover:-translate-y-1 hover:shadow-card-hover dark:border-gray-700/60 dark:bg-gray-900/70">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-base font-extrabold text-white shadow-sm`}
      >
        {monogram(name)}
      </span>
      <span className="truncate text-sm font-semibold text-gray-700 dark:text-gray-200">{name}</span>
    </div>
  );
}

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = reverse ? [...PARTNERS].reverse() : PARTNERS;
  const loop = [...items, ...items];
  return (
    <div
      className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover:[animation-play-state:paused]`}
    >
      {loop.map((p, i) => (
        <LogoChip key={`${p.name}-${i}`} name={p.name} color={p.color} />
      ))}
    </div>
  );
}

export default function PartnersSlider() {
  return (
    <div className="group relative space-y-4 overflow-hidden">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-50 to-transparent dark:from-gray-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-50 to-transparent dark:from-gray-950" />
      <Row />
      <Row reverse />
    </div>
  );
}
