'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ImagePlus, Loader2, RefreshCw, UploadCloud, X } from 'lucide-react';

import { cn } from '@/lib/cn';
import apiClient from '@/lib/api';
import type { PublicFormField } from '@/lib/apiTypes';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  readFileAsDataURL,
} from '@/lib/forms/fieldValue';

import { StaticField } from './Field';

/* ============================================================================
   ImageField — drag-and-drop / click image picker with an instant preview.
   Uploads on select to the shared public uploads endpoint and keeps only the
   hosted URL; if that upload fails the raw file is retained and submitted as a
   base64 data URL (the backend materialises it), so a member is never blocked.
============================================================================ */

export type ImageFieldValue =
  | null
  | {
      status: 'uploading' | 'error';
      file: File;
      previewUrl: string;
      name: string;
      size: number;
      message?: string;
      /** A rejected file (wrong type / too large) blocks submit; a failed
       *  upload does not — the bytes are sent as a data URL fallback. */
      blocking?: boolean;
    }
  | {
      status: 'done';
      url: string;
      previewUrl: string;
      name: string;
      size: number;
      /** Kept so a failed upstream URL can still fall back to the bytes. */
      file?: File;
    };

export function isImageFieldValue(
  value: unknown
): value is NonNullable<ImageFieldValue> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in (value as Record<string, unknown>)
  );
}

export function imageFieldIsBusy(value: unknown): boolean {
  return isImageFieldValue(value) && value.status === 'uploading';
}

/** True when the chosen file was rejected outright (wrong type / too large) and
 *  the form must not be submitted until it is replaced. */
export function imageFieldHasBlockingError(value: unknown): boolean {
  return (
    isImageFieldValue(value) &&
    value.status === 'error' &&
    Boolean((value as { blocking?: boolean }).blocking)
  );
}

/** Resolve the value to store in the submission payload (hosted URL, or a
 *  base64 fallback when the upload never completed). */
export async function resolveImageSubmissionValue(
  value: unknown
): Promise<string | undefined> {
  if (!isImageFieldValue(value)) return undefined;
  if (value.status === 'done') return value.url || undefined;
  if (value.status === 'error' && (value as { blocking?: boolean }).blocking) {
    return undefined;
  }
  if ('file' in value && value.file) return readFileAsDataURL(value.file);
  return undefined;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Use a JPEG, PNG, or WebP image.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be 5MB or smaller.';
  }
  return null;
}

export interface ImageFieldProps {
  field: PublicFormField;
  value: unknown;
  error?: string;
  onChange: (value: ImageFieldValue) => void;
}

export function ImageField({ field, value, error, onChange }: ImageFieldProps) {
  const generatedId = useId();
  const id = `ff-${field.key || generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const reduceMotion = useReducedMotion();

  const current = isImageFieldValue(value) ? value : null;

  const setObjectUrl = useCallback((file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    return url;
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const upload = useCallback(
    async (file: File, previewUrl: string) => {
      try {
        const res = await apiClient.uploadPublicImage(file);
        const url = (res.url || res.publicUrl || '').trim();
        if (!url) throw new Error('empty url');
        onChange({
          status: 'done',
          url,
          previewUrl,
          name: file.name,
          size: file.size,
        });
      } catch {
        // Upload endpoint unavailable — keep the bytes; submit sends a base64
        // data URL as the fallback path (the backend materialises it).
        onChange({
          status: 'error',
          file,
          previewUrl,
          name: file.name,
          size: file.size,
          message:
            'Upload failed — your photo will still be sent when you submit.',
        });
      }
    },
    [onChange]
  );

  const accept = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      const validationError = validateFile(file);
      const previewUrl = setObjectUrl(file);

      if (validationError) {
        onChange({
          status: 'error',
          file,
          previewUrl,
          name: file.name,
          size: file.size,
          message: validationError,
          blocking: true,
        });
        return;
      }

      onChange({
        status: 'uploading',
        file,
        previewUrl,
        name: file.name,
        size: file.size,
      });
      void upload(file, previewUrl);
    },
    [onChange, setObjectUrl, upload]
  );

  const clear = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  };

  const help = 'JPEG, PNG, or WebP · up to 5MB.';
  const showError =
    error || (current?.status === 'error' ? current.message : undefined);

  return (
    <StaticField
      htmlFor={id}
      label={field.label}
      required={field.required}
      error={showError}
      help={help}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="sr-only"
        aria-invalid={Boolean(showError)}
        onChange={event => accept(event.target.files?.[0])}
      />

      <AnimatePresence mode="wait" initial={false}>
        {current ? (
          <motion.div
            key="preview"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-4 rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
          >
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--app-canvas-2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.previewUrl}
                alt={`${field.label} preview`}
                className="h-full w-full object-cover"
              />
              {current.status === 'uploading' ? (
                <span className="absolute inset-0 grid place-items-center bg-black/45 text-white">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                </span>
              ) : null}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate font-ui text-body-sm font-medium text-[var(--app-ink)]">
                {current.name}
              </span>
              <span className="mt-0.5 block font-ui text-caption text-[var(--app-subtle)]">
                {current.status === 'uploading'
                  ? 'Uploading…'
                  : current.status === 'error'
                    ? 'Saved — will send on submit'
                    : `${formatBytes(current.size)} · ready`}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="grid h-9 w-9 place-items-center rounded-lg text-[var(--app-subtle)] transition hover:bg-[var(--app-canvas-2)] hover:text-[var(--app-ink)]"
                aria-label="Replace image"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={clear}
                className="grid h-9 w-9 place-items-center rounded-lg text-[var(--app-subtle)] transition hover:bg-[var(--app-canvas-2)] hover:text-[var(--status-error)]"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          </motion.div>
        ) : (
          <motion.button
            key="dropzone"
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={event => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={event => {
              event.preventDefault();
              setDragging(false);
              accept(event.dataTransfer.files?.[0]);
            }}
            className={cn(
              'flex w-full flex-col items-center justify-center gap-2 rounded-input border border-dashed px-4 py-8 text-center transition',
              dragging
                ? 'border-[var(--app-primary)] bg-[var(--app-primary-10)]'
                : 'border-[var(--app-border)] bg-[var(--app-canvas)] hover:border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)] hover:bg-[var(--app-surface)]'
            )}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--app-primary-10)] text-[var(--app-primary-dark)]">
              {dragging ? (
                <UploadCloud className="h-5 w-5" aria-hidden="true" />
              ) : (
                <ImagePlus className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <span className="font-ui text-body-sm font-medium text-[var(--app-ink)]">
              {dragging
                ? 'Drop to upload'
                : 'Tap to upload or drag an image here'}
            </span>
            <span className="font-ui text-caption text-[var(--app-subtle)]">
              {help}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </StaticField>
  );
}
