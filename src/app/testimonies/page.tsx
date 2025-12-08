'use client';

import { useState } from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H1, H3, Caption } from '@/components/text';
import CustomButton from '@/components/utils/buttons/CustomButton';
import {
  Section,
  Container,
  FlexboxLayout,
  GridboxLayout,
} from '@/components/layout';
import {
  MessageSquare,
  User,
  Mail,
  //   Image as ImageIcon,
  Globe,
  Sparkles,
  ArrowLeft,
  Star,
} from 'lucide-react';
import Link from 'next/link';

export default function TestimoniesPage() {
  const { colorScheme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    testimony: '',
    anonymous: false,
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Implement actual API submission
    console.log('Submitting testimony:', formData);

    setTimeout(() => {
      setSubmitting(false);
      alert(
        'Thank you for sharing your testimony! It will be reviewed and published within 3-5 business days.'
      );
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        testimony: '',
        anonymous: false,
        rating: 5,
      });
    }, 1500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${i < rating ? 'fill-current' : ''}`}
        style={{
          color: i < rating ? colorScheme.primary : '#d1d5db',
        }}
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
      />
    ));
  };

  return (
    <Section padding="lg" className="min-h-screen bg-gray-50">
      <Container size="lg">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          className="text-center mb-12"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${colorScheme.primary}15` }}
          >
            <MessageSquare
              className="w-8 h-8"
              style={{ color: colorScheme.primary }}
            />
          </div>
          <H1
            className="mb-4"
            style={{ color: colorScheme.primary }}
            useThemeColor={false}
          >
            Share Your Testimony
          </H1>
          <Caption className="max-w-2xl text-gray-600">
            "Let the redeemed of the Lord tell their story" — Psalm 107:2
          </Caption>
        </FlexboxLayout>

        <div className="max-w-4xl mx-auto">
          <GridboxLayout columns={2} gap="lg" responsive={{ sm: 1, lg: 2 }}>
            {/* Form Section */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <H3 className="mb-6" useThemeColor={false}>
                  Your Story
                </H3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <GridboxLayout columns={2} gap="md">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none transition-all"
                          style={{
                            borderColor: `${colorScheme.primary}40`,
                          }}
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none transition-all"
                          style={{
                            borderColor: `${colorScheme.primary}40`,
                          }}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </GridboxLayout>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none transition-all"
                        style={{
                          borderColor: `${colorScheme.primary}40`,
                        }}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Rating (Optional)
                    </label>
                    <div className="flex items-center space-x-2">
                      {renderStars(formData.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {formData.rating} out of 5
                      </span>
                    </div>
                  </div>

                  {/* Testimony */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Testimony *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="testimony"
                        value={formData.testimony}
                        onChange={handleChange}
                        required
                        rows={5}
                        maxLength={1000}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none transition-all resize-none"
                        style={{
                          borderColor: `${colorScheme.primary}40`,
                        }}
                        placeholder="Share what God has done in your life..."
                      />
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {formData.testimony.length}/1000 characters
                    </div>
                  </div>

                  {/* Anonymous Checkbox */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="anonymous"
                      id="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300"
                      style={{ accentColor: colorScheme.primary }}
                    />
                    <label
                      htmlFor="anonymous"
                      className="text-sm text-gray-700"
                    >
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Share anonymously
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <CustomButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    curvature="xl"
                    disabled={submitting}
                    className="w-full py-4 font-bold mt-4"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: '#000000',
                    }}
                    rightIcon={
                      submitting ? null : <Sparkles className="w-5 h-5 ml-2" />
                    }
                  >
                    {submitting ? 'Submitting...' : 'Share Testimony'}
                  </CustomButton>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
                <div className="space-y-6">
                  <div>
                    <H3 className="mb-4" useThemeColor={false}>
                      Why Share Your Testimony?
                    </H3>
                    <p className="text-gray-600 mb-4">
                      Your personal story of God's faithfulness can:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"
                          style={{
                            backgroundColor: `${colorScheme.primary}15`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorScheme.primary }}
                          />
                        </div>
                        <span className="text-gray-700">
                          Bring glory to God
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"
                          style={{
                            backgroundColor: `${colorScheme.primary}15`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorScheme.primary }}
                          />
                        </div>
                        <span className="text-gray-700">
                          Encourage other believers
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"
                          style={{
                            backgroundColor: `${colorScheme.primary}15`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorScheme.primary }}
                          />
                        </div>
                        <span className="text-gray-700">
                          Lead others to Christ
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"
                          style={{
                            backgroundColor: `${colorScheme.primary}15`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorScheme.primary }}
                          />
                        </div>
                        <span className="text-gray-700">
                          Strengthen your own faith
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <H3 className="mb-4 text-sm font-semibold text-gray-900">
                      Review Process
                    </H3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: colorScheme.primary }}
                        />
                        All testimonies are prayerfully reviewed
                      </li>
                      <li className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: colorScheme.primary }}
                        />
                        You'll receive a confirmation email
                      </li>
                      <li className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: colorScheme.primary }}
                        />
                        Published within 3-5 business days
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <blockquote className="italic text-gray-700 p-4 bg-gray-50 rounded-lg">
                      "They triumphed by the blood of the Lamb and by the word
                      of their testimony."
                      <footer className="text-gray-500 text-sm mt-2">
                        — Revelation 12:11
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </GridboxLayout>
        </div>
      </Container>
    </Section>
  );
}
