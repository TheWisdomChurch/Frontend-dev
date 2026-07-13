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
import { H2, H3, BodyMD, BodyLG, BodySM, Caption } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { BaseModal } from '@/shared/ui/modals/Base';
import { apiClient } from '@/lib/api';

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
  const [submitError, setSubmitError] = useState<string>('');
  const errors: Partial<PastoralCareFormData> = {};

  const eventTypes = [
    'Counseling Session',
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
      setSubmitError('');

      const requiredFields: Array<keyof PastoralCareFormData> = [
        'title',
        'firstName',
        'lastName',
        'contactNumber',
        'email',
        'contactAddress',
        'eventDate',
        'eventType',
        'churchRole',
      ];
      const missing = requiredFields.some(
        field => !String(formData[field] || '').trim()
      );
      if (missing) {
        setSubmitError(
          'Please complete all required fields before submitting.'
        );
        return;
      }
      if (showCustomRole && !formData.customRole.trim()) {
        setSubmitError('Please provide your custom role.');
        return;
      }

      setIsSubmitting(true);

      try {
        await apiClient.submitPastoralCareRequest({
          title: formData.title,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber,
          email: formData.email,
          contactAddress: formData.contactAddress,
          eventDate: formData.eventDate,
          eventType: formData.eventType,
          churchRole: formData.churchRole,
          customRole: showCustomRole ? formData.customRole : undefined,
          comments: formData.comments,
          sourceChannel: 'frontend:web:pastoral-care',
        });

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSubmitError(
          error?.message ||
            'We could not submit your request right now. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, showCustomRole]
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
      className="relative overflow-hidden bg-[rgba(255,255,255,0.06)]"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 blur-3xl bg-[var(--app-primary)]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 blur-3xl bg-[var(--app-primary-dark)]" />
      </div>

      <Container size="xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Caption className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--app-primary)]">
            Pastoral Care Services
          </Caption>
          <H2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-[#000000]">
            Pastoral Care Events
          </H2>
          <BodyLG className="text-base sm:text-lg max-w-2xl mx-auto opacity-80 text-[rgba(255,255,255,0.65)]">
            Let us be part of your special moments. Register for pastoral care
            services and let our ministry team support you in your celebrations
            and milestones.
          </BodyLG>
        </div>

        {/* Registration Form */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-[rgba(255,255,255,0.12)] bg-white">
            {/* Form Header */}
            <div className="p-5 md:p-7 text-center text-white bg-[linear-gradient(135deg,var(--app-primary),var(--app-primary-dark))]">
              <H3 className="text-xl md:text-2xl font-semibold mb-1">
                Pastoral Care Request
              </H3>
              <BodyMD className="opacity-85 text-sm md:text-base">
                Share your details and we’ll follow up promptly. Email
                confirmation will be sent after submission.
              </BodyMD>
            </div>

            {/* Form Content */}
            <div className="p-5 md:p-7 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-[var(--app-primary)]" />
                    <H3 className="text-xl font-bold text-white">
                      Personal Information
                    </H3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-semibold mb-2 text-[#000000]"
                      >
                        Title *
                      </label>
                      <div className="relative">
                        <select
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.75 rounded-lg border transition-all duration-200 appearance-none cursor-pointer bg-white text-gray-900 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25"
                        >
                          <option value="">Select Title</option>
                          {titles.map(title => (
                            <option
                              key={title}
                              value={title}
                              className="bg-white text-gray-900"
                            >
                              {title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[var(--app-primary)]"
                          size={20}
                        />
                      </div>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#000000]">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-3.5 py-2.75 rounded-lg border transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
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
                        } bg-white text-gray-900 placeholder-gray-500`}
                      />
                      {errors.lastName && (
                        <Caption className="mt-1 text-red-400">
                          {errors.lastName}
                        </Caption>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
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
                          } bg-white text-gray-900 placeholder-gray-500`}
                        />
                      </div>
                      {errors.contactNumber && (
                        <Caption className="mt-1 text-red-400">
                          {errors.contactNumber}
                        </Caption>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
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
                          } bg-white text-gray-900 placeholder-gray-500`}
                        />
                      </div>
                      {errors.email && (
                        <Caption className="mt-1 text-red-400">
                          {errors.email}
                        </Caption>
                      )}
                    </div>

                    {/* Contact Address */}
                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
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
                          } bg-white text-gray-900 placeholder-gray-500`}
                        />
                      </div>
                      {errors.contactAddress && (
                        <Caption className="mt-1 text-red-400">
                          {errors.contactAddress}
                        </Caption>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details Section */}
                <div className="space-y-6 border-t border-white/[0.12] pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-[var(--app-primary)]" />
                    <H3 className="text-xl font-bold text-white">
                      Event Details
                    </H3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Date */}
                    <div>
                      <label
                        htmlFor="eventDate"
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
                      >
                        Event Date *
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          id="eventDate"
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
                          } bg-white text-gray-900`}
                        />
                      </div>
                      {errors.eventDate && (
                        <Caption className="mt-1 text-red-400">
                          {errors.eventDate}
                        </Caption>
                      )}
                    </div>

                    {/* Event Type */}
                    <div>
                      <label
                        htmlFor="eventType"
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
                      >
                        Event Type *
                      </label>
                      <div className="relative">
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 appearance-none cursor-pointer ${
                            errors.eventType
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } bg-white text-gray-900`}
                        >
                          <option value="">Select Event Type</option>
                          {eventTypes.map(type => (
                            <option
                              key={type}
                              value={type}
                              className="bg-white text-gray-900"
                            >
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[var(--app-primary)]"
                          size={20}
                        />
                      </div>
                      {errors.eventType && (
                        <Caption className="mt-1 text-red-400">
                          {errors.eventType}
                        </Caption>
                      )}
                    </div>

                    {/* Church Role */}
                    <div>
                      <label
                        htmlFor="churchRole"
                        className={`block text-sm font-semibold mb-2 text-[#000000]`}
                      >
                        Church Role Requested *
                      </label>
                      <div className="relative">
                        <select
                          id="churchRole"
                          name="churchRole"
                          value={formData.churchRole}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 appearance-none cursor-pointer ${
                            errors.churchRole
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20'
                          } bg-white text-gray-900`}
                        >
                          <option value="">Select Preferred Role</option>
                          {churchRoles.map(role => (
                            <option
                              key={role}
                              value={role}
                              className="bg-white text-gray-900"
                            >
                              {role}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[var(--app-primary)]"
                          size={20}
                        />
                      </div>
                      {errors.churchRole && (
                        <Caption className="mt-1 text-red-400">
                          {errors.churchRole}
                        </Caption>
                      )}
                    </div>

                    {/* Custom Role (conditionally shown) */}
                    {showCustomRole && (
                      <div>
                        <label
                          className={`block text-sm font-semibold mb-2 text-[#000000]`}
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
                          } bg-white text-gray-900 placeholder-gray-500`}
                        />
                        {errors.customRole && (
                          <Caption className="mt-1 text-red-400">
                            {errors.customRole}
                          </Caption>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Comments */}
                <div className="border-t border-white/[0.12] pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="w-5 h-5 text-[var(--app-primary)]" />
                    <H3 className="text-xl font-bold text-white">
                      Additional Information
                    </H3>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
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
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 resize-vertical bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-20"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  {submitError ? (
                    <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {submitError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-4 font-black text-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>

                  <BodyMD className="mt-4 text-center text-white/60">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--app-primary)]/10">
              <CheckCircle2 className="w-5 h-5 text-[var(--app-primary)]" />
            </div>
            <BodySM className="text-white/80">
              Thank you. Our team will review and reach out soon. A confirmation
              email has been sent to the address you provided.
            </BodySM>
          </div>
        </BaseModal>
      </Container>
    </Section>
  );
};

export default PastoralCareUnit;
