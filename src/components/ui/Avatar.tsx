import { initials } from '../../lib/format';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

export default function Avatar({ name, src, size = 36 }: AvatarProps) {
  const style = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className="rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
      />
    );
  }
  return (
    <div
      style={style}
      className="flex items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white"
    >
      {initials(name) || '?'}
    </div>
  );
}
