'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/lib/cn';
import {
  daysInMonthForYear,
  isFullDateField,
  MONTH_OPTIONS,
  parseDateParts,
  toDDMM,
  toFullDate,
} from '@/lib/forms/fieldValue';

import {
  Field,
  controlClass,
  controlErrorClass,
  controlFocusRing,
} from './Field';
import type { FieldControlProps } from './fields';

/* ============================================================================
   DatePickerField — a real calendar picker for every public-form `date` field.
   • dateMode 'full' (or a date-of-birth field): month + year dropdowns above a
     day grid, so picking a birth year is one tap, not decades of clicking.
     Stores "DD-MM-YYYY".
   • dateMode 'day-month' (birthdays/anniversaries for greeting automation):
     month navigation + day grid, no year. Stores "DD-MM".
============================================================================ */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = MONTH_OPTIONS.map(m => m.label);

function formatDisplay(
  parts: { day: string; month: string; year: string } | null,
  full: boolean
): string {
  if (!parts || parts.day === '00' || parts.month === '00') return '';
  const monthName = MONTH_NAMES[Number(parts.month) - 1] ?? parts.month;
  const day = String(Number(parts.day));
  if (full && parts.year && parts.year !== '0000') {
    return `${day} ${monthName} ${parts.year}`;
  }
  return `${day} ${monthName}`;
}

