/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ReminderModal.tsx
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';

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
  const inputBackground = isDarkMode ? colorScheme.white : colorScheme.surface;
  const inputBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.border;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: colorScheme.backdrop }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative rounded-3xl w-full max-w-md border shadow-2xl"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                className="text-2xl font-black mb-2"
                style={{ color: textColor }}
              >
                Set Reminder
              </h3>
              <p style={{ color: secondaryTextColor }}>
                Get notified about the{' '}
                {formData.eventType === 'conference'
                  ? 'Wisdom Power Conference 2026'
                  : '7 Nights of Lifting'}
              </p>
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

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: textColor }}
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
                    : inputBorderColor,
                  backgroundColor: inputBackground,
                  color: textColor,
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
                style={{ color: textColor }}
              >
                Reminder Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={onInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: inputBorderColor,
                  backgroundColor: inputBackground,
                  color: textColor,
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
                style={{ color: textColor }}
              >
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={onInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: inputBorderColor,
                  backgroundColor: inputBackground,
                  color: textColor,
                }}
              >
                <option value="conference">Wisdom Power Conference 2026</option>
                <option value="lifting">7 Nights of Lifting</option>
              </select>
            </div>

            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.primary10
                  : colorScheme.opacity.primary20,
                borderColor: isDarkMode
                  ? colorScheme.opacity.primary20
                  : colorScheme.opacity.primary30,
              }}
            >
              <p
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? colorScheme.primary
                    : colorScheme.primaryLight,
                }}
              >
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
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                if (!isSettingReminder) {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? colorScheme.gray[800]
                    : colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSettingReminder) {
                  e.currentTarget.style.backgroundColor = buttonBackground;
                }
              }}
            >
              {isSettingReminder ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: buttonTextColor }}
                  />
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
