import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Renders an empty "all" option at the top. */
  clearable?: boolean;
  clearLabel?: string;
  id?: string;
}

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Select({
  value,
  onChange,
  options,
  placeholder = '—',
  disabled,
  clearable,
  clearLabel = 'All',
  id,
}: SelectProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <ListboxButton
          id={id}
          className="input flex items-center justify-between gap-2 text-left disabled:opacity-60"
        >
          <span className={selected ? '' : 'text-gray-400'}>{selected ? selected.label : placeholder}</span>
          <ChevronIcon />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          transition
          className="z-50 mt-1 max-h-64 w-[var(--button-width)] overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-card-hover focus:outline-none data-[closed]:opacity-0 data-[closed]:scale-95 transition duration-100 ease-out dark:border-gray-700 dark:bg-gray-900"
        >
          {clearable && (
            <ListboxOption
              value=""
              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-gray-500 data-[focus]:bg-brand-50 data-[focus]:text-brand-700 dark:data-[focus]:bg-brand-900/30"
            >
              {clearLabel}
            </ListboxOption>
          )}
          {options.map((opt) => (
            <ListboxOption
              key={opt.value}
              value={opt.value}
              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm data-[focus]:bg-brand-50 data-[focus]:text-brand-700 dark:data-[focus]:bg-brand-900/30 dark:data-[focus]:text-brand-200"
            >
              {({ selected: isSel }) => (
                <>
                  <span className={isSel ? 'font-medium text-brand-700 dark:text-brand-300' : ''}>{opt.label}</span>
                  {isSel && (
                    <span className="text-brand-600">
                      <CheckIcon />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
