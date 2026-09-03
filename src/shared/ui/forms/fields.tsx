'use client';

import { useId } from 'react';
import type { CountryCode } from 'libphonenumber-js';

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

import { Field, controlClass, controlErrorClass } from './Field';
import { PhoneNumberField } from './PhoneNumberField';

/* ============================================================================
   Field renderers — one per control type. Each owns its own <Field> shell and
   accessible wiring; the renderer only supplies value / error / onChange.
============================================================================ */

export interface FieldControlProps {
  field: PublicFormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

const choiceClass =
  'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-input border border-[var(--app-border)] bg-[var(--app-canvas)] px-3.5 py-2 font-ui text-body-sm text-[var(--app-muted)] transition hover:border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)] hover:bg-[var(--app-surface)] has-[:checked]:border-[var(--app-primary)] has-[:checked]:bg-[var(--app-primary-10)] has-[:checked]:text-[var(--app-ink)]';

function useFieldId(field: PublicFormField) {
  const generated = useId();
  return `ff-${field.key || generated}`;
}

export function TextField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);

  return (
    <Field
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={error}
    >
      <input
        id={id}
        type={getFieldInputType(field)}
        className={cn(controlClass, error && controlErrorClass)}
        placeholder={field.placeholder}
        value={typeof value === 'string' ? value : ''}
        aria-invalid={Boolean(error)}
        onChange={event => onChange(event.target.value)}
      />
    </Field>
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

  return (
    <Field
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={error}
      labelAside={
        typeof maxWords === 'number' ? (
          <span
            className={words > maxWords ? 'text-[var(--status-error)]' : ''}
          >
            {words}/{maxWords} words
          </span>
        ) : undefined
      }
    >
      <textarea
        id={id}
        rows={5}
        className={cn(
          controlClass,
          'min-h-[8.5rem] resize-y leading-7',
          error && controlErrorClass
        )}
        placeholder={field.placeholder}
        value={text}
        aria-invalid={Boolean(error)}
        onChange={event => onChange(event.target.value)}
      />
    </Field>
  );
}

export function SelectField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const id = useFieldId(field);

  return (
    <Field
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={error}
    >
      <select
        id={id}
        className={cn(
          controlClass,
          'cursor-pointer',
          error && controlErrorClass
        )}
        value={typeof value === 'string' ? value : ''}
        aria-invalid={Boolean(error)}
        onChange={event => onChange(event.target.value)}
      >
        <option value="" disabled>
          {field.placeholder || 'Select an option'}
        </option>
        {field.options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function RadioGroupField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  return (
    <Field
      as="legend"
      label={field.label}
      required={field.required}
      error={error}
      showOptional={false}
    >
      <div className="mt-1 grid gap-2 sm:grid-cols-2">
        {field.options?.map(option => (
          <label key={option.value} className={choiceClass}>
            <input
              type="radio"
              name={field.key}
              value={option.value}
              checked={value === option.value}
              className="h-4 w-4 accent-[var(--app-primary)]"
              onChange={event => onChange(event.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </Field>
  );
}

export function CheckboxGroupField({
  field,
  value,
  error,
  onChange,
}: FieldControlProps) {
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optionValue: string, checked: boolean) => {
    onChange(
      checked
        ? [...selected, optionValue]
        : selected.filter(item => item !== optionValue)
    );
  };

  return (
    <Field
      as="legend"
      label={field.label}
      required={field.required}
      error={error}
      showOptional={false}
    >
      <div className="mt-1 grid gap-2 sm:grid-cols-2">
        {field.options?.map(option => (
          <label key={option.value} className={choiceClass}>
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              className="h-4 w-4 accent-[var(--app-primary)]"
              onChange={event => toggle(option.value, event.target.checked)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </Field>
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
    <Field
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
        inputClassName={cn(controlClass, error && controlErrorClass)}
        selectClassName={cn(controlClass, 'cursor-pointer px-2')}
        placeholder={field.placeholder || '8012345678'}
      />
    </Field>
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

  return (
    <Field
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={error}
      help="Day and month only."
    >
      <div className="grid grid-cols-2 gap-2">
        <select
          id={id}
          aria-label={`${field.label} — day`}
          className={cn(
            controlClass,
            'cursor-pointer',
            error && controlErrorClass
          )}
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
        <select
          aria-label={`${field.label} — month`}
          className={cn(
            controlClass,
            'cursor-pointer',
            error && controlErrorClass
          )}
          value={selectedMonth}
          onChange={event => onChange(toDDMM(selectedDay, event.target.value))}
        >
          <option value="">Month</option>
          {MONTH_OPTIONS.map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}
