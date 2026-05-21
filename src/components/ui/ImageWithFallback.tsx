import { useState } from 'react';
import { FALLBACK_GRADIENTS } from '../../lib/images';

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Index used to pick a deterministic gradient fallback. */
  seed?: number;
  /** Optional label shown on the gradient fallback. */
  label?: string;
}

// Renders an image and, if it fails to load, a colorful gradient placeholder.
export default function ImageWithFallback({ src, alt, className = '', seed = 0, label }: Props) {
  const [failed, setFailed] = useState(false);
  const gradient = FALLBACK_GRADIENTS[Math.abs(seed) % FALLBACK_GRADIENTS.length];

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}>
        {label && <span className="px-2 text-center text-lg font-bold text-white/90">{label}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
