/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { pastorsData, ministryLeadersData } from '@/lib/data';
import { H1, H2, H3, P } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import { useAssociatePastors } from '@/components/utils/hooks/useAssociate';
import { ArrowRight } from 'lucide-react';

export default function AssociatePastors() {
  const { sectionRef, contentRef, headingRef, handleSeeMore, addToRefs } =
    useAssociatePastors();

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="text-center mb-20">
          <H2
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Meet Our Departmental Heads & Ministry Leaders
          </H2>
          <P className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our devoted leaders faithfully oversee various departments, guiding
            the church family with wisdom, compassion, and a shared commitment
            to spiritual growth and service.
          </P>
        </div>

        <div ref={contentRef} className="flex flex-col items-center">
          {/* First Leaders Section */}
          <div className="w-full mb-16">
            <H1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">
              Pastoral Leadership
            </H1>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {pastorsData.slice(0, 3).map((pastor, index) => (
                <div
                  key={`pastoral-${pastor.name}`}
                  ref={addToRefs}
                  className="flex flex-col items-center group"
                >
                  <div className="relative inline-block mb-8">
                    <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto group-hover:shadow-2xl transition-all duration-500">
                      <Image
                        src={pastor.image}
                        alt={pastor.name}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {pastor.role}
                    </div>
                  </div>

                  <H3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                    {pastor.name}
                  </H3>
                  {pastor.description && (
                    <P className="text-gray-600 text-center text-sm leading-relaxed px-2">
                      {pastor.description}
                    </P>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Second Leaders Section */}
          <div className="w-full mb-16">
            <H1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">
              Ministry Department Heads
            </H1>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {ministryLeadersData.slice(3, 6).map((pastor, index) => (
                <div
                  key={`ministry-${pastor.name}`}
                  ref={addToRefs}
                  className="flex flex-col items-center group"
                >
                  <div className="relative inline-block mb-8">
                    <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto group-hover:shadow-2xl transition-all duration-500">
                      <Image
                        src={pastor.image}
                        alt={pastor.name}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {pastor.role}
                    </div>
                  </div>

                  <H3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                    {pastor.name}
                  </H3>
                  {pastor.description && (
                    <P className="text-gray-600 text-center text-sm leading-relaxed px-2">
                      {pastor.description}
                    </P>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* See More Button */}
          <div className="text-center mt-8">
            <CustomButton
              onClick={handleSeeMore}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-3 group"
            >
              See More
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </CustomButton>
          </div>
        </div>
      </div>
    </section>
  );
}
