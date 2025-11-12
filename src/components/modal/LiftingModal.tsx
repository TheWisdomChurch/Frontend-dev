// components/modals/LiftingModal.tsx
import { RegistrationFormData } from '@/lib/types';

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 lifting-modal">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                Register for 7 Nights of Lifting
              </h3>
              <p className="text-gray-600">
                Join us for seven powerful nights of spiritual elevation
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                    formErrors.firstName
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-yellow-400'
                  }`}
                  placeholder="Enter your first name"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                    formErrors.lastName
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-yellow-400'
                  }`}
                  placeholder="Enter your last name"
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                    formErrors.email
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-yellow-400'
                  }`}
                  placeholder="Enter your email"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                    formErrors.phone
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-yellow-400'
                  }`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                    formErrors.country
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-yellow-400'
                  }`}
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
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.country}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Location/City *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                    formErrors.location
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-yellow-400'
                  }`}
                  placeholder="Enter your city"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This registration covers all seven nights
                of the event. You will receive a detailed schedule and
                preparation materials via email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
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
