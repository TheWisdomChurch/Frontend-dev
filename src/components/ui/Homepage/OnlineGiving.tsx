'use client';

import { useEffect, useRef, useState } from 'react';
import { DollarSign, Heart, Users, BookOpen } from 'lucide-react';

export default function OnlineGiving() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const givingOptions = [
    {
      title: 'Tithes & Offerings',
      description:
        'Support the ongoing ministry and mission of The Lighthouse Church',
      icon: DollarSign,
      color: 'from-green-600 to-green-700',
    },
    {
      title: 'Building Fund',
      description: 'Help us expand our facilities to reach more people',
      icon: Heart,
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Missions & Outreach',
      description: 'Support our global mission efforts and community programs',
      icon: Users,
      color: 'from-purple-600 to-purple-700',
    },
    {
      title: 'Youth & Education',
      description: 'Invest in the next generation through our youth programs',
      icon: BookOpen,
      color: 'from-orange-600 to-orange-700',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Online Giving
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your generosity helps us continue to spread the Gospel and serve our
            community. Choose how you would like to give today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {givingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={option.title}
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div
                    className={`bg-gradient-to-br ${option.color} p-6 text-white`}
                  >
                    <Icon size={40} className="mb-4" />
                    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{option.description}</p>
                    <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                      Give Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Other Ways to Give
            </h3>
            <p className="text-gray-600 mb-6">
              You can also give by mail, in person during our services, or set
              up recurring donations. For more information about giving options,
              please contact our Admin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Contact Us
              </button>
              <button className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
