// MVP partners strip: an auto-scrolling marquee of placeholder NGO "logos".
// Logos are rendered as monogram badges so nothing depends on external assets.

const PARTNERS: { name: string; color: string }[] = [
  { name: 'Tech Youth Hub', color: 'bg-sky-500' },
  { name: 'Green Future', color: 'bg-emerald-500' },
  { name: 'Creative Arts Collective', color: 'bg-rose-500' },
  { name: 'EU Youth Network', color: 'bg-blue-600' },
  { name: 'Digital Montenegro', color: 'bg-cyan-500' },
  { name: 'Volonteri CG', color: 'bg-orange-500' },
  { name: 'STEM Akademija', color: 'bg-teal-500' },
  { name: 'Mladi Lideri', color: 'bg-indigo-500' },
  { name: 'Eco Balkan', color: 'bg-lime-600' },
  { name: 'Future Skills', color: 'bg-amber-500' },
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
    <div className="mx-3 flex w-56 shrink-0 items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-card dark:border-gray-800 dark:bg-gray-900">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-sm font-bold text-white`}>
        {monogram(name)}
      </span>
      <span className="truncate text-sm font-semibold text-gray-700 dark:text-gray-200">{name}</span>
    </div>
  );
}

export default function PartnersSlider() {
  // Duplicate the list so the marquee loops seamlessly (translateX -50%).
  const loop = [...PARTNERS, ...PARTNERS];
  return (
    <div className="group relative overflow-hidden">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900/40" />
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((p, i) => (
          <LogoChip key={`${p.name}-${i}`} name={p.name} color={p.color} />
        ))}
      </div>
    </div>
  );
}
