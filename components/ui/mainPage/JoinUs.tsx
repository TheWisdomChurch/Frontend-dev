'use client';

import { useEffect, useRef, useState } from 'react';

export default function JoinLighthouse() {
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

  const photos = [
    {
      title: 'Please our Podcast Download',
      image:
        'https://images.pexels.com/photos/7414058/pexels-photo-7414058.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '#',
    },
    {
      title: 'Sunday Service',
      image:
        'https://images.pexels.com/photos/8468072/pexels-photo-8468072.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '#',
    },
    {
      title: 'Youth Ministry',
      image:
        'https://images.pexels.com/photos/8468214/pexels-photo-8468214.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '#',
    },
    {
      title: 'Prayer Meeting',
      image:
        'https://images.pexels.com/photos/8815906/pexels-photo-8815906.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '#',
    },
    {
      title: 'Community Outreach',
      image:
        'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '#',
    },
    {
      title: 'Bible Study',
      image:
        'https://images.pexels.com/photos/8468093/pexels-photo-8468093.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '#',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/8815963/pexels-photo-8815963.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join Our <span className="text-yellow-400">Lighthouse</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Take a peek in the highlights of being part of our Community. Join
            our Weekly Service and get transformed in the house of Christ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo.title}
              className={`group relative overflow-hidden rounded-lg transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-3">
                    {photo.title}
                  </h3>
                  <a
                    href={photo.link}
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-full transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
