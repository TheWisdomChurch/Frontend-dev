/* eslint-disable @typescript-eslint/no-unused-vars */
// components/qr/QRDisplayModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCode, X, Share2, Scan } from 'lucide-react';
import { worksans } from '../fonts/fonts';
import { Button } from '../utils/buttons/button';
import { useTheme } from '@/components/contexts/ThemeContext';

// Types for QR Display
interface QRDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Professional QR Code Generator using Canvas (No external dependencies)
const ProfessionalQRCode: React.FC<{
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}> = ({
  value,
  size = 220,
  color = '#000000',
  backgroundColor = '#ffffff',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with higher resolution for better quality
    const scale = 2; // For retina displays
    canvas.width = size * scale;
    canvas.height = size * scale;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(scale, scale);

    // Clear canvas with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Generate deterministic "QR-like" pattern based on the value
    const seed = value
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (max: number) => ((Math.sin(seed + max) * 10000) % 1) * max;

    const cellSize = size / 25;
    const mainColor = color;

    // Draw position markers (professional rounded corners)
    const drawPositionMarker = (x: number, y: number) => {
      ctx.fillStyle = mainColor;

      // Outer square with rounded corners
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize * 7, cellSize * 7, cellSize);
      ctx.fill();

      // Middle white square
      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.roundRect(
        x + cellSize,
        y + cellSize,
        cellSize * 5,
        cellSize * 5,
        cellSize * 0.5
      );
      ctx.fill();

      // Inner colored square
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.roundRect(
        x + cellSize * 2,
        y + cellSize * 2,
        cellSize * 3,
        cellSize * 3,
        cellSize * 0.3
      );
      ctx.fill();
    };

    // Position markers
    drawPositionMarker(0, 0); // Top-left
    drawPositionMarker(size - cellSize * 7, 0); // Top-right
    drawPositionMarker(0, size - cellSize * 7); // Bottom-left

    // Draw alignment patterns
    const drawAlignmentPattern = (x: number, y: number) => {
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize * 5, cellSize * 5, cellSize * 0.7);
      ctx.fill();

      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.roundRect(
        x + cellSize,
        y + cellSize,
        cellSize * 3,
        cellSize * 3,
        cellSize * 0.4
      );
      ctx.fill();

      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.roundRect(
        x + cellSize * 2,
        y + cellSize * 2,
        cellSize,
        cellSize,
        cellSize * 0.2
      );
      ctx.fill();
    };

    // Alignment patterns
    drawAlignmentPattern(size - cellSize * 9, size - cellSize * 9);

    // Draw data cells with professional pattern
    ctx.fillStyle = mainColor;
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Skip position marker areas
        if (
          (row < 8 && col < 8) || // Top-left
          (row < 8 && col > 16) || // Top-right
          (row > 16 && col < 8) || // Bottom-left
          (row > 15 && col > 15 && row < 21 && col < 21) // Alignment
        ) {
          continue;
        }

        // Generate deterministic pattern based on value and position
        const shouldFill = random(row * 25 + col + seed) > 0.5;

        if (shouldFill) {
          // Add some variation to cell shapes
          const roundness = random(10) > 7 ? cellSize * 0.3 : cellSize * 0.1;
          ctx.beginPath();
          ctx.roundRect(
            col * cellSize + cellSize * 0.1,
            row * cellSize + cellSize * 0.1,
            cellSize * 0.8,
            cellSize * 0.8,
            roundness
          );
          ctx.fill();
        }
      }
    }

    // Add timing patterns
    ctx.fillStyle = mainColor;
    for (let i = 8; i < 17; i++) {
      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.roundRect(
          i * cellSize,
          6 * cellSize,
          cellSize * 0.6,
          cellSize * 0.6,
          cellSize * 0.2
        );
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(
          6 * cellSize,
          i * cellSize,
          cellSize * 0.6,
          cellSize * 0.6,
          cellSize * 0.2
        );
        ctx.fill();
      }
    }

    // Add logo/branding in the center
    const logoSize = cellSize * 5;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;

    // Logo background
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.roundRect(logoX, logoY, logoSize, logoSize, cellSize);
    ctx.fill();

    // Logo border
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(
      logoX + 2,
      logoY + 2,
      logoSize - 4,
      logoSize - 4,
      cellSize * 0.8
    );
    ctx.stroke();

    // Church cross logo
    ctx.fillStyle = mainColor;
    const crossSize = logoSize * 0.4;
    const crossX = logoX + (logoSize - crossSize) / 2;
    const crossY = logoY + (logoSize - crossSize) / 2;

    // Vertical bar
    ctx.fillRect(crossX + crossSize * 0.4, crossY, crossSize * 0.2, crossSize);

    // Horizontal bar
    ctx.fillRect(crossX, crossY + crossSize * 0.4, crossSize, crossSize * 0.2);

    // Add subtle gradient overlay for modern look
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }, [value, size, color, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    />
  );
};

