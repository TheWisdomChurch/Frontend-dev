/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/EventModal.tsx
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const modalBackground = isDarkMode ? colorScheme.white : '#000000f0';
  const textColor = isDarkMode ? colorScheme.black : colorScheme.white;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';
  const buttonBackground = isDarkMode ? colorScheme.black : colorScheme.primary;
  const buttonTextColor = isDarkMode ? colorScheme.white : colorScheme.black;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: colorScheme.backdrop }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border shadow-2xl"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-4">
              {event.logo && (
                <div
                  className="text-4xl p-3 rounded-xl"
                  style={{
                    backgroundColor: isDarkMode
                      ? colorScheme.opacity.primary10
                      : colorScheme.opacity.primary20,
                    color: colorScheme.primary,
                  }}
                >
                  {event.logo}
                </div>
              )}
              <div>
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-black mb-4"
                  style={{
                    backgroundColor: isDarkMode
                      ? colorScheme.opacity.primary10
                      : colorScheme.opacity.primary20,
                    color: colorScheme.primary,
                  }}
                >
                  {event.type}
                </span>
                <h3
                  className="text-3xl font-black mb-2"
                  style={{ color: textColor }}
                >
                  {event.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors duration-300 flex-shrink-0"
              style={{
                color: textColor,
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black20
                  : colorScheme.opacity.white20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10;
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {event.description && (
            <p
              className="text-lg mb-6 leading-relaxed"
              style={{ color: secondaryTextColor }}
            >
              {event.description}
            </p>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <span className="font-black w-24" style={{ color: textColor }}>
                Date:
              </span>
              <span className="text-lg" style={{ color: textColor }}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-black w-24" style={{ color: textColor }}>
                Time:
              </span>
              <span className="text-lg" style={{ color: textColor }}>
                {event.time}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-black w-24" style={{ color: textColor }}>
                Location:
              </span>
              <span className="text-lg" style={{ color: textColor }}>
                {event.location}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 py-4 rounded-xl font-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.gray[800]
                  : colorScheme.primaryLight;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = buttonBackground;
              }}
            >
              Add to Calendar
            </button>
            <button
              className="flex-1 border-2 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: borderColor,
                color: textColor,
                backgroundColor: modalBackground,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = modalBackground;
              }}
            >
              Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
