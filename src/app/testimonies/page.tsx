'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { 
  H1, 
  H3, 
  Caption,
  BodyMD,
  BodySM,
  BodyLG
} from '@/components/text';
import { Button } from '@/components/utils/buttons';
import {
  Section,
  Container,
  GridboxLayout
} from '@/components/layout';
import {
  MessageSquare,
  User,
  Mail,
  Globe,
  Sparkles,
  ArrowLeft,
  Shield,
  Heart,
  BookOpen,
  Eye,
  Clock,
  Quote,
  Check,
  Users,
  Award
} from 'lucide-react';
import Link from 'next/link';

// Constants for better maintainability
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Extended Button with forwardRef support
const ExtendedButton = ({ children, ref, ...props }: any) => {
  return <Button ref={ref} {...props}>{children}</Button>;
};

export default function TestimoniesPage() {
  const { colorScheme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    testimony: '',
    anonymous: false,
    allowSharing: true,
    agreeToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for simple animations
  const headerRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Simple fade-in animation on mount
  useEffect(() => {
    const elements = [headerRef.current, formCardRef.current, infoCardRef.current];
    elements.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      }
    });
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'testimony') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setCharacterCount(value.length);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setSubmitting(true);

    // Simple button animation
    if (submitButtonRef.current) {
      submitButtonRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (submitButtonRef.current) {
          submitButtonRef.current.style.transform = 'scale(1)';
        }
      }, 200);
    }

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitting(false);
    alert('Thank you for sharing your testimony! It has been received and will be prayerfully reviewed.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      testimony: '',
      anonymous: false,
      allowSharing: true,
      agreeToTerms: false,
    });
    setCharacterCount(0);
  };

  // Helper function to get border color with primary opacity
  const getBorderColor = () => colorScheme.borderLight || colorScheme.border || '#e5e7eb';

  // Helper function to get focus color from color scheme
  const getFocusColor = () => colorScheme.focusBorder || colorScheme.primary;

  // Helper function to get focus ring style
  const getFocusRingStyle = () => ({
    '--tw-ring-color': getFocusColor() + '40', // 25% opacity
    '--tw-ring-offset-color': colorScheme.background || '#ffffff',
  } as React.CSSProperties);

  // Helper function to get primary background with opacity
  const getPrimaryBackgroundWithOpacity = () => 
    colorScheme.opacity?.primary10 || `${colorScheme.primary}1A`;

  return (
    <Section 
      padding="lg" 
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      style={{ backgroundColor: colorScheme.pageBackground || '#ffffff' }}
    >
      <Container size="xl">
       

        {/* Header Section */}
        <div 
          ref={headerRef}
          className="mb-12 lg:mb-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl mb-6 lg:mb-8"
              style={{ 
                background: getPrimaryBackgroundWithOpacity(),
                border: `1px solid ${getBorderColor()}`
              }}
            >
              <MessageSquare 
                className="w-8 h-8 lg:w-10 lg:h-10" 
                style={{ color: colorScheme.primary }} 
              />
            </div>
            
            <H1 
              className="mb-4 lg:mb-6 font-bold tracking-tight"
              style={{ 
                color: colorScheme.heading || colorScheme.text,
                background: colorScheme.primaryGradient || `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Share Your Testimony
            </H1>
            
            <BodyLG 
              className="mb-8 lg:mb-10 max-w-2xl mx-auto px-4"
              style={{ color: colorScheme.textSecondary }}
            >
              Your story of faith has the power to inspire, encourage, and bring glory to God. 
              Share what He has done in your life.
            </BodyLG>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          <GridboxLayout 
            columns={2} 
            gap="xl" 
            responsive={{ 
              xs: 1, 
              md: 2, 
              lg: 2 
            }}
            className="items-start"
          >
            {/* Form Card - Professional Layout */}
            <div 
              ref={formCardRef}
              className="h-full"
            >
              <div 
                className="rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl border h-full overflow-hidden"
                style={{ 
                  backgroundColor: colorScheme.surface,
                  borderColor: colorScheme.border
                }}
              >
                {/* Card Header */}
                <div 
                  className="border-b p-6 lg:p-8"
                  style={{ 
                    borderColor: colorScheme.borderLight,
                    background: `linear-gradient(to right, ${getPrimaryBackgroundWithOpacity()}, transparent)`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-xl shadow-xs"
                      style={{ backgroundColor: colorScheme.surfaceVariant || colorScheme.background }}
                    >
                      <BookOpen className="w-6 h-6" style={{ color: colorScheme.primary }} />
                    </div>
                    <div>
                      <H3 className="mb-1" style={{ color: colorScheme.text }}>
                        Your Testimony
                      </H3>
                      <BodySM style={{ color: colorScheme.textSecondary }}>
                        Share your story of faith and transformation
                      </BodySM>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-2">
                        <label className="block">
                          <BodySM className="font-semibold mb-1" style={{ color: colorScheme.text }}>
                            First Name
                          </BodySM>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5" 
                              style={{ color: colorScheme.textSecondary }} 
                            />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required={!formData.anonymous}
                              disabled={formData.anonymous}
                              className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-3.5 
                              rounded-lg lg:rounded-xl border focus:outline-none focus:ring-2 transition-all 
                              duration-200 hover:bg-opacity-50 text-sm lg:text-base"
                              style={{ 
                                borderColor: getBorderColor(),
                                backgroundColor: colorScheme.background,
                                color: colorScheme.text,
                                ...getFocusRingStyle()
                              }}
                              placeholder="John"
                            />
                          </div>
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="block">
                          <BodySM className="font-semibold mb-1" style={{ color: colorScheme.text }}>
                            Last Name
                          </BodySM>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5" 
                              style={{ color: colorScheme.textSecondary }} 
                            />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required={!formData.anonymous}
                              disabled={formData.anonymous}
                              className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-3.5 rounded-lg lg:rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-opacity-50 text-sm lg:text-base"
                              style={{ 
                                borderColor: getBorderColor(),
                                backgroundColor: colorScheme.background,
                                color: colorScheme.text,
                                ...getFocusRingStyle()
                              }}
                              placeholder="Doe"
                            />
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block">
                        <BodySM className="font-semibold mb-1" style={{ color: colorScheme.text }}>
                          Email Address *
                        </BodySM>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5" 
                            style={{ color: colorScheme.textSecondary }} 
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-3.5 rounded-lg lg:rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-opacity-50 text-sm lg:text-base"
                            style={{ 
                              borderColor: getBorderColor(),
                              backgroundColor: colorScheme.background,
                              color: colorScheme.text,
                              ...getFocusRingStyle()
                            }}
                            placeholder="john@example.com"
                          />
                        </div>
                      </label>
                    </div>

                    {/* Testimony */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <BodySM className="font-semibold" style={{ color: colorScheme.text }}>
                          Your Testimony *
                        </BodySM>
                        <BodySM style={{ color: colorScheme.textSecondary }}>
                          {characterCount}/1000
                        </BodySM>
                      </div>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5" 
                          style={{ color: colorScheme.textSecondary }} 
                        />
                        <textarea
                          name="testimony"
                          value={formData.testimony}
                          onChange={handleChange}
                          required
                          rows={isMobile ? 5 : 6}
                          maxLength={1000}
                          className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 rounded-lg lg:rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-opacity-50 resize-none leading-relaxed text-sm lg:text-base"
                          style={{ 
                            borderColor: getBorderColor(),
                            backgroundColor: colorScheme.background,
                            color: colorScheme.text,
                            ...getFocusRingStyle()
                          }}
                          placeholder="Share your story of what God has done in your life..."
                        />
                      </div>
                    </div>

                    {/* Checkbox Options */}
                    <div className="space-y-4 lg:space-y-5">
                      {[
                        { 
                          name: 'anonymous', 
                          checked: formData.anonymous, 
                          label: 'Share this testimony anonymously',
                          icon: Eye,
                          description: 'Your name will not be displayed'
                        },
                        { 
                          name: 'allowSharing', 
                          checked: formData.allowSharing, 
                          label: 'Allow sharing on church platforms',
                          icon: Globe,
                          description: 'Your testimony may be shared in services or online'
                        },
                        { 
                          name: 'agreeToTerms', 
                          checked: formData.agreeToTerms, 
                          label: 'I agree to the terms and conditions',
                          icon: Shield,
                          description: 'Required to submit your testimony',
                          required: true
                        },
                      ].map((checkbox) => (
                        <div key={checkbox.name} className="flex items-start gap-3 lg:gap-4">
                          <div className="relative mt-0.5">
                            <input
                              type="checkbox"
                              name={checkbox.name}
                              id={checkbox.name}
                              checked={checkbox.checked}
                              onChange={handleChange}
                              required={checkbox.required}
                              className="sr-only"
                            />
                            <label
                              htmlFor={checkbox.name}
                              className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded border-2 hover:border-opacity-80 transition-colors cursor-pointer"
                              style={{
                                backgroundColor: checkbox.checked ? colorScheme.primary : 'transparent',
                                borderColor: checkbox.checked ? colorScheme.primary : getBorderColor(),
                              }}
                            >
                              {checkbox.checked && (
                                <Check className="w-3 h-3 lg:w-4 lg:h-4" style={{ color: colorScheme.textInverted }} />
                              )}
                            </label>
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor={checkbox.name}
                              className="flex items-center gap-2 mb-1 cursor-pointer"
                            >
                              <checkbox.icon className="w-4 h-4" style={{ color: colorScheme.textSecondary }} />
                              <BodySM className="font-semibold" style={{ color: colorScheme.text }}>
                                {checkbox.label}
                              </BodySM>
                            </label>
                            {checkbox.description && (
                              <BodySM style={{ color: colorScheme.textSecondary }}>
                                {checkbox.description}
                              </BodySM>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 lg:pt-6">
                      <ExtendedButton
                        ref={submitButtonRef}
                        type="submit"
                        variant="primary"
                        size={isMobile ? "lg" : "xl"}
                        curvature="xl"
                        disabled={submitting || !formData.agreeToTerms}
                        className="w-full font-bold shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.textInverted,
                        }}
                        rightIcon={
                          submitting ? null : (
                            <div className="relative">
                              <Sparkles className="w-5 h-5 ml-2 transition-transform group-hover:rotate-12" />
                            </div>
                          )
                        }
                      >
                        <span className="relative z-10 tracking-wide">
                          {submitting ? 'SUBMITTING...' : 'SHARE YOUR TESTIMONY'}
                        </span>
                      </ExtendedButton>
                      
                      <div className="text-center mt-4 lg:mt-6">
                        <div className="inline-flex items-center gap-2 text-sm" style={{ color: colorScheme.textSecondary }}>
                          <Clock className="w-4 h-4" />
                          <span>Prayerfully reviewed within 48 hours</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Info Card - Professional Layout */}
            <div 
              ref={infoCardRef}
              className="h-full"
            >
              <div 
                className="rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl border h-full overflow-hidden"
                style={{ 
                  backgroundColor: colorScheme.surface,
                  borderColor: colorScheme.border
                }}
              >
                {/* Card Header */}
                <div 
                  className="border-b p-6 lg:p-8"
                  style={{ 
                    borderColor: colorScheme.borderLight,
                    background: `linear-gradient(to right, ${getPrimaryBackgroundWithOpacity()}, transparent)`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-xl shadow-xs"
                      style={{ backgroundColor: colorScheme.surfaceVariant || colorScheme.background }}
                    >
                      <Heart className="w-6 h-6" style={{ color: colorScheme.primary }} />
                    </div>
                    <div>
                      <H3 className="mb-1" style={{ color: colorScheme.text }}>
                        Why Share Your Story?
                      </H3>
                      <BodySM style={{ color: colorScheme.textSecondary }}>
                        Your testimony has eternal impact
                      </BodySM>
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-6 lg:p-8 space-y-6 lg:space-y-8">
                  {/* Introduction */}
                  <div>
                    <BodyMD className="leading-relaxed" style={{ color: colorScheme.textSecondary }}>
                      Your personal encounter with God's grace and faithfulness is a powerful tool 
                      for His kingdom. When we testify to His goodness, we participate in His 
                      redemptive work.
                    </BodyMD>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4 lg:space-y-6">
                    <H3 className="text-lg lg:text-xl font-semibold" style={{ color: colorScheme.text }}>
                      The Impact of Your Testimony
                    </H3>
                    <div className="grid grid-cols-1 gap-4 lg:gap-5">
                      {[
                        { 
                          title: "Brings Glory to God", 
                          description: "Your story showcases His power, mercy, and faithfulness for all to see",
                          icon: Award,
                          color: "bg-blue-500/10 text-blue-600"
                        },
                        { 
                          title: "Encourages Believers", 
                          description: "Strengthens the faith of fellow Christians in their journey",
                          icon: Users,
                          color: "bg-purple-500/10 text-purple-600"
                        },
                        { 
                          title: "Strengthens Your Faith", 
                          description: "Remembering God's faithfulness builds your trust for the future",
                          icon: Shield,
                          color: "bg-green-500/10 text-green-600"
                        },
                      ].map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                          <div 
                            key={index}
                            className="rounded-xl lg:rounded-2xl p-4 lg:p-5 border hover:shadow-sm transition-all duration-300"
                            style={{ 
                              backgroundColor: colorScheme.surface,
                              borderColor: colorScheme.borderLight
                            }}
                          >
                            <div className="flex items-start gap-3 lg:gap-4">
                              <div className={`p-2.5 lg:p-3 rounded-lg ${benefit.color}`}>
                                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                              </div>
                              <div className="flex-1">
                                <BodySM className="font-semibold mb-1" style={{ color: colorScheme.text }}>
                                  {benefit.title}
                                </BodySM>
                                <BodySM style={{ color: colorScheme.textSecondary }}>
                                  {benefit.description}
                                </BodySM>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Quote */}
                  <div className="rounded-xl lg:rounded-2xl p-5 lg:p-6 border"
                    style={{ 
                      backgroundColor: colorScheme.surface,
                      borderColor: getBorderColor()
                    }}
                  >
                    <div className="flex items-start gap-3 lg:gap-4">
                      <Quote className="w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0 mt-1" 
                        style={{ color: getPrimaryBackgroundWithOpacity() }} 
                      />
                      <div>
                        <blockquote className="italic text-base lg:text-lg leading-relaxed mb-3 lg:mb-4" style={{ color: colorScheme.text }}>
                          "They triumphed by the blood of the Lamb and by the word of their testimony."
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <BodySM className="font-medium" style={{ color: colorScheme.textSecondary }}>
                            — Revelation 12:11
                          </BodySM>
                          <BodySM className="font-medium" style={{ color: colorScheme.primary }}>
                            NIV
                          </BodySM>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="pt-4 lg:pt-6 border-t" style={{ borderColor: colorScheme.borderLight }}>
                    <H3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colorScheme.text }}>
                      Sharing Guidelines
                    </H3>
                    <ul className="space-y-2 lg:space-y-3">
                      {[
                        "Share your personal experience authentically",
                        "Focus on what God has done in your life",
                        "Be respectful and encouraging",
                        "Include scripture if relevant",
                        "Keep it concise and impactful"
                      ].map((guideline, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colorScheme.success }} />
                          <BodySM style={{ color: colorScheme.textSecondary }}>
                            {guideline}
                          </BodySM>
                        </li>
                      ))}
                    </ul>
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