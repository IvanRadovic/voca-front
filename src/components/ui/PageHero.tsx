import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  /** Optional background photo (rendered under the gradient). */
  image?: string;
  children?: ReactNode;
  align?: 'left' | 'center';
}

// Bold, animated hero banner shared across inner pages (Opportunities, How it
// works, ...). Layered gradient + grid + floating blobs + optional photo.
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
  align = 'center',
}: Props) {
  const centered = align === 'center';

  return (
    <section className="relative isolate overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500 bg-gradient-animated animate-gradient shadow-card-hover">
      {/* optional photo */}
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-overlay"
        />
      )}
      {/* grid + vignette */}
      <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 via-transparent to-transparent" aria-hidden />

      {/* floating blobs */}
      <div className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 animate-blob bg-accent-400/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 animate-blob bg-sky-300/30 blur-3xl [animation-delay:3s]" aria-hidden />

      <div
        className={`relative mx-auto max-w-5xl px-4 py-16 sm:py-20 ${
          centered ? 'text-center' : ''
        }`}
      >
        {eyebrow && (
          <span className="animate-fade-up inline-flex items-center rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
            {eyebrow}
          </span>
        )}
        <h1 className="animate-fade-up mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white [animation-delay:80ms] sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p
            className={`animate-fade-up mt-5 text-lg text-white/85 [animation-delay:160ms] ${
              centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
            }`}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className={`animate-fade-up mt-8 [animation-delay:240ms] ${centered ? 'flex justify-center' : ''}`}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
