/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/DateEventsModal.tsx
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';

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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 date-events-modal"
      style={{ backgroundColor: colorScheme.backdrop }}
    >
      <div
        className="rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: colorScheme.background,
          border: `1px solid ${colorScheme.border}`,
        }}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                className="text-2xl font-black mb-2"
                style={{ color: colorScheme.text }}
              >
                {dateEvents.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <p style={{ color: colorScheme.textSecondary }}>
                {dateEvents.events.length} event
                {dateEvents.events.length > 1 ? 's' : ''} scheduled
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors duration-300"
              style={{
                color: colorScheme.textSecondary,
                backgroundColor: colorScheme.opacity.white10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.white20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.white10;
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {dateEvents.events.map(event => (
              <div
                key={event.id}
                className="rounded-xl p-4 border-l-4 cursor-pointer transition-colors duration-300"
                style={{
                  backgroundColor: colorScheme.surface,
                  borderLeftColor: colorScheme.primary,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.opacity.white10;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.surface;
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
                <h4
                  className="font-bold mb-1"
                  style={{ color: colorScheme.text }}
                >
                  {event.title}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: colorScheme.textSecondary }}
                >
                  {event.time}
                </p>
                <p
                  className="text-sm"
                  style={{ color: colorScheme.textTertiary }}
                >
                  {event.location}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onViewEvents}
              className="flex-1 py-3 rounded-xl font-bold transition-colors duration-300 shadow-lg"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.primaryLight;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.primary;
              }}
            >
              View All Events
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 py-3 rounded-xl font-bold transition-colors duration-300"
              style={{
                borderColor: colorScheme.border,
                color: colorScheme.text,
                backgroundColor: colorScheme.background,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.white10;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.background;
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
