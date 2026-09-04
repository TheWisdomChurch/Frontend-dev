'use client';

import { useId } from 'react';
import type { CountryCode } from 'libphonenumber-js';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/cn';
import type { PublicFormField } from '@/lib/apiTypes';
import { DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES } from '@/lib/validation/phone';
import {
  countWords,
  daysInMonth,
  getFieldInputType,
  MONTH_OPTIONS,
  parseDDMMPartial,
  resolveMaxWords,
  splitE164,
  toDDMM,
} from '@/lib/forms/fieldValue';

import {
  FloatingField,
  StaticField,
  controlClass,
  controlErrorClass,
  controlFocusRing,
  staticControlClass,
} from './Field';
import { PhoneNumberField } from './PhoneNumberField';

/* ============================================================================
   Field renderers — one per control type. Each owns its <Field> shell, focus
   styling, and accessible wiring; the renderer only supplies value/error/change.
============================================================================ */

export interface FieldControlProps {
  field: PublicFormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

const choiceClass =
  'flex min-h-11 cursor-pointer select-none items-center gap-2.5 rounded-input border border-[var(--app-border)] bg-[var(--app-canvas)] px-3.5 py-2 font-ui text-body-sm text-[var(--app-muted)] transition-[border-color,background-color,color,transform] duration-150 hover:border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)] hover:bg-[var(--app-surface)] active:scale-[0.99] has-[:checked]:border-[var(--app-primary)] has-[:checked]:bg-[var(--app-primary-10)] has-[:checked]:text-[var(--app-ink)] has-[:focus-visible]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--app-primary)_16%,transparent)]';

function useFieldId(field: PublicFormField) {
  const generated = useId();
  return `ff-${field.key || generated}`;
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-subtle)] transition-transform duration-200 peer-focus:rotate-180 peer-focus:text-[var(--app-primary-dark)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

export function TextField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);
  const text = typeof value === 'string' ? value : '';

  return (
    <FloatingField
      id={id}
      label={field.label}
      required={field.required}
      filled={text.length > 0}
      error={error}
      help={field.placeholder}
    >
      {({ onFocus, onBlur, ...aria }) => (
        <input
          id={id}
          type={getFieldInputType(field)}
          className={cn(
            controlClass,
            controlFocusRing,
            error && controlErrorClass
          )}
          value={text}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={event => onChange(event.target.value)}
          {...aria}
        />
      )}
    </FloatingField>
  );
}

export function TextareaField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);
  const maxWords = resolveMaxWords(field);
  const text = typeof value === 'string' ? value : '';
  const words = countWords(text);
  const over = typeof maxWords === 'number' && words > maxWords;

  return (
    <FloatingField
      id={id}
      label={field.label}
      required={field.required}
      filled={text.length > 0}
      error={error}
      help={field.placeholder}
      align="top"
      aside={
        typeof maxWords === 'number' ? (
          <span className={over ? 'text-[var(--status-error)]' : undefined}>
            {words}/{maxWords}
          </span>
        ) : undefined
      }
    >
      {({ onFocus, onBlur, ...aria }) => (
        <textarea
          id={id}
          rows={5}
          className={cn(
            controlClass,
            controlFocusRing,
            'min-h-[8.5rem] resize-y leading-7',
            error && controlErrorClass
          )}
          value={text}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={event => onChange(event.target.value)}
          {...aria}
        />
      )}
    </FloatingField>
  );
}

export function SelectField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);
  const current = typeof value === 'string' ? value : '';

  return (
    <FloatingField
      id={id}
      label={field.label}
      required={field.required}
      filled={current.length > 0}
      error={error}
    >
      {({ onFocus, onBlur, ...aria }) => (
        <div className="relative">
          <select
            id={id}
            className={cn(
              controlClass,
              controlFocusRing,
              'cursor-pointer appearance-none pr-10',
              error && controlErrorClass
            )}
            value={current}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={event => onChange(event.target.value)}
            {...aria}
          >
            <option value="" disabled hidden />
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
      )}
    </FloatingField>
  );
}

