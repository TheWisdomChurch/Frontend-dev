'use client';

import { useEffect, useRef, useState } from 'react';
import { givingOptions } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';

export default function OnlineGiving() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useTheme();

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

  return (
    <section
      ref={sectionRef}
      className="py-20"
      style={{
        background: colorScheme.heading,
        color: colorScheme.textInverted,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colorScheme.textInverted }}
          >
            Online Giving
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: colorScheme.primaryGradient }}
          >
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
                <div
                  className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full"
                  style={{
                    backgroundColor: colorScheme.body,
                    boxShadow: colorScheme.shadowMd,
                  }}
                >
                  <div
                    className="p-6"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                  >
                    <Icon size={40} className="mb-4" />
                    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  </div>
                  <div className="p-6">
                    <p
                      className="mb-6"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {option.description}
                    </p>
                    <button
                      className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 border"
                      style={{
                        backgroundColor: colorScheme.black,
                        color: colorScheme.white,
                        borderColor: colorScheme.primary,
                        borderWidth: '2px',
                        borderRadius: colorScheme.borderRadius.medium,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.primary;
                        e.currentTarget.style.color = colorScheme.black;
                        e.currentTarget.style.borderColor = colorScheme.primary;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.black;
                        e.currentTarget.style.color = colorScheme.white;
                        e.currentTarget.style.borderColor = colorScheme.primary;
                      }}
                    >
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
          <div
            className="rounded-xl shadow-xl p-8 max-w-3xl mx-auto"
            style={{
              backgroundColor: colorScheme.card,
              boxShadow: colorScheme.shadowLg,
              borderRadius: colorScheme.borderRadius.large,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: colorScheme.heading }}
            >
              Other Ways to Give
            </h3>
            <p className="mb-6" style={{ color: colorScheme.textSecondary }}>
              You can also give by mail, in person during our services, or set
              up recurring donations. For more information about giving options,
              please contact our Admin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                  borderRadius: colorScheme.borderRadius.full,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }}
              >
                Contact Us
              </button>
              <button
                className="border-2 font-bold py-3 px-8 rounded-full transition-all duration-300"
                style={{
                  borderColor: colorScheme.black,
                  color: colorScheme.text,
                  borderRadius: colorScheme.borderRadius.full,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = colorScheme.black;
                  e.currentTarget.style.color = colorScheme.white;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colorScheme.text;
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