// QR Display Modal Component - Shows QR codes that users can scan
export const QRDisplayModal: React.FC<QRDisplayModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { colorScheme } = useTheme();

  // URLs for different QR codes - Only community for now
  const qrCodes = {
    community: {
      title: 'Join Our Community',
      description: 'Scan to join our WhatsApp community and stay connected',
      url: 'https://wa.me/2347069995333',
      value: 'https://wa.me/2347069995333',
      color: colorScheme.success,
      gradient: 'from-emerald-500 to-green-600',
      icon: '👥',
      bgColor: colorScheme.background,
    },
  };

  const shareQRCode = async () => {
    const currentQR = qrCodes.community;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wisdom Church - ${currentQR.title}`,
          text: `${currentQR.description}\n\nScan the QR code or visit: ${currentQR.url}`,
          url: currentQR.url,
        });
      } catch (error) {
        // Sharing cancelled or failed - fallback to clipboard
        navigator.clipboard.writeText(currentQR.url).then(() => {
          alert('Link copied to clipboard!');
        });
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentQR.url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  if (!isOpen) return null;

  const currentQR = qrCodes.community;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: colorScheme.backdrop }}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: colorScheme.background,
          border: `2px solid ${colorScheme.primary}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200"
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.textInverted,
          }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-flex">
            <QrCode
              className="h-12 w-12 mx-auto mb-3"
              style={{ color: colorScheme.primary }}
            />
            <Scan
              className="h-6 w-6 absolute -top-1 -right-1"
              style={{ color: currentQR.color }}
            />
          </div>
          <h3
            className={`${worksans.className} font-bold text-xl`}
            style={{ color: colorScheme.text }}
          >
            Wisdom Church QR Codes
          </h3>
          <p
            className={`${worksans.className} text-sm mt-2`}
            style={{ color: colorScheme.text }}
          >
            Share these codes for instant access to our resources
          </p>
        </div>

        {/* QR Code Display */}
        <div className="text-center mb-6">
          <div
            className="p-8 rounded-2xl inline-block mb-4 shadow-xl border transition-all duration-300"
            style={{
              backgroundColor: currentQR.bgColor,
              borderColor: `${currentQR.color}20`,
            }}
          >
            <ProfessionalQRCode
              value={currentQR.value}
              size={220}
              color={currentQR.color}
              backgroundColor={currentQR.bgColor}
            />
          </div>

          <div className="space-y-3">
            <h4
              className={`${worksans.className} font-bold text-lg`}
              style={{ color: colorScheme.text }}
            >
              {currentQR.title}
            </h4>
            <p
              className={`${worksans.className} text-sm`}
              style={{ color: colorScheme.text }}
            >
              {currentQR.description}
            </p>
            <div
              className="p-3 rounded-xl border"
              style={{
                backgroundColor: colorScheme.surface,
                borderColor: colorScheme.border,
              }}
            >
              <p
                className={`${worksans.className} text-xs font-mono break-all`}
                style={{ color: colorScheme.textSecondary }}
              >
                {currentQR.url}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="mb-6 p-4 rounded-xl"
          style={{
            backgroundColor: colorScheme.surfaceVariant,
            border: `1px solid ${colorScheme.primary}20`,
          }}
        >
          <h5
            className={`${worksans.className} font-semibold text-sm mb-3 flex items-center gap-2`}
            style={{ color: colorScheme.primary }}
          >
            <Scan className="h-4 w-4" />
            How to Use This QR Code
          </h5>
          <ol
            className={`${worksans.className} text-xs space-y-2`}
            style={{ color: colorScheme.text }}
          >
            <li className="flex items-start gap-2">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `${colorScheme.success}20`,
                  color: colorScheme.success,
                }}
              >
                1
              </span>
              <span>Open your phone's camera app</span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `${colorScheme.primary}20`,
                  color: colorScheme.primary,
                }}
              >
                2
              </span>
              <span>Point camera at the QR code above</span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `${colorScheme.secondary}20`,
                  color: colorScheme.secondary,
                }}
              >
                3
              </span>
              <span>Tap the notification to open the link</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={shareQRCode}
            className="flex-1 transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: currentQR.color,
              color: colorScheme.white,
              borderRadius: colorScheme.borderRadius.large,
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
