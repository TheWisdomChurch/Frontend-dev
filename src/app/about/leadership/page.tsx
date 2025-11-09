'use client';

import { useRef, useEffect } from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3, P } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { leaders, ministryLeadersData } from '@/lib/data';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leader, MinistryLeader } from '@/lib/types';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LeadersPage = () => {
  const pastoralSectionRef = useRef<HTMLDivElement>(null);
  const ministrySectionRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate pastoral team section
      if (pastoralSectionRef.current) {
        gsap.fromTo(
          pastoralSectionRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pastoralSectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate ministry leaders section
      if (ministrySectionRef.current) {
        gsap.fromTo(
          ministrySectionRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ministrySectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate philosophy section
      if (philosophyRef.current) {
        gsap.fromTo(
          philosophyRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Filter out null refs and animate cards
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: validCards[0],
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Hover animations for cards
        validCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -5,
              duration: 0.3,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Add card to ref array
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    cardsRef.current[index] = el;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Our Leadership"
        subtitle="Guided by Servant Leaders"
        description="Meet the dedicated team of pastors and leaders who serve our church family with wisdom, compassion, and commitment to God's calling."
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Pastoral Team Section */}
      <section ref={pastoralSectionRef} className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Pastoral Team
            </H2>
            <P className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              God has blessed us with faithful leaders who shepherd our
              congregation with love and dedication to God's Word.
            </P>
          </div>

          {/* Pastoral Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {leaders.map((leader: Leader, index: number) => (
              <div
                key={`pastoral-${leader.id}`}
                ref={el => addToRefs(el, index)}
                className="text-center group flex flex-col items-center"
              >
                {/* Leader Image */}
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-yellow-400 group-hover:border-yellow-500 transition-all duration-300 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {leader.image ? (
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        width={192}
                        height={192}
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">
                        Leader Image
                      </span>
                    )}
                  </div>
                </div>

                {/* Leader Info */}
                <H3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                  {leader.name}
                </H3>
                <p className="text-yellow-600 font-semibold mb-3 text-sm uppercase tracking-wide">
                  {leader.role}
                </p>
                <P className="text-gray-600 text-sm leading-relaxed">
                  {leader.description ||
                    "Dedicated to serving the congregation with faith and commitment to God's calling."}
                </P>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Leaders Section */}
      <section ref={ministrySectionRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ministry Department Leaders
            </H2>
            <P className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our dedicated ministry leaders oversee various departments,
              ensuring every aspect of church life flourishes under God's
              guidance.
            </P>
          </div>

          {/* Ministry Leaders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {ministryLeadersData.map(
              (leader: MinistryLeader, index: number) => (
                <div
                  key={`ministry-${leader.id}`}
                  ref={el => addToRefs(el, leaders.length + index)}
                  className="text-center group flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Ministry Leader Image */}
                  <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-yellow-400 group-hover:border-yellow-500 transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {leader.image ? (
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          width={160}
                          height={160}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs font-medium">
                          Ministry Leader
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ministry Leader Info */}
                  <H3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    {leader.name}
                  </H3>
                  <p className="text-yellow-600 font-semibold mb-3 text-sm uppercase tracking-wide">
                    {leader.role}
                  </p>
                  <p className="text-gray-500 text-xs font-medium mb-3 bg-yellow-50 px-3 py-1 rounded-full">
                    {leader.department}
                  </p>
                  <P className="text-gray-600 text-sm leading-relaxed">
                    {leader.description ||
                      'Passionately serving in ministry to build up the body of Christ.'}
                  </P>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Leadership Philosophy Section */}
      <section ref={philosophyRef} className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-3xl p-8 lg:p-12 shadow-lg">
              <H2 className="text-center mb-12 text-3xl font-bold text-gray-900">
                Our Leadership Philosophy
              </H2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <H3 className="text-xl font-bold mb-4 text-gray-900">
                    Servant Leadership
                  </H3>
                  <P className="text-gray-700">
                    We believe leadership is about serving others, following the
                    example of Jesus Christ who came not to be served, but to
                    serve.
                  </P>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <H3 className="text-xl font-bold mb-4 text-gray-900">
                    Biblical Foundation
                  </H3>
                  <P className="text-gray-700">
                    Our leaders are committed to teaching and living according
                    to God's Word, providing spiritual guidance rooted in
                    Scripture.
                  </P>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <H3 className="text-xl font-bold mb-4 text-gray-900">
                    Team Ministry
                  </H3>
                  <P className="text-gray-700">
                    We work together as a team, recognizing that each leader
                    brings unique gifts to serve the body of Christ effectively.
                  </P>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadersPage;
