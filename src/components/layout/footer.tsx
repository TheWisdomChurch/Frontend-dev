import Link from 'next/link';
import { Church, Phone, MapPin } from 'lucide-react';
import { worksans } from '@/components/fonts/fonts';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Church className="h-8 w-8 text-yellow-400" />
              <span className={`${worksans.className} text-2xl font-bold`}>
                The Wisdom House
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Transforming lives through faith, community, and divine guidance.
              Join us in our journey of spiritual growth and service.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Church Address will be here</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>Contact Number will be here </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${worksans.className} text-lg font-semibold mb-4`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/ministries', label: 'Ministries' },
                { href: '/events', label: 'Events' },
                { href: '/resources/sermons', label: 'Sermons' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className={`${worksans.className} text-lg font-semibold mb-4`}>
              Service Times
            </h3>
            <ul className="space-y-2 text-gray-300">
              {[
                { service: 'Sunday Worship', time: '9:00 AM & 11:00 AM' },
                { service: 'Midweek Service', time: 'Thursday 6:00 PM' },
                { service: 'Supernatural Service', time: 'Every Last Sunday' },
              ].map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.service}</span>
                  <span>{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} The Wisdom House Church. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
