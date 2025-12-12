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
} from 'lucide-react';
import { H2, H3, BodyMD, BodyLG, Caption } from '@/components/text';
import { Section, Container } from '@/components/layout';
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

  const [errors, setErrors] = useState<Partial<PastoralCareFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);

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

      // Clear error when user starts typing
      if (errors[name as keyof PastoralCareFormData]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined,
        }));
      }

      // Show custom role input if "Custom Role" is selected
      if (name === 'churchRole') {
        setShowCustomRole(value === 'Custom Role');
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<PastoralCareFormData> = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contactAddress.trim())
      newErrors.contactAddress = 'Contact address is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.churchRole) newErrors.churchRole = 'Church role is required';
    if (formData.churchRole === 'Custom Role' && !formData.customRole.trim()) {
      newErrors.customRole = 'Please specify your preferred role';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation (basic)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (
      formData.contactNumber &&
      !phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))
    ) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData);

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

        // Show success message (you can replace this with a toast)
        alert(
          'Thank you! Your pastoral care request has been submitted successfully. We will contact you shortly.'
        );
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your request. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
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
            className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: isDarkMode
                ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)`
                : `linear-gradient(145deg, #ffffff, ${colorScheme.backgroundSecondary})`,
              border: `1px solid ${isDarkMode ? colorScheme.border : '#E5E7EB'}`,
            }}
          >
            {/* Form Header */}
            <div
              className="p-6 md:p-8 text-center text-white"
              style={{
                background: colorScheme.primaryGradient,
              }}
            >
              <H3 className="text-2xl md:text-3xl font-black mb-2">
                Event Registration Form
              </H3>
              <BodyMD className="opacity-90">
                Complete the form below to request pastoral care services for
                your special event
              </BodyMD>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8 lg:p-10">
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
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 appearance-none cursor-pointer ${
                            errors.title
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
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
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
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
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                        } ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
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
      </Container>
    </Section>
  );
};

export default PastoralCareUnit;
