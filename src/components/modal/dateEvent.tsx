/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/DateEventsModal.tsx
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';

interface DateEventsModalProps {
  dateEvents: {
    date: Date;
    events: CalendarEvent[];
  };
  onClose: () => void;
  onViewEvents: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const DateEventsModal = ({
  dateEvents,
  onClose,
  onViewEvents,
  onEventClick,
}: DateEventsModalProps) => {
  const { colorScheme } = useTheme();

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const surfaceBackground = colorScheme.surface;
  const borderColor = colorScheme.primary;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <BaseText
                weight="black"
                className="text-xl lg:text-2xl mb-2"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                {dateEvents.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </BaseText>
              <BodyMD
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                {dateEvents.events.length} event
                {dateEvents.events.length > 1 ? 's' : ''} scheduled
              </BodyMD>
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

          {/* Events List */}
          <div className="space-y-4 mb-6">
            {dateEvents.events.map(event => (
              <div
                key={event.id}
                className="rounded-xl p-4 border-l-4 cursor-pointer transition-colors duration-300"
                style={{
                  backgroundColor: surfaceBackground,
                  borderLeftColor: colorScheme.primary,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.opacity.primary10;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = surfaceBackground;
                }}
                onClick={() => {
                  onClose();
                  onEventClick(event);
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {event.logo && <span className="text-xl">{event.logo}</span>}
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-bold"
                    style={{
                      backgroundColor: colorScheme.opacity.primary20,
                      color: colorScheme.primary,
                    }}
                  >
                    {event.type}
                  </span>
                </div>
                <SemiBoldText
                  className="mb-1"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  {event.title}
                </SemiBoldText>
                <BodySM
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  {event.time}
                </BodySM>
                <BodySM
                  style={{
                    color: subtitleTextColor,
                  }}
                  useThemeColor={false}
                >
                  {event.location}
                </BodySM>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onViewEvents}
              className="flex-1 py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
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
                View All Events
              </SemiBoldText>
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 py-3 rounded-xl transition-colors duration-300"
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
                Close
              </SemiBoldText>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
