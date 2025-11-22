/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/LiftingModal.tsx
import { RegistrationFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';

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

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const surfaceBackground = colorScheme.surface;
  const borderColor = colorScheme.primary;
  const inputBorderColor = colorScheme.border;

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
              <BaseText
                weight="black"
                className="text-2xl lg:text-3xl mb-2"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Register for 7 Nights of Lifting
              </BaseText>
              <BodyMD
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                Join us for seven powerful nights of spiritual elevation
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

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <SemiBoldText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  First Name *
                </SemiBoldText>
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
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your first name"
                />
                {formErrors.firstName && (
                  <BodySM
                    className="mt-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.firstName}
                  </BodySM>
                )}
              </div>

              <div>
                <SemiBoldText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Last Name *
                </SemiBoldText>
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
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your last name"
                />
                {formErrors.lastName && (
                  <BodySM
                    className="mt-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.lastName}
                  </BodySM>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <SemiBoldText
                  className="block mb-2"
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
                    backgroundColor: surfaceBackground,
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

              <div>
                <SemiBoldText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Phone Number *
                </SemiBoldText>
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
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <BodySM
                    className="mt-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.phone}
                  </BodySM>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <SemiBoldText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Country *
                </SemiBoldText>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: formErrors.country
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
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
                  <BodySM
                    className="mt-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.country}
                  </BodySM>
                )}
              </div>

              <div>
                <SemiBoldText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Location/City *
                </SemiBoldText>
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
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your city"
                />
                {formErrors.location && (
                  <BodySM
                    className="mt-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.location}
                  </BodySM>
                )}
              </div>
            </div>

            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <BodySM
                style={{
                  color: colorScheme.primary,
                }}
                useThemeColor={false}
              >
                <SemiBoldText
                  style={{
                    color: colorScheme.primary,
                  }}
                  useThemeColor={false}
                >
                  Note:
                </SemiBoldText>{' '}
                This registration covers all seven nights of the event. You will
                receive a detailed schedule and preparation materials via email.
              </BodySM>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
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
                  <BaseText
                    weight="bold"
                    style={{ color: buttonTextColor }}
                    useThemeColor={false}
                  >
                    Processing Registration...
                  </BaseText>
                </span>
              ) : (
                <SemiBoldText
                  style={{ color: buttonTextColor }}
                  useThemeColor={false}
                >
                  Complete Registration
                </SemiBoldText>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
