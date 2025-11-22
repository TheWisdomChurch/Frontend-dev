/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ReminderModal.tsx
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';
import { Button } from '@/components/ui/button';

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
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full p-2 transform hover:scale-110 transition-all duration-200"
          style={{
            backgroundColor: isDarkMode
              ? colorScheme.opacity.black10
              : colorScheme.opacity.white10,
            color: textColor,
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
        </Button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4"
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <span className="text-2xl" style={{ color: colorScheme.primary }}>
                ⏰
              </span>
            </div>

            <BaseText
              weight="black"
              className="text-2xl lg:text-3xl mb-4 tracking-tight"
              style={{ color: textColor }}
              useThemeColor={false}
            >
              Set Reminder
            </BaseText>

            <BodyMD
              className="opacity-90 leading-relaxed"
              style={{ color: secondaryTextColor }}
              useThemeColor={false}
            >
              Get notified about the{' '}
              {formData.eventType === 'conference'
                ? 'Wisdom Power Conference 2026'
                : '7 Nights of Lifting'}
            </BodyMD>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <SemiBoldText
                className="block text-sm mb-2"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Email Address *
              </SemiBoldText>
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
                <BodySM
                  className="mt-1"
                  style={{ color: colorScheme.error }}
                  useThemeColor={false}
                >
                  {formErrors.email}
                </BodySM>
              )}
            </div>

            {/* Frequency Select */}
            <div>
              <SemiBoldText
                className="block text-sm mb-2"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Reminder Frequency
              </SemiBoldText>
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

            {/* Event Type Select */}
            <div>
              <SemiBoldText
                className="block text-sm mb-2"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Event Type
              </SemiBoldText>
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

            {/* Information Section */}
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
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 flex-shrink-0">💡</span>
                <BodySM
                  className="leading-relaxed"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  <SemiBoldText
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    How it works:
                  </SemiBoldText>{' '}
                  We'll send you periodic updates about the event, including
                  important dates, speaker announcements, and registration
                  reminders.
                </BodySM>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSettingReminder}
              className="w-full py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
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
                <SemiBoldText
                  style={{ color: buttonTextColor }}
                  useThemeColor={false}
                >
                  Set Reminder
                </SemiBoldText>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
