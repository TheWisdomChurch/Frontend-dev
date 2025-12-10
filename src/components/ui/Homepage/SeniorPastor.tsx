'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Bishop } from '@/components/assets';
import { H1, P } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';
import { seniorPastorData } from '@/lib/data';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import { Instagram, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SeniorPastorProps {
  className?: string;
}

export default function SeniorPastor({ className = '' }: SeniorPastorProps) {
  const { isVisible, sectionRef } = useSeniorPastor();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check if content overflows (to show Read More button)
  useEffect(() => {
    if (!isMobile && !isTablet) return;
    
    const checkOverflow = () => {
      const element = contentRef.current;
      if (element) {
        // Check if content is taller than ~10 lines (~200px)
        const isOverflowing = element.scrollHeight > 200;
        setShowReadMore(isOverflowing);
      }
    };

    // Check after a small delay to ensure DOM is rendered
    setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [isMobile, isTablet]);

  const descriptionText = seniorPastorData.description[0];
  
  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsExpanded(prev => !prev);
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, [isAnimating]);

  const handleInstagramClick = useCallback(() => {
    window.open(seniorPastorData.instagramUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const isDesktop = !isMobile && !isTablet;

  return (
    <Section
      ref={sectionRef}
      padding="lg"
      fullHeight={false}
      className={cn(
        "relative w-full overflow-hidden min-h-[500px] md:min-h-[550px] flex items-center",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${Bishop.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90" />
      </div>

      {/* Main Content */}
      <Container size="xl" className="relative z-20 h-full">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          className="h-full w-full py-8 md:py-12 lg:py-16 px-4"
        >
          {/* Content Container */}
          <div className="w-full max-w-3xl mx-auto">
            <div className={cn(
              "transition-all duration-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              {/* Title */}
              <div className="text-center mb-6 md:mb-8">
                <H1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {seniorPastorData.title}
                </H1>
              </div>

              {/* Content Box */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg md:rounded-xl p-5 md:p-8 lg:p-10 border border-white/10">
                
                {/* Content with smooth expand/collapse */}
                <div 
                  ref={contentRef}
                  className={cn(
                    "mb-4 md:mb-6 relative transition-all duration-300 ease-in-out",
                    // On mobile/tablet: limit height when not expanded
                    !isDesktop && !isExpanded && showReadMore && "max-h-[180px] overflow-hidden",
                    !isDesktop && isExpanded && showReadMore && "max-h-[1000px]"
                  )}
                >
                  <P className="text-sm md:text-base lg:text-lg text-gray-100 text-center leading-relaxed">
                    {descriptionText}
                  </P>
                  
                  {/* Gradient fade for truncated content */}
                  {!isDesktop && !isExpanded && showReadMore && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Buttons Section - FIXED CENTERING */}
                <div className="flex flex-col items-center justify-center">
                  {/* Desktop: Always show Connect button */}
                  {isDesktop ? (
                    <Button
                      onClick={handleInstagramClick}
                      variant="primary"
                      size="sm"
                      curvature="full"
                      leftIcon={<Instagram className="w-3.5 h-3.5" />}
                      className="px-6 py-2 text-sm font-medium"
                      style={{
                        background: `linear-gradient(135deg, #E4405F, #C13584)`,
                        color: '#FFFFFF',
                      }}
                    >
                      Connect with Pastor
                    </Button>
                  ) : (
                    /* Mobile/Tablet: Conditional buttons */
                    <div className="w-full flex flex-col items-center justify-center space-y-2">
                      {/* Show Read More button only when content overflows and not expanded */}
                      {showReadMore && !isExpanded ? (
                        <Button
                          onClick={handleToggle}
                          variant="primary"
                          size="sm"
                          curvature="full"
                          className="px-5 py-1.5 text-xs font-medium"
                          style={{
                            background: `linear-gradient(135deg, #F7DE12, #D4BC0F)`,
                            color: '#000000',
                          }}
                        >
                          <span className="flex items-center justify-center gap-1">
                            Read More
                            <ChevronDown className="w-3 h-3" />
                          </span>
                        </Button>
                      ) : null}
                      
                      {/* Show Connect button when expanded OR if content doesn't overflow */}
                      {(isExpanded || !showReadMore) && (
                        <div className="flex flex-col items-center justify-center space-y-1.5 w-full">
                          <Button
                            onClick={handleInstagramClick}
                            variant="primary"
                            size="sm"
                            curvature="full"
                            leftIcon={<Instagram className="w-3.5 h-3.5" />}
                            className="px-5 py-1.5 text-xs font-medium"
                            style={{
                              background: `linear-gradient(135deg, #E4405F, #C13584)`,
                              color: '#FFFFFF',
                            }}
                          >
                            Connect with Pastor
                          </Button>
                          
                          {/* Show Less button */}
                          {isExpanded && showReadMore && (
                            <button
                              onClick={handleToggle}
                              className="text-xs text-gray-300 hover:text-white transition-colors duration-200 flex items-center justify-center gap-0.5"
                            >
                              <span className="underline">Show Less</span>
                              <ChevronUp className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pastor Portrait (Desktop & Tablet only) */}
          {!isMobile && (
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30">
              <div className="relative">
                <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full overflow-hidden border-2 border-yellow-400/40 shadow-lg">
                  <Image
                    src={Bishop}
                    alt="Senior Pastor"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 56px, (max-width: 1024px) 64px, 72px"
                  />
                </div>
                {/* <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-black whitespace-nowrap">
                  Senior Pastor
                </div> */}
              </div>
            </div>
          )}
        </FlexboxLayout>
      </Container>
    </Section>
  );
}