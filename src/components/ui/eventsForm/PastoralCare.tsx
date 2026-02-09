'use client';

import { useState, useCallback } from 'react';
import {
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { H2, H3, BodyMD, BodyLG, Caption } from '@/components/text';
import { Section, Container } from '@/components/layout';
import { BaseModal } from '@/components/modal/Base';
import { useTheme } from '@/components/contexts/ThemeContext';

interface PastoralCareFormData {
  title: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  contactAddress: string;
  eventDate: string;
  eventType: string;
  churchRole: string;
  customRole: string;
  comments: string;
}

const PastoralCareUnit = () => {
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme.background === '#000000';

  const [formData, setFormData] = useState<PastoralCareFormData>({
    title: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    contactAddress: '',
    eventDate: '',
    eventType: '',
    churchRole: '',
    customRole: '',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const errors: Partial<PastoralCareFormData> = {};

  const eventTypes = [
    'Wedding Ceremony',
    'Naming Ceremony',
    'Birthday Celebration',
    'Child Dedication',
    'Housewarming',
    'Funeral Service',
    'Thanksgiving Service',
    'Anniversary Celebration',
    'Other Special Event',
  ];

  const churchRoles = [
    'Officiating Minister',
    'Guest Minister',
    'Prayer Partner',
    'Worship Leader',
    'Event Coordinator',
    'Custom Role',
  ];

  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Pastor'];

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // Show custom role input if "Custom Role" is selected
      if (name === 'churchRole') {
        setShowCustomRole(value === 'Custom Role');
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsSubmitting(true);

      try {
        // TODO: replace with real API call; backend should validate and send confirmation email
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Reset form
        setFormData({
          title: '',
          firstName: '',
          lastName: '',
          contactNumber: '',
          email: '',
          contactAddress: '',
          eventDate: '',
          eventType: '',
          churchRole: '',
          customRole: '',
          comments: '',
        });
        setShowCustomRole(false);

        setShowSuccess(true);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const getMinDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const getMaxDate = useCallback(() => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().split('T')[0];
  }, []);

  return (
    <Section
      padding="xl"
      className="relative overflow-hidden"
      style={{
        backgroundColor: isDarkMode
          ? '#000000'
          : colorScheme.backgroundSecondary,
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: colorScheme.primary }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: colorScheme.secondary }}
        />
      </div>

      <Container size="xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Caption
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: colorScheme.primary }}
          >
            Pastoral Care Services
          </Caption>
          <H2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
          >
            Pastoral Care Events
          </H2>
          <BodyLG
            className="text-base sm:text-lg max-w-2xl mx-auto opacity-80"
            style={{
              color: isDarkMode
                ? colorScheme.textSecondary
                : colorScheme.textTertiary,
            }}
          >
            Let us be part of your special moments. Register for pastoral care
            services and let our ministry team support you in your celebrations
            and milestones.
          </BodyLG>
        </div>

        {/* Registration Form */}
        <div className="max-w-4xl mx-auto">
            <div
              className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border"
              style={{
                background: isDarkMode
                  ? colorScheme.surface
                  : '#0b0b0b',
                borderColor: isDarkMode ? colorScheme.border : 'rgba(255,255,255,0.08)',
              }}
            >
              {/* Form Header */}
              <div
                className="p-5 md:p-7 text-center text-white"
                style={{
                  background: colorScheme.primaryGradient,
                }}
              >
                <H3 className="text-xl md:text-2xl font-semibold mb-1">
                  Pastoral Care Request
                </H3>
                <BodyMD className="opacity-85 text-sm md:text-base">
                  Share your details and we’ll follow up promptly. Email confirmation will be sent after submission.
                </BodyMD>
              </div>

              {/* Form Content */}
              <div className="p-5 md:p-7 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <User
                        className="w-5 h-5"
                      style={{ color: colorScheme.primary }}
                    />
                    <H3
                      className="text-xl font-bold"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Personal Information
                    </H3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Title *
                      </label>
                      <div className="relative">
                        <select
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`w-full px-3.5 py-2.75 rounded-lg border transition-all duration-200 appearance-none cursor-pointer ${
                            isDarkMode ? 'bg-gray-900 text-white border-white/10' : 'bg-white text-gray-900 border-white/10'
                          } focus:border-primary focus:ring-2 focus:ring-primary/25`}
                        >
                          <option value="">Select Title</option>
                          {titles.map(title => (
                            <option key={title} value={title}>
                              {title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                          size={20}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    </div>

                    {/* First Name */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className={`w-full px-3.5 py-2.75 rounded-lg border transition-all duration-200 ${
                          isDarkMode ? 'bg-gray-900 text-white placeholder-gray-500 border-white/10' : 'bg-white text-gray-900 placeholder-gray-500 border-white/10'
                        } focus:border-primary focus:ring-2 focus:ring-primary/25`}
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                        } ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            errors.contactNumber
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                        />
                      </div>
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Contact Address */}
                    <div className="md:col-span-2">
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Contact Address *
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-3 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          name="contactAddress"
                          value={formData.contactAddress}
                          onChange={handleInputChange}
                          placeholder="Enter your complete address"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            errors.contactAddress
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                        />
                      </div>
                      {errors.contactAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details Section */}
                <div
                  className="space-y-6 pt-6 border-t"
                  style={{
                    borderColor: isDarkMode ? colorScheme.border : '#E5E7EB',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: colorScheme.primary }}
                    />
                    <H3
                      className="text-xl font-bold"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Event Details
                    </H3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Date */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Event Date *
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          min={getMinDate()}
                          max={getMaxDate()}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            errors.eventDate
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                        />
                      </div>
                      {errors.eventDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.eventDate}
                        </p>
                      )}
                    </div>

                    {/* Event Type */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Event Type *
                      </label>
                      <div className="relative">
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 appearance-none cursor-pointer ${
                            errors.eventType
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                        >
                          <option value="">Select Event Type</option>
                          {eventTypes.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                          size={20}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                      {errors.eventType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.eventType}
                        </p>
                      )}
                    </div>

                    {/* Church Role */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        Church Role Requested *
                      </label>
                      <div className="relative">
                        <select
                          name="churchRole"
                          value={formData.churchRole}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 appearance-none cursor-pointer ${
                            errors.churchRole
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                        >
                          <option value="">Select Preferred Role</option>
                          {churchRoles.map(role => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                          size={20}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                      {errors.churchRole && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.churchRole}
                        </p>
                      )}
                    </div>

                    {/* Custom Role (conditionally shown) */}
                    {showCustomRole && (
                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                        >
                          Specify Custom Role *
                        </label>
                        <input
                          type="text"
                          name="customRole"
                          value={formData.customRole}
                          onChange={handleInputChange}
                          placeholder="Enter your preferred role"
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            errors.customRole
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                        />
                        {errors.customRole && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.customRole}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Comments */}
                <div
                  className="pt-6 border-t"
                  style={{
                    borderColor: isDarkMode ? colorScheme.border : '#E5E7EB',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <MessageCircle
                      className="w-5 h-5"
                      style={{ color: colorScheme.primary }}
                    />
                    <H3
                      className="text-xl font-bold"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Additional Information
                    </H3>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Additional Comments or Special Requests
                    </label>
                    <div className="relative">
                      <MessageCircle
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Please share any additional details, special requests, or specific needs for your event..."
                        rows={4}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 resize-vertical ${
                          isDarkMode
                            ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                            : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: colorScheme.primaryGradient,
                      color: '#000000',
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Registration'
                    )}
                  </button>

                  <BodyMD
                    className="text-center mt-4 opacity-70"
                    style={{
                      color: isDarkMode
                        ? colorScheme.textSecondary
                        : colorScheme.textTertiary,
                    }}
                  >
                    We&apos;ll contact you within 24-48 hours to discuss your
                    event details and confirm arrangements.
                  </BodyMD>
                </div>
              </form>
            </div>
          </div>
        </div>
      <BaseModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Request received"
        subtitle="We've emailed a confirmation of your pastoral care request."
        maxWidth="max-w-md"
        showHandle
        forceBottomSheet
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.opacity.primary10 }}><CheckCircle2 className="w-5 h-5" style={{ color: colorScheme.primary }} /></div>
          <p className="text-white/80 text-sm leading-relaxed">Thank you. Our team will review and reach out soon. A confirmation email has been sent to the address you provided.</p>
        </div>
      </BaseModal>

      </Container>
    </Section>
  );
};

export default PastoralCareUnit;
