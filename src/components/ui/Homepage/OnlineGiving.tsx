 
'use client';

import { OnlinegivingOptions } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';
import GivingModal from '@/components/modal/GivingModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { useOnlineGiving } from '@/components/utils/hooks/Onlinegiving';
import {
  handleContactCall,
  useIntersectionObserver,
} from '@/components/utils/functionUtils/contactUtils';

export default function OnlineGiving() {
  const { colorScheme } = useTheme();

  const {
    isVisible,
    setIsVisible,
    selectedGivingOption,
    isModalOpen,
    sectionRef,
    scrollContainerRef,
    handleGiveNow,
    closeModal,
    scrollLeft,
    scrollRight,
  } = useOnlineGiving();

  // Use the intersection observer utility
  useIntersectionObserver(setIsVisible, sectionRef);

  return (
    <>
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
              Your generosity helps us continue to spread the Gospel and serve
              our community. Choose how you would like to give today.
            </p>
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
            {OnlinegivingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.title}
                  className={`transition-all duration-700 w-full max-w-sm ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
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
                    <div className="p-6 flex-1 flex flex-col">
                      <p
                        className="mb-6 flex-1"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        {option.description}
                      </p>
                      <button
                        onClick={() => handleGiveNow(option)}
                        className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 border mt-auto"
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
                          e.currentTarget.style.borderColor =
                            colorScheme.primary;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.black;
                          e.currentTarget.style.color = colorScheme.white;
                          e.currentTarget.style.borderColor =
                            colorScheme.primary;
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

          {/* Mobile & Tablet Layout - Horizontal Scroll */}
          <div className="lg:hidden relative">
            {/* Scroll Navigation Buttons */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={scrollLeft}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-10"
                style={{
                  backgroundColor: colorScheme.primary + '30',
                  borderColor: colorScheme.primary,
                  color: colorScheme.textInverted,
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>

              <span
                className="text-sm font-medium px-4"
                style={{ color: colorScheme.textInverted }}
              >
                Scroll to explore giving options
              </span>

              <button
                onClick={scrollRight}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-10"
                style={{
                  backgroundColor: colorScheme.primary + '30',
                  borderColor: colorScheme.primary,
                  color: colorScheme.textInverted,
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {OnlinegivingOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.title}
                    className={`flex-shrink-0 w-80 transition-all duration-700 ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div
                      className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
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
                        <h3 className="text-xl font-bold mb-2">
                          {option.title}
                        </h3>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p
                          className="mb-6 flex-1"
                          style={{ color: colorScheme.textSecondary }}
                        >
                          {option.description}
                        </p>
                        <button
                          onClick={() => handleGiveNow(option)}
                          className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 border mt-auto"
                          style={{
                            backgroundColor: colorScheme.black,
                            color: colorScheme.white,
                            borderColor: colorScheme.primary,
                            borderWidth: '2px',
                            borderRadius: colorScheme.borderRadius.medium,
                          }}
                        >
                          Give Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add some extra space at the end for better scrolling */}
              <div className="flex-shrink-0 w-4" />
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {OnlinegivingOptions.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ backgroundColor: colorScheme.primary + '50' }}
                />
              ))}
            </div>
          </div>

          <div
            className={`mt-16 text-center transition-all duration-1000 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
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
                up recurring donations. For more information about giving
                options, please contact our Admin.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleContactCall}
                  className="font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
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
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
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

      {/* Giving Modal */}
      {selectedGivingOption && (
        <GivingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          givingOption={selectedGivingOption}
        />
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
