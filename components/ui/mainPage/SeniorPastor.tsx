'use client';

import { useEffect, useRef, useState } from 'react';

export default function SeniorPastor() {
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
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/8135166/pexels-photo-8135166.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-3xl transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Meet Our Senior Pastor
          </h2>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <p className="text-white text-lg leading-relaxed mb-6">
              Pastor John leads our congregation with wisdom, compassion, and a
              deep commitment to the Gospel. With over 20 years of ministry
              experience, he has dedicated his life to serving God and nurturing
              spiritual growth within our community.
            </p>
            <p> This</p>
            <p className="text-white text-lg leading-relaxed mb-6">
              His vision for The Lighthouse Church is to create a place where
              everyone can encounter God's transformative love and discover
              their unique purpose. Through powerful preaching, genuine
              relationships, and Spirit-led worship, Pastor John guides our
              church family toward a deeper relationship with Christ.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
              Learn More About Our Pastor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
