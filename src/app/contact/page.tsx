import React from 'react';
import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';

const ContactPage = () => {
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Get In Touch</H2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Multiple ways to connect with our church family and leadership
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <div className="space-y-2">
                    {method.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Contacts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Ministry Contacts</H2>
              <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                Connect directly with our ministry leaders and staff
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministryContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {contact.department}
                  </h3>
                  <p className="text-gray-700 font-semibold mb-3">
                    {contact.contact}
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm">📧 {contact.email}</p>
                    <p className="text-gray-600 text-sm">📞 {contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <H2>Send Us a Message</H2>
              <p className="text-xl text-gray-600 mt-4">
                Have a question or prayer request? We're here to help.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Department
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400">
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
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
