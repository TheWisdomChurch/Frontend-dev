// components/modals/EventModal.tsx
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  const { colorScheme } = useTheme();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 event-modal"
      style={{ backgroundColor: colorScheme.backdrop }}
    >
      <div
        className="rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: colorScheme.background,
          border: `1px solid ${colorScheme.border}`,
        }}
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
                  className="inline-block px-4 py-2 rounded-full text-sm font-black mb-4"
                  style={{
                    backgroundColor: colorScheme.opacity.primary10,
                    color: colorScheme.primary,
                  }}
                >
                  {event.type}
                </span>
                <h3
                  className="text-3xl font-black mb-2"
                  style={{ color: colorScheme.text }}
                >
                  {event.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-2xl p-2 rounded-xl transition-colors duration-300"
              style={{
                color: colorScheme.textSecondary,
                backgroundColor: colorScheme.opacity.white10,
              }}
            >
              ✕
            </button>
          </div>

          {event.description && (
            <p
              className="text-lg mb-6 leading-relaxed"
              style={{ color: colorScheme.textSecondary }}
            >
              {event.description}
            </p>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <span
                className="font-black w-24"
                style={{ color: colorScheme.text }}
              >
                Date:
              </span>
              <span className="text-lg" style={{ color: colorScheme.text }}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="font-black w-24"
                style={{ color: colorScheme.text }}
              >
                Time:
              </span>
              <span className="text-lg" style={{ color: colorScheme.text }}>
                {event.time}
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="font-black w-24"
                style={{ color: colorScheme.text }}
              >
                Location:
              </span>
              <span className="text-lg" style={{ color: colorScheme.text }}>
                {event.location}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 py-4 rounded-xl font-black transition-colors duration-300 shadow-lg"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
            >
              Add to Calendar
            </button>
            <button
              className="flex-1 border-2 py-4 rounded-xl font-bold transition-colors duration-300"
              style={{
                borderColor: colorScheme.border,
                color: colorScheme.text,
                backgroundColor: colorScheme.background,
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
