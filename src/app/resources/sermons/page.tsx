/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import SermonUtil from '@/components/ui/Sermons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

const SermonPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  // useSelector((state: RootState) => state.sermons);

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  const handleYouTubeRedirect = () => {
    // Replace with your actual YouTube channel URL
    window.open('https://www.youtube.com/@wisdomhousehq', '_blank');
  };

  return (
    <div>
      <HeroSection
        title="Sermons & Teachings"
        subtitle="Catch up on all our Sermons and Teachings"
        description="Discover transformative messages from Sunday Teachings, Catch up on all our teachings from our Outreaches(Wisdom Power Conferences,Prayer), and special teachings. Grow spiritually through practical biblical Teachings."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        // primaryButtonText="Watch Latest Message"
        // secondaryButtonText="Browse All Series"
        // onPrimaryButtonClick={handleWatchSeries}
        // onSecondaryButtonClick={scrollToSeries}
        showScrollIndicator={true}
      />

      {/* Use the unified SermonUtil component */}
      <SermonUtil />

      {/* Ways to Listen Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">Watch & Listen Anywhere</H2>
            <div className="grid grid-cols-1 gap-8">
              {[
                {
                  platform: 'YouTube',
                  description: 'Full video messages with interactive features',
                  action: 'Subscribe to Channel',
                  icon: (
                    <FontAwesomeIcon
                      icon={faYoutube}
                      className="text-3xl text-red-600"
                    />
                  ),
                },
              ].map((option, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 max-w-md mx-auto"
                >
                  <div className="flex justify-center mb-4">{option.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {option.platform}
                  </h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <button
                    onClick={handleYouTubeRedirect}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
                    {option.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonPage;
