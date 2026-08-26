'use client';

import { City, Country, State } from 'country-state-city';
import { useMemo } from 'react';
import { DEFAULT_PHONE_COUNTRY } from '@/lib/validation/phone';

export type LocationValue = {
  country: string;
  state: string;
  city: string;
};

type LocationFieldsProps = {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  errors?: Partial<Record<keyof LocationValue, string>>;
  required?: boolean;
  disabled?: boolean;
  selectClassName?: string;
  className?: string;
};

export function LocationFields({
  value,
  onChange,
  errors = {},
  required,
  disabled,
  selectClassName,
  className = 'grid gap-4 sm:grid-cols-3',
}: LocationFieldsProps) {
  const countries = useMemo(
    () =>
      Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const country = value.country || DEFAULT_PHONE_COUNTRY;
  const states = useMemo(() => State.getStatesOfCountry(country), [country]);
  const cities = useMemo(
    () => (value.state ? City.getCitiesOfState(country, value.state) : []),
    [country, value.state]
  );

  return (
    <div className={className}>
      <div>
        <select
          aria-label="Country"
          value={country}
          required={required}
          disabled={disabled}
          className={selectClassName}
          onChange={event =>
            onChange({ country: event.target.value, state: '', city: '' })
          }
        >
          {countries.map(item => (
            <option key={item.isoCode} value={item.isoCode}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.country ? (
          <p className="mt-1 text-xs text-[var(--status-error)]">
            {errors.country}
          </p>
        ) : null}
      </div>
      <div>
        {states.length ? (
          <select
            aria-label="State or province"
            value={value.state}
            required={required}
            disabled={disabled}
            className={selectClassName}
            onChange={event =>
              onChange({
                ...value,
                country,
                state: event.target.value,
                city: '',
              })
            }
          >
            <option value="">State / province</option>
            {states.map(item => (
              <option key={item.isoCode} value={item.isoCode}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            aria-label="State or province"
            placeholder="State / province"
            value={value.state}
            required={required}
            disabled={disabled}
            className={selectClassName}
            onChange={event =>
              onChange({
                ...value,
                country,
                state: event.target.value,
                city: '',
              })
            }
          />
        )}
        {errors.state ? (
          <p className="mt-1 text-xs text-[var(--status-error)]">
            {errors.state}
          </p>
        ) : null}
      </div>
      <div>
        {cities.length ? (
          <select
            aria-label="City"
            value={value.city}
            required={required}
            disabled={disabled || !value.state}
            className={selectClassName}
            onChange={event =>
              onChange({ ...value, country, city: event.target.value })
            }
          >
            <option value="">City</option>
            {cities.map(item => (
              <option key={`${item.name}-${item.latitude}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            aria-label="City"
            placeholder="City"
            value={value.city}
            required={required}
            disabled={disabled || !value.state}
            className={selectClassName}
            onChange={event =>
              onChange({ ...value, country, city: event.target.value })
            }
          />
        )}
        {errors.city ? (
          <p className="mt-1 text-xs text-[var(--status-error)]">
            {errors.city}
          </p>
        ) : null}
      </div>
    </div>
  );
}
