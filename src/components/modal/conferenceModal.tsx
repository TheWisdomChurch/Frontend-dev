/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ConferenceModal.tsx
import { RegistrationFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';

interface ConferenceModalProps {
  formData: RegistrationFormData;
  formErrors: Partial<RegistrationFormData>;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ConferenceModal = ({
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onClose,
}: ConferenceModalProps) => {
  const { colorScheme } = useTheme();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 conference-modal"
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
            <div>
              <h3
                className="text-3xl font-black mb-2"
                style={{ color: colorScheme.text }}
              >
                Register for Wisdom Power Conference 2026
              </h3>
              <p style={{ color: colorScheme.textSecondary }}>
                Join us for this transformative spiritual gathering
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

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: colorScheme.text }}
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
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
                  style={{ color: colorScheme.text }}
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: colorScheme.text }}
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
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
                  style={{ color: colorScheme.text }}
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
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
              className="rounded-xl p-4"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                border: `1px solid ${colorScheme.opacity.primary20}`,
              }}
            >
              <p className="text-sm" style={{ color: colorScheme.primary }}>
                <strong>Note:</strong> After registration, you will receive a
                confirmation email with event details and next steps. For group
                registrations, please contact our events team directly.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: colorScheme.black }}
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
