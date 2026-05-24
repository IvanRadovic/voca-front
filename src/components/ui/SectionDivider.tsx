interface Props {
  /** Tailwind text-color class that sets the wave fill (match the next section). */
  className?: string;
  /** Background of the strip behind the wave (match the previous section). */
  bgClassName?: string;
  variant?: 'wave' | 'curve';
  /** Flip vertically so the shape points the other way. */
  flip?: boolean;
}

// A decorative SVG separator that overlaps the boundary between two sections.
// `bgClassName` should match the section above; the fill (`className` text
// color) should match the section below — so the two colors meet with no gap.
export default function SectionDivider({
  className = 'text-white dark:text-gray-950',
  bgClassName = '',
  variant = 'wave',
  flip = false,
}: Props) {
  const paths: Record<NonNullable<Props['variant']>, string> = {
    wave: 'M0,64 C320,140 420,0 720,48 C1020,96 1180,16 1440,64 L1440,120 L0,120 Z',
    curve: 'M0,80 C480,160 960,160 1440,80 L1440,120 L0,120 Z',
  };

  return (
    <div aria-hidden className={`pointer-events-none ${bgClassName}`}>
      <div className={`${flip ? 'rotate-180' : ''} ${className}`}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[60px] w-full sm:h-[90px]">
          <path d={paths[variant]} fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
