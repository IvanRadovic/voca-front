import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface DateFieldProps {
  value: string; // 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm'
  onChange: (value: string) => void;
  withTime?: boolean;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

function toDate(v?: string): Date | undefined {
  if (!v) return undefined;
  const [y, m, d] = v.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
  </svg>
);

export default function DateField({
  value,
  onChange,
  withTime,
  placeholder = 'Select date',
  id,
  disabled,
}: DateFieldProps) {
  const selected = toDate(value);
  const [time, setTime] = useState(value && value.length > 10 ? value.slice(11, 16) : '09:00');

  const emit = (date: Date | undefined, t: string) => {
    if (!date) return;
    const day = format(date, 'yyyy-MM-dd');
    onChange(withTime ? `${day}T${t}` : day);
  };

  const display = selected
    ? withTime
      ? `${format(selected, 'dd MMM yyyy')} · ${time}`
      : format(selected, 'dd MMM yyyy')
    : placeholder;

  return (
    <Popover className="relative">
      <PopoverButton
        id={id}
        disabled={disabled}
        className="input flex items-center justify-between gap-2 text-left disabled:opacity-60"
      >
        <span className={selected ? '' : 'text-gray-400'}>{display}</span>
        <CalendarIcon />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom start"
        transition
        className="z-50 mt-1 rounded-xl border border-gray-200 bg-white p-3 shadow-card-hover focus:outline-none data-[closed]:opacity-0 data-[closed]:scale-95 transition duration-100 ease-out dark:border-gray-700 dark:bg-gray-900"
        style={
          {
            '--rdp-accent-color': '#0284c7',
            '--rdp-accent-background-color': '#e0f2fe',
          } as CSSProperties
        }
      >
        {({ close }) => (
          <div className="text-sm">
            <DayPicker
              mode="single"
              locale={enGB}
              selected={selected}
              defaultMonth={selected}
              onSelect={(date) => {
                emit(date, time);
                if (!withTime) close();
              }}
            />
            {withTime && (
              <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <label className="text-gray-500">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    emit(selected, e.target.value);
                  }}
                  className="input flex-1 py-1"
                />
                <button type="button" onClick={() => close()} className="btn-primary py-1">
                  OK
                </button>
              </div>
            )}
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}
