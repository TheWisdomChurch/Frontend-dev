/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ReminderModal.tsx
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';

interface ReminderModalProps {
  formData: ReminderFormData;
  formErrors: Partial<ReminderFormData>;
  isSettingReminder: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ReminderModal = ({
  formData,
  formErrors,
  isSettingReminder,
  onInputChange,
  onSubmit,
  onClose,
}: ReminderModalProps) => {
  const { colorScheme } = useTheme();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 reminder-modal"
      style={{ backgroundColor: colorScheme.backdrop }}
    >
      <div
        className="rounded-3xl shadow-2xl max-w-md w-full"
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
                Set Reminder
              </h3>
              <p style={{ color: colorScheme.textSecondary }}>
                Get notified about the{' '}
                {formData.eventType === 'conference'
                  ? 'Wisdom Power Conference 2026'
                  : '7 Nights of Lifting'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl p-2 rounded-xl transition-colors duration-300"
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
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: colorScheme.text }}
              >
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: formErrors.email
                    ? colorScheme.error
                    : colorScheme.border,
                  backgroundColor: colorScheme.background,
                  color: colorScheme.text,
                }}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p
                  className="text-sm mt-1"
                  style={{ color: colorScheme.error }}
                >
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: colorScheme.text }}
              >
                Reminder Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={onInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: colorScheme.border,
                  backgroundColor: colorScheme.background,
                  color: colorScheme.text,
                }}
              >
                <option value="daily">Daily Updates</option>
                <option value="weekly">Weekly Updates</option>
                <option value="monthly">Monthly Updates</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: colorScheme.text }}
              >
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={onInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: colorScheme.border,
                  backgroundColor: colorScheme.background,
                  color: colorScheme.text,
                }}
              >
                <option value="conference">Wisdom Power Conference 2026</option>
                <option value="lifting">7 Nights of Lifting</option>
              </select>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                border: `1px solid ${colorScheme.opacity.primary20}`,
              }}
            >
              <p className="text-sm" style={{ color: colorScheme.primary }}>
                <strong>How it works:</strong> We'll send you periodic updates
                about the event, including important dates, speaker
                announcements, and registration reminders.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSettingReminder}
              className="w-full py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                if (!isSettingReminder) {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSettingReminder) {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }
              }}
            >
              {isSettingReminder ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: colorScheme.black }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Setting Reminder...
                </span>
              ) : (
                'Set Reminder'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
