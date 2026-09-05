'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import type {
  PublicFormContentSection,
  PublicFormContentSectionItem,
  PublicFormField,
} from '@/lib/apiTypes';
import { isPhoneLikeField } from '@/lib/forms/fieldValue';
import { Notice } from '@/shared/ui/layout';
import {
  CheckboxField,
  CheckboxGroupField,
  ConsentDisclosure,
  DateField,
  ImageField,
  PhoneField,
  RadioGroupField,
  SelectField,
  TextField,
  TextareaField,
} from '@/shared/ui/forms';
import type { PublicFormEngine } from './usePublicFormEngine';

/* ============================================================================
   PublicFormFields — the body of a public form: intro copy, the field grid,
   the consent disclosure, and the submit error. Shared by the standalone
   `/forms/[slug]` page and any in-page modal (e.g. the Children's Ministry
   registration modal) so both render the exact same form for the exact same
   slug — one implementation, not a second copy to keep in sync.
============================================================================ */

const FIELD_GRID_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};

const FIELD_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.19, 1, 0.22, 1] as const },
  },
};

export interface PublicFormFieldsProps {
  engine: PublicFormEngine;
  reduceMotion: boolean | null;
}

export function PublicFormFields({
  engine,
  reduceMotion,
}: PublicFormFieldsProps) {
  const { presentation, answers, fieldErrors, handleChange, visibleFields } =
    engine;

  const renderField = (field: PublicFormField) => {
    const shared = {
      field,
      value: answers[field.key],
      error: fieldErrors[field.key],
      onChange: (value: unknown) => handleChange(field.key, value),
    };

    let control: ReactNode;
    if (field.type === 'textarea') control = <TextareaField {...shared} />;
    else if (field.type === 'select') control = <SelectField {...shared} />;
    else if (field.type === 'radio') control = <RadioGroupField {...shared} />;
    else if (field.type === 'checkbox' && field.options?.length)
      control = <CheckboxGroupField {...shared} />;
    else if (field.type === 'checkbox') control = <CheckboxField {...shared} />;
    else if (field.type === 'image')
      control = (
        <ImageField
          field={field}
          value={shared.value}
          error={shared.error}
          onChange={shared.onChange}
        />
      );
    else if (field.type === 'date') control = <DateField {...shared} />;
    else if (isPhoneLikeField(field)) control = <PhoneField {...shared} />;
    else control = <TextField {...shared} />;

    return (
      <motion.div
        key={field.key}
        layout={!reduceMotion}
        variants={FIELD_ITEM_VARIANTS}
      >
        {control}
      </motion.div>
    );
  };

  return (
    <>
      {presentation.headerNote ? (
        <Notice status="brand">{presentation.headerNote}</Notice>
      ) : null}

      {engine.draftRestored ? (
        <Notice status="brand">
          We restored your answers from where you left off.
        </Notice>
      ) : null}

      {engine.hasIntro ? (
        <div className="space-y-4 rounded-card border border-[var(--app-border)] bg-[var(--app-canvas)] p-5 sm:p-6">
          {presentation.detailItems.length > 0 ? (
            <ul className="space-y-3">
              {presentation.detailItems.map((item: string, index: number) => (
                <li key={`${item}-${index}`}>
                  <p className="font-ui text-body-sm font-semibold text-[var(--app-ink)]">
                    {item}
                  </p>
                  {presentation.detailSubtexts[index] ? (
                    <p className="mt-1 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                      {presentation.detailSubtexts[index]}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {presentation.sections.map((section: PublicFormContentSection) => (
            <section key={section.id || section.title}>
              <h2 className="font-ui text-body-md font-semibold text-[var(--app-ink)]">
                {section.title}
              </h2>
              {section.subtitle ? (
                <p className="mt-1 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                  {section.subtitle}
                </p>
              ) : null}
              {Array.isArray(section.items) && section.items.length > 0 ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {section.items.map(
                    (item: PublicFormContentSectionItem, index: number) => (
                      <div
                        key={`${section.title}-${item.title}-${index}`}
                        className="rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
                      >
                        {item.eyebrow ? (
                          <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-primary-dark)]">
                            {item.eyebrow}
                          </p>
                        ) : null}
                        <p className="mt-1 font-ui text-body-sm font-semibold text-[var(--app-ink)]">
                          {item.title}
                        </p>
                        {item.body ? (
                          <p className="mt-1.5 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                            {item.body}
                          </p>
                        ) : null}
                        {item.linkText && item.linkUrl ? (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex font-ui text-body-sm font-semibold text-[var(--app-primary-dark)] hover:underline"
                          >
                            {item.linkText}
                          </a>
                        ) : null}
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}

      <motion.div
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
        variants={FIELD_GRID_VARIANTS}
        className="flex flex-col gap-5"
      >
        {visibleFields.map(renderField)}
      </motion.div>

      <ConsentDisclosure
        consent={engine.consent}
        accepted={engine.consentAccepted}
        onAcceptedChange={value => {
          engine.setConsentAccepted(value);
          if (value) engine.setConsentError('');
        }}
        error={engine.consentError}
      />

      {engine.error ? <Notice status="error">{engine.error}</Notice> : null}
    </>
  );
}
