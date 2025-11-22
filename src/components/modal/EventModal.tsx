/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/EventModal.tsx
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';
import { BaseText, BodyLG, BodyMD, SemiBoldText } from '@/components/text';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  const { colorScheme } = useTheme();

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const borderColor = colorScheme.primary;

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
                    backgroundColor: colorScheme.opacity.primary10,
                    color: colorScheme.primary,
                  }}
                >
                  {event.logo}
                </div>
              )}
              <div>
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm mb-4"
                  style={{
                    backgroundColor: colorScheme.opacity.primary10,
                    color: colorScheme.primary,
                  }}
                >
                  <SemiBoldText
                    style={{ color: colorScheme.primary }}
                    useThemeColor={false}
                  >
                    {event.type}
                  </SemiBoldText>
                </span>
                <BaseText
                  weight="black"
                  className="text-3xl mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  {event.title}
                </BaseText>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors duration-300 flex-shrink-0"
              style={{
                color: textColor,
                backgroundColor: colorScheme.opacity.primary10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {event.description && (
            <BodyLG
              className="mb-6 leading-relaxed"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              {event.description}
            </BodyLG>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <SemiBoldText
                className="w-24"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Date:
              </SemiBoldText>
              <BodyMD style={{ color: textColor }} useThemeColor={false}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </BodyMD>
            </div>
            <div className="flex items-center">
              <SemiBoldText
                className="w-24"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Time:
              </SemiBoldText>
              <BodyMD style={{ color: textColor }} useThemeColor={false}>
                {event.time}
              </BodyMD>
            </div>
            <div className="flex items-center">
              <SemiBoldText
                className="w-24"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Location:
              </SemiBoldText>
              <BodyMD style={{ color: textColor }} useThemeColor={false}>
                {event.location}
              </BodyMD>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.primaryLight;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = buttonBackground;
              }}
            >
              <SemiBoldText
                style={{ color: buttonTextColor }}
                useThemeColor={false}
              >
                Add to Calendar
              </SemiBoldText>
            </button>
            <button
              className="flex-1 border-2 py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: borderColor,
                color: textColor,
                backgroundColor: modalBackground,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = modalBackground;
              }}
            >
              <SemiBoldText style={{ color: textColor }} useThemeColor={false}>
                Share Event
              </SemiBoldText>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
