'use client';

import { useState } from 'react';
import { CalendarCheck2, ChevronLeft, ChevronRight } from 'lucide-react';

import type { SundayService } from '@/lib/serviceCalendar';

function parseServiceDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

const monthFormatter = new Intl.DateTimeFormat('en-NG', {
  month: 'long',
  year: 'numeric',
});

const fullDateFormatter = new Intl.DateTimeFormat('en-NG', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function VisitServiceCalendar({
  services,
  value,
  onChange,
  loading,
}: {
  services: SundayService[];
  value: string;
  onChange: (service: SundayService) => void;
  loading?: boolean;
}) {
  const months = Array.from(
    new Set(services.map(service => monthKey(parseServiceDate(service.value))))
  );
  const selected = services.find(service => service.value === value);
  const selectedMonth = selected
    ? monthKey(parseServiceDate(selected.value))
    : months[0];
  const [requestedMonth, setRequestedMonth] = useState<string>();
  const [expanded, setExpanded] = useState(false);
  const activeMonth =
    requestedMonth && months.includes(requestedMonth)
      ? requestedMonth
      : selectedMonth || months[0];
  const monthIndex = Math.max(0, months.indexOf(activeMonth || ''));

  const calendar = (() => {
    if (!activeMonth) return [];
    const [year, month] = activeMonth.split('-').map(Number);
    const first = new Date(year, month - 1, 1, 12);
    const days = new Date(year, month, 0, 12).getDate();
    return [
      ...Array.from({ length: first.getDay() }, () => null),
      ...Array.from({ length: days }, (_, index) => index + 1),
    ];
  })();

  const serviceByDay = (() => {
    const entries = services
      .filter(
        service => monthKey(parseServiceDate(service.value)) === activeMonth
      )
      .map(
        service => [parseServiceDate(service.value).getDate(), service] as const
      );
    return new Map(entries);
  })();

  const activeDate = activeMonth
    ? parseServiceDate(`${activeMonth}-01`)
    : new Date();
  const calendarOpen = expanded || !selected;

  return (
    <div className="mt-2 min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      {selected ? (
        <div className="flex min-w-0 flex-col gap-3 bg-[var(--app-primary-10)] px-4 py-4 min-[420px]:flex-row min-[420px]:items-center sm:px-5">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--app-primary)_14%,transparent)] text-[var(--app-primary)]">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="break-words font-ui text-sm font-bold leading-5 text-white">
                {selected.serviceType}
              </p>
              <p className="mt-1 break-words font-ui text-xs leading-5 text-white/52">
                {fullDateFormatter.format(parseServiceDate(selected.value))} ·
                9:00 AM WAT
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-expanded={calendarOpen}
            onClick={() => setExpanded(current => !current)}
            className="min-h-10 shrink-0 rounded-full border border-white/12 px-4 font-ui text-xs font-bold text-white/70 transition hover:border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)] hover:text-[var(--app-primary)]"
          >
            {calendarOpen ? 'Close calendar' : 'Change date'}
          </button>
        </div>
      ) : null}

      {calendarOpen ? (
        <>
          <div className="flex min-w-0 items-center justify-between gap-3 border-y border-white/8 px-4 py-3 sm:px-5">
            <button
              type="button"
              aria-label="Previous service month"
              disabled={monthIndex <= 0 || loading}
              onClick={() => setRequestedMonth(months[monthIndex - 1])}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/65 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 text-center">
              <p className="truncate font-ui text-sm font-bold text-white">
                {loading
                  ? 'Loading services…'
                  : monthFormatter.format(activeDate)}
              </p>
              <p className="mt-0.5 font-ui text-[10px] uppercase tracking-[0.14em] text-white/38">
                Available Sundays
              </p>
            </div>
            <button
              type="button"
              aria-label="Next service month"
              disabled={monthIndex >= months.length - 1 || loading}
              onClick={() => setRequestedMonth(months[monthIndex + 1])}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/65 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="p-2.5 sm:p-4">
            <div className="grid grid-cols-7 text-center font-ui text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <span key={day} className="py-2">
                  {day.slice(0, 1)}
                </span>
              ))}
            </div>
            <div
              className="grid grid-cols-7 gap-1"
              role="radiogroup"
              aria-label="Available Sunday services"
            >
              {calendar.map((day, index) => {
                if (day === null) return <span key={`empty-${index}`} />;
                const service = serviceByDay.get(day);
                const isSelected = service?.value === value;
                if (!service) {
                  return (
                    <span
                      key={day}
                      className="grid h-9 place-items-center rounded-lg font-ui text-xs text-white/18 sm:aspect-square sm:h-auto sm:min-h-10 sm:rounded-xl"
                    >
                      {day}
                    </span>
                  );
                }
                return (
                  <button
                    key={service.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${fullDateFormatter.format(parseServiceDate(service.value))}, ${service.serviceType}`}
                    onClick={() => {
                      setRequestedMonth(activeMonth);
                      onChange(service);
                      setExpanded(false);
                    }}
                    className={`relative grid h-9 place-items-center rounded-lg border font-ui text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--app-primary)_20%,transparent)] sm:aspect-square sm:h-auto sm:min-h-10 sm:rounded-xl ${
                      isSelected
                        ? 'border-[var(--app-primary)] bg-[var(--app-primary)] text-black shadow-lg shadow-[color-mix(in_srgb,var(--app-primary)_15%,transparent)]'
                        : 'border-[color-mix(in_srgb,var(--app-primary)_24%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_7%,transparent)] text-[var(--app-primary)] hover:border-[color-mix(in_srgb,var(--app-primary)_55%,transparent)] hover:bg-[color-mix(in_srgb,var(--app-primary)_12%,transparent)]'
                    }`}
                  >
                    {day}
                    <span
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-black/55' : 'bg-[var(--app-primary)]'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
