'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDownToLine,
  Camera,
  Check,
  Image as ImageIcon,
  RotateCcw,
  Share2,
  Sparkles,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  type BadgeStyle,
  type BuiltinTheme,
  dataUrlToBlob,
  type FlyerFormat,
  renderFlyerCanvas,
  THEME_OPTIONS,
} from '@/lib/forms/flyerCanvas';

export interface FormAttendingBadgeSettings {
  enabled?: boolean;
  templateStyle?: 'polaroid' | 'badge' | 'glass_card' | 'minimal';
  badgeText?: string;
  customFlyerUrl?: string;
  photoShape?: 'rounded' | 'square' | 'circle';
  accentColor?: string;
  tagline?: string;
}

interface PersonalizedFlyerGeneratorProps {
  flyerUrl?: string;
  eventName: string;
  eventDate?: string;
  initialAttendeeName?: string;
  initialFullName?: string;
  badgeSettings?: FormAttendingBadgeSettings;
  shareUrl?: string;
  onDownloaded?: () => void;
}

export function PersonalizedFlyerGenerator({
  flyerUrl: initialFlyerUrl = '',
  eventName: initialEventName,
  eventDate: initialEventDate = '',
  initialAttendeeName = '',
  initialFullName = '',
  badgeSettings,
  shareUrl,
  onDownloaded,
}: PersonalizedFlyerGeneratorProps) {
  // Content states
  const [eventName, setEventName] = useState(
    initialEventName || 'Special Church Program'
  );
  const [eventDate, setEventDate] = useState(initialEventDate || '');
  const [attendeeName, setAttendeeName] = useState(initialAttendeeName);
  const [prevAttendeeProp, setPrevAttendeeProp] = useState(initialAttendeeName);
  if (prevAttendeeProp !== initialAttendeeName) {
    setPrevAttendeeProp(initialAttendeeName);
    setAttendeeName(initialAttendeeName);
  }
  const [badgeText, setBadgeText] = useState(
    badgeSettings?.badgeText || 'I Will Be Attending'
  );
  const venueText = 'Wisdom Church · Live & In-Person';

  // Media states
  const [customTemplateSrc, setCustomTemplateSrc] = useState<string | null>(
    null
  );
  const [selectedTheme, setSelectedTheme] = useState<BuiltinTheme>(
    initialFlyerUrl ? 'event' : 'gold_majesty'
  );
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  // Layout & Style states
  const [format, setFormat] = useState<FlyerFormat>('status_9_16');
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>(
    badgeSettings?.templateStyle || 'polaroid'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const activeFlyerUrl =
    customTemplateSrc || (selectedTheme === 'event' ? initialFlyerUrl : null);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG or WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      setPhotoSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image template');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      setCustomTemplateSrc(e.target?.result as string);
      setSelectedTheme('event');
      toast.success('Custom flyer canvas loaded!');
    };
    reader.readAsDataURL(file);
  };

  const generateCanvas = useCallback(async (): Promise<string> => {
    setIsGenerating(true);
    try {
      const dataUrl = await renderFlyerCanvas({
        format,
        selectedTheme,
        activeFlyerUrl,
        photoSrc,
        badgeStyle,
        attendeeName,
        badgeText,
        eventName,
        eventDate,
        venueText,
      });
      setPreviewDataUrl(dataUrl);
      return dataUrl;
    } finally {
      setIsGenerating(false);
    }
  }, [
    activeFlyerUrl,
    selectedTheme,
    format,
    photoSrc,
    badgeStyle,
    attendeeName,
    badgeText,
    eventName,
    eventDate,
    venueText,
  ]);

  // Re-generate canvas when properties change
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const run = () => {
      timeoutId = setTimeout(() => {
        generateCanvas().catch(() => {});
      }, 150);
    };
    run();
    return () => clearTimeout(timeoutId);
  }, [generateCanvas]);

  const handleDownload = async () => {
    try {
      const dataUrl = previewDataUrl || (await generateCanvas());
      const link = document.createElement('a');
      const cleanEventName = eventName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const cleanUserName = (attendeeName || 'guest')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      link.download = `wisdom-church-${cleanEventName}-${cleanUserName}-${format}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Your high-definition flyer has been downloaded!');
      onDownloaded?.();
    } catch {
      toast.error('Failed to export flyer. Please try again.');
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const dataUrl = previewDataUrl || (await generateCanvas());
      if (navigator.share) {
        const blob = dataUrlToBlob(dataUrl);
        const file = new File([blob], 'i-will-be-attending.png', {
          type: 'image/png',
        });
        await navigator.share({
          title: `${eventName} - I Will Be Attending!`,
          text: `I will be attending ${eventName} at Wisdom Church HQ! See you there.`,
          files: [file],
        });
      } else {
        const text = encodeURIComponent(
          `I will be attending ${eventName} at Wisdom Church HQ! Join me: ${shareUrl || window.location.href}`
        );
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      }
    } catch {
      const text = encodeURIComponent(
        `I will be attending ${eventName} at Wisdom Church HQ! Join me: ${shareUrl || window.location.href}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-xl sm:p-8">
      {/* Header bar with controls */}
      <div className="flex flex-col gap-4 border-b border-[var(--app-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--app-primary-10)] text-[var(--app-primary)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-[var(--app-ink)] sm:text-xl">
              &quot;I Will Be Attending&quot; Status Flyer Studio
            </h2>
          </div>
          <p className="mt-1 text-xs text-[var(--app-muted)]">
            Upload your picture, personalize your name, and export your official
            viral flyer for WhatsApp & Instagram.
          </p>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-canvas-2)] p-1">
          <button
            type="button"
            onClick={() => setFormat('status_9_16')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              format === 'status_9_16'
                ? 'bg-[var(--app-surface)] text-[var(--app-ink)] shadow-sm'
                : 'text-[var(--app-muted)] hover:text-[var(--app-ink)]'
            }`}
          >
            📱 WhatsApp Story (9:16)
          </button>
          <button
            type="button"
            onClick={() => setFormat('square_1_1')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              format === 'square_1_1'
                ? 'bg-[var(--app-surface)] text-[var(--app-ink)] shadow-sm'
                : 'text-[var(--app-muted)] hover:text-[var(--app-ink)]'
            }`}
          >
            🖼️ Square DP (1:1)
          </button>
        </div>
      </div>

      {/* Studio Workspace */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
        {/* Left Column: Live Canvas Preview */}
        <div className="flex flex-col items-center">
          <div
            className={`relative overflow-hidden rounded-2xl border-4 border-[var(--app-border)] bg-[var(--app-dark)] shadow-2xl ${
              format === 'status_9_16'
                ? 'aspect-[9/16] w-full max-w-[370px]'
                : 'aspect-square w-full max-w-[420px]'
            }`}
          >
            {previewDataUrl ? (
              <Image
                src={previewDataUrl}
                alt="Flyer Preview"
                fill
                unoptimized
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[var(--app-subtle)] text-sm">
                Rendering flyer preview...
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                <span className="rounded-full bg-black/80 px-4 py-2 text-xs font-bold text-white">
                  Updating Canvas...
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 text-center text-xs font-medium text-[var(--app-muted)]">
            High-Definition Output (
            {format === 'status_9_16' ? '1080 × 1920' : '1080 × 1080'})
          </p>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="space-y-6">
          {/* Section A: Template & Background Canvas */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                1. Base Canvas / Flyer Template
              </label>
              {customTemplateSrc && (
                <button
                  type="button"
                  onClick={() => setCustomTemplateSrc(null)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[var(--status-error)] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Reset to Default
                </button>
              )}
            </div>

            {/* Template Upload Hidden Input */}
            <input
              type="file"
              ref={templateInputRef}
              accept="image/*"
              onChange={handleTemplateSelect}
              className="hidden"
            />

            {customTemplateSrc ? (
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-[var(--app-primary)] bg-[var(--app-primary-10)] p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--app-primary)] text-white font-bold">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[var(--app-ink)]">
                      Custom Canvas Active
                    </p>
                    <p className="text-[11px] text-[var(--app-muted)]">
                      Custom background flyer loaded
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => templateInputRef.current?.click()}
                    className="rounded-lg border border-[var(--app-primary)] px-3 py-1 text-xs font-bold text-[var(--app-primary-dark)] hover:bg-[var(--app-primary-10)]"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomTemplateSrc(null)}
                    className="text-xs font-semibold text-[var(--status-error)] hover:underline p-1"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => templateInputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-canvas-2)] px-4 py-2.5 text-xs font-bold text-[var(--app-text)] hover:border-[var(--app-primary)] hover:bg-[var(--app-primary-10)]"
                >
                  <Upload className="h-4 w-4 text-[var(--app-primary)]" />
                  Upload Custom Event Canvas / Flyer
                </button>
              </div>
            )}

            {/* Built-in Theme Selector */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {THEME_OPTIONS.filter(
                t => t.id !== 'event' || Boolean(initialFlyerUrl)
              ).map(theme => {
                const isActive =
                  !customTemplateSrc && selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setCustomTemplateSrc(null);
                      setSelectedTheme(theme.id);
                    }}
                    className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition ${
                      isActive
                        ? 'border-[var(--app-primary)] bg-[var(--app-primary-10)] ring-2 ring-[var(--app-primary)]'
                        : 'border-[var(--app-border)] bg-[var(--app-canvas-2)] hover:border-[var(--app-primary)]'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-bold text-[var(--app-ink)]">
                        {theme.label}
                      </span>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                      )}
                    </div>
                    <span className="mt-0.5 text-[10px] text-[var(--app-muted)] line-clamp-1">
                      {theme.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Attendee Photo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
              2. Your Picture / Photo
            </label>
            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {!photoSrc ? (
              <div
                onClick={() => photoInputRef.current?.click()}
                className="mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--app-border)] bg-[var(--app-canvas-2)] p-5 text-center cursor-pointer transition hover:border-[var(--app-primary)] hover:bg-[var(--app-primary-10)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--app-primary-10)] text-[var(--app-primary)]">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-bold text-[var(--app-ink)]">
                  Tap to Upload Your Photo
                </span>
                <span className="mt-0.5 text-[11px] text-[var(--app-muted)]">
                  Select a clear portrait picture to frame in your badge
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoSrc}
                    alt="Preview"
                    className="h-11 w-11 rounded-full object-cover border border-[var(--app-border)]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[var(--app-ink)]">
                      Photo Attached
                    </p>
                    <p className="text-[11px] text-[var(--app-muted)]">
                      Framed inside your badge
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="rounded-lg border border-[var(--app-border)] px-3 py-1 text-xs font-bold text-[var(--app-text)] hover:bg-[var(--app-canvas-2)]"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSrc(null)}
                    className="text-xs font-semibold text-[var(--status-error)] hover:underline p-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Attendee Name & Display Name */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                  3. Display Name (on Flyer)
                </label>
                {initialAttendeeName && (
                  <span className="text-[10px] font-semibold text-[var(--app-primary)]">
                    Fetched from form
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-[var(--app-muted)]">
                This is the name rendered below your photo. You can pick your
                first name, full name, or enter any title.
              </p>

              {/* Quick Display Name Preset Chips */}
              {(initialAttendeeName || initialFullName) && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[var(--app-muted)]">
                    Presets:
                  </span>
                  {initialAttendeeName && (
                    <button
                      type="button"
                      onClick={() => setAttendeeName(initialAttendeeName)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                        attendeeName.toLowerCase() ===
                        initialAttendeeName.toLowerCase()
                          ? 'bg-[var(--app-primary)] text-white'
                          : 'border border-[var(--app-border)] bg-[var(--app-canvas-2)] text-[var(--app-text)] hover:border-[var(--app-primary)]'
                      }`}
                    >
                      First Name ({initialAttendeeName})
                    </button>
                  )}
                  {initialFullName &&
                    initialFullName.toLowerCase() !==
                      initialAttendeeName.toLowerCase() && (
                      <button
                        type="button"
                        onClick={() => setAttendeeName(initialFullName)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                          attendeeName.toLowerCase() ===
                          initialFullName.toLowerCase()
                            ? 'bg-[var(--app-primary)] text-white'
                            : 'border border-[var(--app-border)] bg-[var(--app-canvas-2)] text-[var(--app-text)] hover:border-[var(--app-primary)]'
                        }`}
                      >
                        Full Name ({initialFullName})
                      </button>
                    )}
                  {initialAttendeeName && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setAttendeeName(`Bro. ${initialAttendeeName}`)
                        }
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                          attendeeName === `Bro. ${initialAttendeeName}`
                            ? 'bg-[var(--app-primary)] text-white'
                            : 'border border-[var(--app-border)] bg-[var(--app-canvas-2)] text-[var(--app-text)] hover:border-[var(--app-primary)]'
                        }`}
                      >
                        Bro. {initialAttendeeName}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAttendeeName(`Sis. ${initialAttendeeName}`)
                        }
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                          attendeeName === `Sis. ${initialAttendeeName}`
                            ? 'bg-[var(--app-primary)] text-white'
                            : 'border border-[var(--app-border)] bg-[var(--app-canvas-2)] text-[var(--app-text)] hover:border-[var(--app-primary)]'
                        }`}
                      >
                        Sis. {initialAttendeeName}
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="mt-2">
                <input
                  type="text"
                  value={attendeeName}
                  onChange={e => setAttendeeName(e.target.value)}
                  placeholder="e.g. Sister Grace, Pastor David, Anuoluwapo"
                  className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5 text-sm text-[var(--app-ink)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-20)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                Badge Tagline Script
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={badgeText}
                  onChange={e => setBadgeText(e.target.value)}
                  placeholder="e.g. I Will Be Attending"
                  className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5 text-sm text-[var(--app-ink)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-20)]"
                />
              </div>
            </div>
          </div>

          {/* Section D: Event Details (Used in Built-in Themes) */}
          {selectedTheme !== 'event' && !customTemplateSrc && (
            <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-canvas-2)] p-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--app-muted)]">
                  Program Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    placeholder="Event Name"
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs text-[var(--app-ink)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--app-muted)]">
                  Date &amp; Venue
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    placeholder="Date or Time"
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs text-[var(--app-ink)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section E: Badge Style Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
              4. Badge Style Preset
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setBadgeStyle('polaroid')}
                className={`rounded-xl border p-2.5 text-center text-xs font-bold transition ${
                  badgeStyle === 'polaroid'
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary-10)] text-[var(--app-ink)] ring-2 ring-[var(--app-primary)]'
                    : 'border-[var(--app-border)] bg-[var(--app-canvas-2)] text-[var(--app-muted)] hover:border-[var(--app-primary)]'
                }`}
              >
                📸 Polaroid
              </button>
              <button
                type="button"
                onClick={() => setBadgeStyle('badge')}
                className={`rounded-xl border p-2.5 text-center text-xs font-bold transition ${
                  badgeStyle === 'badge'
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary-10)] text-[var(--app-ink)] ring-2 ring-[var(--app-primary)]'
                    : 'border-[var(--app-border)] bg-[var(--app-canvas-2)] text-[var(--app-muted)] hover:border-[var(--app-primary)]'
                }`}
              >
                👑 Royal VIP
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--app-primary)] px-6 py-4 text-sm font-bold text-[var(--app-dark)] shadow-lg shadow-black/10 transition hover:bg-[var(--app-primary-hover)] active:scale-[0.98]"
            >
              <ArrowDownToLine className="h-5 w-5" /> Download HD Status Flyer
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--app-whatsapp)] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-black/10 transition hover:opacity-90 active:scale-[0.98]"
            >
              <Share2 className="h-5 w-5" /> Share to WhatsApp Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
