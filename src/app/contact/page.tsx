/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, BaseText, LightText } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import Button from '@/components/utils/CustomButton';

const ContactPage = () => {
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const sectionBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const cardTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const formBackground = isDarkMode
    ? colorScheme.surface
    : colorScheme.backgroundSecondary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';
  const inputBackground = isDarkMode ? colorScheme.white : colorScheme.surface;
  const inputBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.border;

  const contactMethods = [
    {
      title: 'Visit Us',
      description: 'Come worship with us in person',
      details: [
        'Adress will be here',
        'XXX-XXXX',
        'Sunday Services: 8:00 AM & 10:30 AM',
      ],
      icon: '📍',
    },
    {
      title: 'Call Us',
      description: 'Speak with our church office',
      details: [
        'Main Office: (XXX) 123-XXXX',
        'Pastoral Care: (XXX) 123-XXXX',
        'Office Hours: Mon-Fri 9AM-5PM',
      ],
      icon: '📞',
    },
    {
      title: 'Email Us',
      description: 'Send us a message anytime',
      details: [
        'General Inquiries: info@church.org',
        'Pastoral Care: care@church.org',
        'Events: events@church.org',
      ],
      icon: '✉️',
    },
    {
      title: 'Follow Us',
      description: 'Stay connected on social media',
      details: [
        'Facebook: @OurChurch',
        'Instagram: @OurChurch',
        'YouTube: Our Church Live',
      ],
      icon: '📱',
    },
  ];

  const ministryContacts = [
    {
      department: 'Pastoral Care',
      contact: 'Deacon. Adeyemi',
      email: 'PastoralCare@Wisdomchurch.org',
      phone: '080-XXX-XXXX-X',
    },
    {
      department: 'Youth Ministry',
      contact: 'Pastor Kenny Ayilara',
      email: 'youthTeens@Wisdomchurch.org',
      phone: '080-XXX-XXXX-X',
    },
    {
      department: "Children's Ministry",
      contact: 'Mrs. Bamidele',
      email: 'children@Wisdomchurch.org',
      phone: '080-XXX-XXXX-X',
    },
    {
      department: 'Worship & Music',
      contact: 'Mr. Aduragbemi',
      email: 'worship@wiadomHousechurch.org',
      phone: '080-XXX-XXXX-X',
    },
    {
      department: 'Outreach & Missions',
      contact: 'Rev. Victor Jimba',
      email: 'missions@Wisdomchurch.org',
      phone: '080-XXX-XXXX-X',
    },
    {
      department: 'Facilities & Events',
      contact: 'Deacon. Adeyemi',
      email: 'facilities@Wisdomchurch.org',
      phone: '080-XXX-XXXX-X',
    },
  ];

  return (
    <div>
      <HeroSection
        title="Contact Us"
        subtitle="We'd Love to Hear From You"
        description="Whether you're new to our church family or have been with us for years, we're here to help you connect, grow, and serve. Reach out to us through any of the following ways."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Get Directions"
        secondaryButtonText="Send Message"
        showScrollIndicator={true}
      />

      {/* Contact Methods Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-12"
          >
            <H2 style={{ color: textColor }}>Get In Touch</H2>
            <LightText
              className="text-xl mt-4 max-w-2xl mx-auto"
              style={{ color: secondaryTextColor }}
            >
              Multiple ways to connect with our church family and leadership
            </LightText>
          </FlexboxLayout>

          <div className="max-w-6xl mx-auto">
            <GridboxLayout columns={1} responsive={{ md: 2, lg: 4 }} gap="lg">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                  style={{
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-xl mb-2"
                    style={{ color: cardTextColor }}
                  >
                    {method.title}
                  </BaseText>
                  <LightText
                    className="mb-4"
                    style={{ color: secondaryTextColor }}
                  >
                    {method.description}
                  </LightText>
                  <div className="space-y-2">
                    {method.details.map((detail, idx) => (
                      <LightText
                        key={idx}
                        className="text-sm"
                        style={{ color: secondaryTextColor }}
                      >
                        {detail}
                      </LightText>
                    ))}
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </div>
        </Container>
      </Section>

      {/* Ministry Contacts Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.surface
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <div className="max-w-6xl mx-auto">
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center mb-12"
            >
              <H2 style={{ color: textColor }}>Ministry Contacts</H2>
              <LightText
                className="text-xl mt-4 max-w-2xl mx-auto"
                style={{ color: secondaryTextColor }}
              >
                Connect directly with our ministry leaders and staff
              </LightText>
            </FlexboxLayout>

            <GridboxLayout columns={1} responsive={{ md: 2, lg: 3 }} gap="lg">
              {ministryContacts.map((contact, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-lg mb-2"
                    style={{ color: cardTextColor }}
                  >
                    {contact.department}
                  </BaseText>
                  <BaseText
                    weight="semibold"
                    className="mb-3"
                    style={{ color: cardTextColor }}
                  >
                    {contact.contact}
                  </BaseText>
                  <div className="space-y-2">
                    <LightText
                      className="text-sm"
                      style={{ color: secondaryTextColor }}
                    >
                      📧 {contact.email}
                    </LightText>
                    <LightText
                      className="text-sm"
                      style={{ color: secondaryTextColor }}
                    >
                      📞 {contact.phone}
                    </LightText>
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center mb-12"
            >
              <H2 style={{ color: textColor }}>Send Us a Message</H2>
              <LightText
                className="text-xl mt-4"
                style={{ color: secondaryTextColor }}
              >
                Have a question or prayer request? We're here to help.
              </LightText>
            </FlexboxLayout>

            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: formBackground,
                border: `1px solid ${borderColor}`,
              }}
            >
              <form className="space-y-6">
                <GridboxLayout columns={1} responsive={{ md: 2 }} gap="lg">
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ color: textColor }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Your first name"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ color: textColor }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Your last name"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                </GridboxLayout>

                <GridboxLayout columns={1} responsive={{ md: 2 }} gap="lg">
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ color: textColor }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="your.email@example.com"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ color: textColor }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="(555) 123-4567"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                </GridboxLayout>

                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ color: textColor }}
                  >
                    Department
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    style={{
                      backgroundColor: colorScheme.white, // Always white for dropdowns
                      borderColor: inputBorderColor,
                      color: colorScheme.black, // Always black for dropdown text
                    }}
                  >
                    <option value="">Select a department...</option>
                    <option value="general">General Inquiry</option>
                    <option value="pastoral">Pastoral Care</option>
                    <option value="youth">Youth Ministry</option>
                    <option value="children">Children's Ministry</option>
                    <option value="worship">Worship & Music</option>
                    <option value="missions">Missions & Outreach</option>
                    <option value="facilities">Facilities & Events</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ color: textColor }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Tell us how we can help you..."
                    style={{
                      backgroundColor: inputBackground,
                      borderColor: inputBorderColor,
                      color: textColor,
                    }}
                  ></textarea>
                </div>

                <FlexboxLayout justify="center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    curvature="full"
                    className="px-8 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.backgroundColor =
                        colorScheme.primaryDark;
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.backgroundColor =
                        colorScheme.primary;
                    }}
                  >
                    Send Message
                  </Button>
                </FlexboxLayout>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default ContactPage;
