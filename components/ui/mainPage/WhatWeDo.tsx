'use client';

import { useEffect, useRef, useState } from 'react';

export default function WhatWeDo() {
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

  return (
    <section id="what-we-do" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          What we do
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl h-96">
              <img
                src="https://images.pexels.com/photos/8468005/pexels-photo-8468005.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Worship service"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">
                  We Have the Word
                </h3>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl h-96 bg-gradient-to-br from-purple-900 to-purple-700">
              <img
                src="https://images.pexels.com/photos/8468118/pexels-photo-8468118.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Prayer gathering"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Holy Spirit
                  </h3>
                  <p className="text-white text-lg">
                    We believe in the power of the Holy Spirit to transform
                    lives and bring about lasting change in our community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 text-center transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At The Lighthouse Church, we are committed to spreading the Gospel
            and empowering believers through the Word of God and the Holy
            Spirit. Our mission is to create a community where faith thrives and
            transformation is possible.
          </p>
        </div>
      </div>
    </section>
  );
}
