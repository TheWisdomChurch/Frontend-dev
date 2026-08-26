'use client';

import type { CountryCode } from 'libphonenumber-js';
import { DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES } from '@/lib/validation/phone';
import { cn } from '@/lib/cn';

type PhoneNumberFieldProps = {
  country?: CountryCode;
  number: string;
  onCountryChange: (country: CountryCode) => void;
  onNumberChange: (number: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  selectClassName?: string;
  labelClassName?: string;
  className?: string;
  id?: string;
};

export function PhoneNumberField({
  country = DEFAULT_PHONE_COUNTRY,
  number,
  onCountryChange,
  onNumberChange,
  label,
  error,
  required,
  disabled,
  placeholder = 'Phone number',
  inputClassName,
  selectClassName,
  labelClassName,
  className,
  id = 'phone-number',
}: PhoneNumberFieldProps) {
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            'mb-2 block font-ui text-label font-bold',
            labelClassName
          )}
        >
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-[minmax(7.5rem,0.42fr)_minmax(0,1fr)]">
        <select
          id={`${id}-country`}
          name={`${id}-country`}
          aria-label="Phone country code"
          value={country}
          disabled={disabled}
          onChange={event => onCountryChange(event.target.value as CountryCode)}
          className={selectClassName}
        >
          {PHONE_COUNTRIES.map(item => (
            <option key={item.iso} value={item.iso}>
              {item.iso} {item.dial}
            </option>
          ))}
        </select>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          disabled={disabled}
          value={number}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={event => onNumberChange(event.target.value)}
          className={inputClassName}
        />
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className={cn('mt-1.5 text-xs text-[var(--status-error)]')}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