export function DatePickerField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useId();
  const fieldId = `ff-${field.key || id}`;
  const full = isFullDateField(field);
  const reduceMotion = useReducedMotion();

  const parsed = parseDateParts(typeof value === 'string' ? value : '');
  const selectedDay =
    parsed?.day && parsed.day !== '00' ? Number(parsed.day) : null;
  const selectedMonth =
    parsed?.month && parsed.month !== '00' ? Number(parsed.month) : null;
  const selectedYear =
    parsed?.year && parsed.year !== '0000' ? Number(parsed.year) : null;

  const today = useMemo(() => new Date(), []);
  const thisYear = today.getFullYear();

  const [open, setOpen] = useState(false);
  // The month currently shown in the grid (1-12) and its reference year.
  const [viewMonth, setViewMonth] = useState(
    selectedMonth ?? today.getMonth() + 1
  );
  const [viewYear, setViewYear] = useState(
    selectedYear ?? (full ? thisYear - 20 : thisYear)
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

  const openPicker = () => {
    setViewMonth(selectedMonth ?? today.getMonth() + 1);
    setViewYear(selectedYear ?? (full ? thisYear - 20 : thisYear));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = thisYear + 1; y >= 1900; y -= 1) list.push(y);
    return list;
  }, [thisYear]);

  const gridDays = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
    const dim = daysInMonthForYear(viewMonth, full ? viewYear : undefined);
    const cells: Array<{ day: number; current: boolean }> = [];
    // leading days from previous month
    const prevDim = daysInMonthForYear(
      viewMonth === 1 ? 12 : viewMonth - 1,
      full ? (viewMonth === 1 ? viewYear - 1 : viewYear) : undefined
    );
    for (let i = firstWeekday - 1; i >= 0; i -= 1) {
      cells.push({ day: prevDim - i, current: false });
    }
    for (let d = 1; d <= dim; d += 1) cells.push({ day: d, current: true });
    while (cells.length % 7 !== 0) {
      cells.push({
        day: cells.length - (firstWeekday + dim) + 1,
        current: false,
      });
    }
    while (cells.length < 42) {
      cells.push({
        day: cells.length - (firstWeekday + dim) + 1,
        current: false,
      });
    }
    return cells;
  }, [viewMonth, viewYear, full]);

  const stepMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setViewMonth(m);
    if (full) setViewYear(y);
  };

  const pick = (day: number) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(viewMonth).padStart(2, '0');
    onChange(full ? toFullDate(dd, mm, String(viewYear)) : toDDMM(dd, mm));
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setOpen(false);
  };

  const display = formatDisplay(parsed, full);

  return (
    <Field
      htmlFor={fieldId}
      label={field.label}
      required={field.required}
      error={error}
      help={
        full ? 'Pick your date, including the year.' : 'Pick the day and month.'
      }
    >
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          id={fieldId}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openPicker())}
          className={cn(
            controlClass,
            controlFocusRing,
            'flex items-center gap-2.5 text-left',
            !display && 'text-[var(--app-subtle)]',
            error && controlErrorClass
          )}
        >
          <CalendarDays
            className="h-4 w-4 shrink-0 text-[var(--app-subtle)]"
            aria-hidden="true"
          />
          <span className="flex-1 truncate">
            {display || (full ? 'Select a date' : 'Select day and month')}
          </span>
          {display ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date"
              onClick={e => {
                e.stopPropagation();
                clear();
              }}
              className="rounded-full p-0.5 text-[var(--app-subtle)] transition-colors hover:text-[var(--app-ink)]"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              role="dialog"
              aria-label={`Choose ${field.label}`}
              initial={
                reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -6, scale: 0.98 }
              }
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute left-0 z-50 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-[0_20px_45px_-15px_color-mix(in_srgb,black_28%,transparent)]"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => stepMonth(-1)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--app-muted)] transition-colors hover:bg-[var(--app-canvas)] hover:text-[var(--app-ink)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {full ? (
                  <div className="flex flex-1 gap-2">
                    <select
                      aria-label="Month"
                      value={viewMonth}
                      onChange={e => setViewMonth(Number(e.target.value))}
                      className="min-w-0 flex-1 rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)] px-2 py-1.5 font-ui text-body-sm text-[var(--app-ink)] outline-none focus:border-[var(--app-primary)]"
                    >
                      {MONTH_NAMES.map((name, i) => (
                        <option key={name} value={i + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Year"
                      value={viewYear}
                      onChange={e => setViewYear(Number(e.target.value))}
                      className="w-[4.75rem] shrink-0 rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)] px-2 py-1.5 font-ui text-body-sm text-[var(--app-ink)] outline-none focus:border-[var(--app-primary)]"
                    >
                      {years.map(y => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="flex-1 text-center font-ui text-body-sm font-semibold text-[var(--app-ink)]">
                    {MONTH_NAMES[viewMonth - 1]}
                  </span>
                )}

                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => stepMonth(1)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--app-muted)] transition-colors hover:bg-[var(--app-canvas)] hover:text-[var(--app-ink)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map(w => (
                  <span
                    key={w}
                    className="py-1 font-ui text-caption font-semibold text-[var(--app-subtle)]"
                  >
                    {w}
                  </span>
                ))}
                {gridDays.map((cell, idx) => {
                  const isSelected =
                    cell.current &&
                    selectedDay === cell.day &&
                    selectedMonth === viewMonth &&
                    (!full || selectedYear === viewYear);
                  const isToday =
                    cell.current &&
                    cell.day === today.getDate() &&
                    viewMonth === today.getMonth() + 1 &&
                    viewYear === today.getFullYear();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!cell.current) {
                          stepMonth(idx < 7 ? -1 : 1);
                          return;
                        }
                        pick(cell.day);
                      }}
                      className={cn(
                        'grid h-9 w-full place-items-center rounded-full font-ui text-body-sm transition-colors',
                        cell.current
                          ? 'text-[var(--app-ink)] hover:bg-[var(--app-primary-10)]'
                          : 'text-[var(--app-subtle)]/50 hover:text-[var(--app-subtle)]',
                        isSelected &&
                          'bg-[var(--app-primary)] font-semibold text-white hover:bg-[var(--app-primary)]',
                        !isSelected &&
                          isToday &&
                          'ring-1 ring-inset ring-[var(--app-primary)]'
                      )}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-[var(--app-border)] pt-2">
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-lg px-2 py-1 font-ui text-caption font-medium text-[var(--app-muted)] transition-colors hover:text-[var(--app-ink)]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 font-ui text-caption font-medium text-[var(--app-primary-dark)] transition-colors hover:underline"
                >
                  Done
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Field>
  );
}
