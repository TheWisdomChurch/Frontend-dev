'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/8468068/pexels-photo-8468068.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div
        className={`relative z-10 text-center px-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          We Are Transformed
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-2">
          We are Prosperous
        </p>
        <p className="text-lg md:text-xl text-gray-300">
          We are Very Prosperous
        </p>
      </div>

      <button
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        onClick={() => {
          document
            .getElementById('what-we-do')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <ChevronDown size={48} />
      </button>
    </section>
  );
}
