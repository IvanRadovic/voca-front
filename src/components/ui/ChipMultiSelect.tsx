interface Option {
  id: number;
  name: string;
}

interface ChipMultiSelectProps {
  options: Option[];
  value: number[];
  onChange: (value: number[]) => void;
  scroll?: boolean;
}

// Toggleable chip group used for interests / categories.
export default function ChipMultiSelect({ options, value, onChange, scroll }: ChipMultiSelectProps) {
  const toggle = (id: number) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        scroll ? 'max-h-36 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700' : ''
      }`}
    >
      {options.map((opt) => {
        const active = value.includes(opt.id);
        return (
          <button
            type="button"
            key={opt.id}
            onClick={() => toggle(opt.id)}
            aria-pressed={active}
            className={`chip border transition ${
              active
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-300 text-gray-600 hover:border-brand-400 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            {opt.name}
          </button>
        );
      })}
    </div>
  );
}
