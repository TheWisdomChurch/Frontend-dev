export type FlyerFormat = 'status_9_16' | 'square_1_1';
export type BadgeStyle = 'polaroid' | 'badge' | 'glass_card' | 'minimal';
export type BuiltinTheme =
  'event' | 'gold_majesty' | 'royal_midnight' | 'morning_glory' | 'sanctuary';

export interface ThemeOption {
  id: BuiltinTheme;
  label: string;
  desc: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'event',
    label: 'Program Flyer',
    desc: 'Original uploaded event banner',
  },
  {
    id: 'gold_majesty',
    label: 'Golden Majesty',
    desc: 'Deep obsidian & radiant gold luxury',
  },
  {
    id: 'royal_midnight',
    label: 'Royal Midnight',
    desc: 'Deep midnight navy with celestial gold',
  },
  {
    id: 'morning_glory',
    label: 'Morning Glory',
    desc: 'Warm sunrise champagne glow',
  },
  {
    id: 'sanctuary',
    label: 'Sanctuary',
    desc: 'Clean pearl slate & brushed gold',
  },
];

export interface FlyerRenderOptions {
  format: FlyerFormat;
  selectedTheme: BuiltinTheme;
  activeFlyerUrl?: string | null;
  photoSrc?: string | null;
  badgeStyle: BadgeStyle;
  attendeeName?: string;
  badgeText?: string;
  eventName: string;
  eventDate?: string;
  venueText?: string;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const header = parts[0] || '';
  const base64 = parts[1] || '';
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  theme: BuiltinTheme,
  w: number,
  h: number,
  eventName: string,
  eventDate?: string,
  venueText?: string
) {
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  if (theme === 'gold_majesty') {
    bgGrad.addColorStop(0, '#0a0a0c');
    bgGrad.addColorStop(0.45, '#19150f');
    bgGrad.addColorStop(0.8, '#2a1e0d');
    bgGrad.addColorStop(1, '#08080a');
  } else if (theme === 'royal_midnight') {
    bgGrad.addColorStop(0, '#060c18');
    bgGrad.addColorStop(0.5, '#0b1933');
    bgGrad.addColorStop(1, '#04070e');
  } else if (theme === 'morning_glory') {
    bgGrad.addColorStop(0, '#1c0f04');
    bgGrad.addColorStop(0.5, '#3b1c09');
    bgGrad.addColorStop(1, '#0d0703');
  } else {
    bgGrad.addColorStop(0, '#111827');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#090d16');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Decorative radial glow
  const radial = ctx.createRadialGradient(
    w * 0.5,
    h * 0.35,
    40,
    w * 0.5,
    h * 0.35,
    w * 0.85
  );
  radial.addColorStop(0, 'rgba(217, 119, 6, 0.22)');
  radial.addColorStop(0.6, 'rgba(180, 83, 9, 0.08)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);

  // Subtle header badge
  ctx.save();
  ctx.fillStyle = '#f59e0b';
  ctx.font =
    'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('✦ THE WISDOM CHURCH ✦', w / 2, 120);

  // Event title
  ctx.fillStyle = '#ffffff';
  ctx.font =
    'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '-0.5px';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 18;
  ctx.fillText(eventName, w / 2, 210);

  // Date & venue line
  if (eventDate || venueText) {
    ctx.fillStyle = 'rgba(253, 230, 138, 0.95)';
    ctx.font =
      '600 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.shadowBlur = 10;
    const meta = [eventDate, venueText].filter(Boolean).join('  •  ');
    ctx.fillText(meta, w / 2, 270);
  }
  ctx.restore();
}

function drawCurvedYellowArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  controlX: number,
  controlY: number,
  endX: number,
  endY: number
) {
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.fillStyle = '#facc15';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(controlX, controlY, endX, endY);
  ctx.stroke();

  const dx = endX - controlX;
  const dy = endY - controlY;
  const angle = Math.atan2(dy, dx);
  const headLength = 32;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPolaroidBadge(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement | null,
  centerX: number,
  centerY: number,
  cardWidth: number,
  nameText: string,
  tagline: string
) {
  const cardHeight = cardWidth * 1.34;
  const padding = cardWidth * 0.08;
  const photoWidth = cardWidth - padding * 2;
  const photoHeight = photoWidth * 1.08;
  const tiltAngle = 0.07; // 4 degrees

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(tiltAngle);

  // Card drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.48)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetX = 12;
  ctx.shadowOffsetY = 24;

  // Card background
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const radius = 18;
  const x = -cardWidth / 2;
  const y = -cardHeight / 2;
  ctx.roundRect(x, y, cardWidth, cardHeight, radius);
  ctx.fill();

  // Reset shadow for photo area
  ctx.shadowColor = 'transparent';

  const photoX = x + padding;
  const photoY = y + padding;

  if (userImg) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 8);
    ctx.clip();

    const imgAspect = userImg.width / userImg.height;
    const targetAspect = photoWidth / photoHeight;
    let sWidth = userImg.width;
    let sHeight = userImg.height;
    let sx = 0;
    let sy = 0;

    if (imgAspect > targetAspect) {
      sWidth = userImg.height * targetAspect;
      sx = (userImg.width - sWidth) / 2;
    } else {
      sHeight = userImg.width / targetAspect;
      sy = (userImg.height - sHeight) / 2;
    }

    ctx.drawImage(
      userImg,
      sx,
      sy,
      sWidth,
      sHeight,
      photoX,
      photoY,
      photoWidth,
      photoHeight
    );
    ctx.restore();
  } else {
    // Photo placeholder
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 8);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 ${cardWidth * 0.06}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Upload Your Photo', 0, photoY + photoHeight / 2);
  }

  // Photo inset border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 8);
  ctx.stroke();

  // Attendee Name stamp below photo
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  const nameFontSize = Math.min(cardWidth * 0.095, 52);
  ctx.font = `800 ${nameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.letterSpacing = '-0.5px';
  const labelY =
    photoY + photoHeight + (cardHeight - (photoY + photoHeight - y)) * 0.58;
  ctx.fillText(nameText || 'Special Guest', 0, labelY);

  ctx.restore();

  // Draw Calligraphic Script Tagline & Yellow Directional Arrow
  ctx.save();
  const scriptX = centerX - cardWidth * 0.72;
  const scriptY = centerY - cardHeight * 0.28;

  ctx.fillStyle = '#facc15';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.font =
    'italic bold 56px "Brush Script MT", "Segoe Script", cursive, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(tagline, scriptX, scriptY);

  // Curved Arrow pointing to photo
  drawCurvedYellowArrow(
    ctx,
    scriptX + 90,
    scriptY + 28,
    centerX - cardWidth * 0.2,
    scriptY + 80,
    centerX - cardWidth * 0.32,
    centerY - cardHeight * 0.05
  );
  ctx.restore();
}

function drawRoyalBadge(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement | null,
  centerX: number,
  centerY: number,
  size: number,
  nameText: string,
  tagline: string
) {
  ctx.save();
  ctx.translate(centerX, centerY);

  // Glowing outer ring
  const goldGrad = ctx.createLinearGradient(
    -size / 2,
    -size / 2,
    size / 2,
    size / 2
  );
  goldGrad.addColorStop(0, '#fef08a');
  goldGrad.addColorStop(0.5, '#d97706');
  goldGrad.addColorStop(1, '#b45309');

  ctx.shadowColor = 'rgba(217, 119, 6, 0.45)';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 14;

  ctx.beginPath();
  ctx.arc(0, 0, size * 0.48, 0, Math.PI * 2);
  ctx.stroke();

  ctx.shadowColor = 'transparent';

  if (userImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.clip();

    const imgAspect = userImg.width / userImg.height;
    let sWidth = userImg.width;
    let sHeight = userImg.height;
    let sx = 0;
    let sy = 0;
    if (imgAspect > 1) {
      sWidth = userImg.height;
      sx = (userImg.width - sWidth) / 2;
    } else {
      sHeight = userImg.width;
      sy = (userImg.height - sHeight) / 2;
    }
    ctx.drawImage(
      userImg,
      sx,
      sy,
      sWidth,
      sHeight,
      -size * 0.45,
      -size * 0.45,
      size * 0.9,
      size * 0.9
    );
    ctx.restore();
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Upload Photo', 0, 10);
  }

  // Name ribbon
  const ribbonW = size * 0.95;
  const ribbonH = 88;
  const ribbonY = size * 0.42;

  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 20;

  ctx.beginPath();
  ctx.roundRect(-ribbonW / 2, ribbonY, ribbonW, ribbonH, 18);
  ctx.fill();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff';
  ctx.font =
    'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(nameText || 'Special Guest', 0, ribbonY + 54);

  // Tagline on top
  ctx.fillStyle = '#fde68a';
  ctx.font =
    'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(tagline.toUpperCase(), 0, -size * 0.54);

  ctx.restore();
}

export async function renderFlyerCanvas(
  options: FlyerRenderOptions
): Promise<string> {
  const {
    format,
    selectedTheme,
    activeFlyerUrl,
    photoSrc,
    badgeStyle,
    attendeeName = 'Special Guest',
    badgeText = 'I Will Be Attending',
    eventName,
    eventDate,
    venueText = 'Wisdom Church · Live & In-Person',
  } = options;

  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = format === 'status_9_16' ? 1920 : 1080;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  // 1. Draw Background
  if (activeFlyerUrl) {
    try {
      const bgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = activeFlyerUrl;
      });

      const bgAspect = bgImg.width / bgImg.height;
      const targetAspect = width / height;
      let sWidth = bgImg.width;
      let sHeight = bgImg.height;
      let sx = 0;
      let sy = 0;

      if (bgAspect > targetAspect) {
        sWidth = bgImg.height * targetAspect;
        sx = (bgImg.width - sWidth) / 2;
      } else {
        sHeight = bgImg.width / targetAspect;
        sy = (bgImg.height - sHeight) / 2;
      }

      ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, width, height);

      // Light dark vignette overlay so badges stand out
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0,0,0,0.18)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.10)');
      grad.addColorStop(1, 'rgba(0,0,0,0.40)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } catch {
      drawThemeBackground(
        ctx,
        selectedTheme === 'event' ? 'gold_majesty' : selectedTheme,
        width,
        height,
        eventName,
        eventDate,
        venueText
      );
    }
  } else {
    drawThemeBackground(
      ctx,
      selectedTheme,
      width,
      height,
      eventName,
      eventDate,
      venueText
    );
  }

  // 2. Load User Photo
  let userImg: HTMLImageElement | null = null;
  if (photoSrc) {
    try {
      userImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = photoSrc;
      });
    } catch {
      userImg = null;
    }
  }

  // 3. Render Selected Badge Style
  const centerX = width * 0.58;
  const centerY = format === 'status_9_16' ? height * 0.58 : height * 0.54;

  if (badgeStyle === 'polaroid') {
    const cardWidth = width * 0.52;
    drawPolaroidBadge(
      ctx,
      userImg,
      centerX,
      centerY,
      cardWidth,
      attendeeName,
      badgeText
    );
  } else if (badgeStyle === 'badge') {
    const size = width * 0.54;
    drawRoyalBadge(
      ctx,
      userImg,
      width * 0.5,
      centerY,
      size,
      attendeeName,
      badgeText
    );
  } else {
    const cardWidth = width * 0.52;
    drawPolaroidBadge(
      ctx,
      userImg,
      centerX,
      centerY,
      cardWidth,
      attendeeName,
      badgeText
    );
  }

  return canvas.toDataURL('image/png', 0.95);
}
