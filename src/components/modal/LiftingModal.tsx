/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/LiftingModal.tsx
import { RegistrationFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';

interface LiftingModalProps {
  formData: RegistrationFormData;
  formErrors: Partial<RegistrationFormData>;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const LiftingModal = ({
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onClose,
}: LiftingModalProps) => {
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
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 lg:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                className="text-2xl lg:text-3xl font-black mb-2"
                style={{ color: textColor }}
              >
                Register for 7 Nights of Lifting
              </h3>
              <p
                className="text-sm lg:text-base"
                style={{ color: secondaryTextColor }}
              >
                Join us for seven powerful nights of spiritual elevation
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: textColor }}
                >
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: formErrors.firstName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your first name"
                />
                {formErrors.firstName && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: colorScheme.error }}
                  >
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: textColor }}
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: formErrors.lastName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your last name"
                />
                {formErrors.lastName && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: colorScheme.error }}
                  >
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: formErrors.phone
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: colorScheme.error }}
                  >
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: textColor }}
                >
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: formErrors.country
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="NG">Nigeria</option>
                  <option value="GH">Ghana</option>
                  <option value="ZA">South Africa</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.country && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: colorScheme.error }}
                  >
                    {formErrors.country}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: textColor }}
                >
                  Location/City *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: formErrors.location
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your city"
                />
                {formErrors.location && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: colorScheme.error }}
                  >
                    {formErrors.location}
                  </p>
                )}
              </div>
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
                className="text-sm"
                style={{
                  color: isDarkMode
                    ? colorScheme.primary
                    : colorScheme.primaryLight,
                }}
              >
                <strong>Note:</strong> This registration covers all seven nights
                of the event. You will receive a detailed schedule and
                preparation materials via email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? colorScheme.gray[800]
                    : colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = buttonBackground;
                }
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: buttonTextColor }}
                  />
                  Processing Registration...
                </span>
              ) : (
                'Complete Registration'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
