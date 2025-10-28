'use client';

import { useEffect, useRef, useState } from 'react';
import { Associate_1, Associate_2 } from '@/components/assets';
import Image from 'next/image';

export default function AssociatePastors() {
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

  const pastors = [
    {
      name: 'Rev. Victor Jimba',
      role: 'Resident Pastor',
      image: Associate_2,
    },
    {
      name: 'Deacon Adeyemi ',
      role: 'Associate Pastor',
      image: Associate_1,
    },
    {
      name: 'Deacon Bamidele',
      role: 'Associate Pastor',
      image: Associate_1,
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet our Associate Pastor
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team of pastors work together to serve, guide, and
            inspire our church family in their spiritual journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {pastors.map((pastor, index) => (
            <div
              key={pastor.name}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative inline-block mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                  <Image
                    src={pastor.image}
                    alt={pastor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {pastor.role}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {pastor.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