function AnimatedChoice({
  type,
  name,
  checked,
  onChange,
  label,
}: {
  type: 'radio' | 'checkbox';
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <label className={choiceClass}>
      <input
        type={type}
        name={name}
        checked={checked}
        className="peer sr-only"
        onChange={event => onChange(event.target.checked)}
      />
      <span
        className={cn(
          'grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center border-[1.5px] border-[var(--app-muted)] text-white transition-colors',
          type === 'radio' ? 'rounded-full' : 'rounded-md',
          checked && 'border-[var(--app-primary)] bg-[var(--app-primary)]'
        )}
      >
        <motion.svg
          viewBox="0 0 14 14"
          className="h-3 w-3"
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 500, damping: 25 }
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2.5 7.5 3 3 6-6.5" />
        </motion.svg>
      </span>
      {label}
    </label>
  );
}

export function RadioGroupField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  return (
    <StaticField
      as="legend"
      label={field.label}
      required={field.required}
      error={error}
      showOptional={false}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {field.options?.map(option => (
          <AnimatedChoice
            key={option.value}
            type="radio"
            name={field.key}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            label={option.label}
          />
        ))}
      </div>
    </StaticField>
  );
}

export function CheckboxGroupField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const selected = Array.isArray(value) ? (value as string[]) : [];

  return (
    <StaticField
      as="legend"
      label={field.label}
      required={field.required}
      error={error}
      showOptional={false}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {field.options?.map(option => (
          <AnimatedChoice
            key={option.value}
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={checked =>
              onChange(
                checked
                  ? [...selected, option.value]
                  : selected.filter(item => item !== option.value)
              )
            }
            label={option.label}
          />
        ))}
      </div>
    </StaticField>
  );
}

export function CheckboxField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-start gap-3 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]"
      >
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          className="mt-0.5 h-4 w-4 accent-[var(--app-primary)]"
          aria-invalid={Boolean(error)}
          onChange={event => onChange(event.target.checked)}
        />
        <span>
          {field.label}
          {field.required ? (
            <span className="text-[var(--app-primary-dark)]"> *</span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p
          role="alert"
          className="font-ui text-caption font-medium text-[var(--status-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PhoneField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);
  const parsed = splitE164(typeof value === 'string' ? value : '');
  const currentCountry: CountryCode = parsed?.country ?? DEFAULT_PHONE_COUNTRY;
  const currentDial =
    parsed?.dial ??
    PHONE_COUNTRIES.find(item => item.iso === currentCountry)?.dial ??
    '+234';
  const currentNational = parsed?.national ?? '';

  return (
    <StaticField
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={error}
      help="Include your country code and active number, e.g. +2348012345678."
    >
      <PhoneNumberField
        id={id}
        country={currentCountry}
        number={currentNational}
        required={field.required}
        onCountryChange={country => {
          const dial =
            PHONE_COUNTRIES.find(item => item.iso === country)?.dial ??
            currentDial;
          onChange(`${dial}${currentNational.replace(/\D/g, '')}`);
        }}
        onNumberChange={number =>
          onChange(`${currentDial}${number.replace(/\D/g, '')}`)
        }
        inputClassName={cn(
          staticControlClass,
          controlFocusRing,
          error && controlErrorClass
        )}
        selectClassName={cn(staticControlClass, 'cursor-pointer px-2')}
        placeholder={field.placeholder || '8012345678'}
      />
    </StaticField>
  );
}

export function DateField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);
  const parsed = parseDDMMPartial(typeof value === 'string' ? value : '');
  const selectedDay = parsed?.day === '00' ? '' : parsed?.day || '';
  const selectedMonth = parsed?.month === '00' ? '' : parsed?.month || '';
  const monthNumber = selectedMonth ? Number(selectedMonth) : 12;
  const availableDays = Array.from(
    { length: daysInMonth(monthNumber) },
    (_, index) => String(index + 1).padStart(2, '0')
  );

  const selectClass = cn(
    staticControlClass,
    controlFocusRing,
    'cursor-pointer appearance-none pr-9',
    error && controlErrorClass
  );

  return (
    <StaticField
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={error}
      help="Day and month only."
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <select
            id={id}
            aria-label={`${field.label} — day`}
            className={selectClass}
            value={selectedDay}
            onChange={event =>
              onChange(toDDMM(event.target.value, selectedMonth))
            }
          >
            <option value="">Day</option>
            {availableDays.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
        <div className="relative">
          <select
            aria-label={`${field.label} — month`}
            className={selectClass}
            value={selectedMonth}
            onChange={event =>
              onChange(toDDMM(selectedDay, event.target.value))
            }
          >
            <option value="">Month</option>
            {MONTH_OPTIONS.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
      </div>
    </StaticField>
  );
}
