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
import { gsap } from 'gsap';

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
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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

  // Derived values (React 19 pattern)
  const isDesktop = !isMobile && !isTablet;
  const isResponsive = isMobile || isTablet;

  // Check if content overflows (to show Read More button)
  useEffect(() => {
    if (!isResponsive) return;

    const checkOverflow = () => {
      const element = contentRef.current;
      if (element) {
        const isOverflowing = element.scrollHeight > 200;
        setShowReadMore(isOverflowing);
      }
    };

    setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [isResponsive]);

  // GSAP animations on component mount
  useEffect(() => {
    if (!contentBoxRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        contentBoxRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: 'back.out(1.2)', 
          delay: 0.2 
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Animation for expanding/collapsing accordion
  useEffect(() => {
    if (!isResponsive || !contentRef.current || !showReadMore) return;

    const contentElement = contentRef.current;
    const contentHeight = contentElement.scrollHeight;
    const collapsedHeight = 180; // matches max-h-[180px]
    const expandedHeight = Math.min(contentHeight, 350); // Max expanded height

    if (isExpanded) {
      // Expand animation
      gsap.to(contentElement, {
        maxHeight: expandedHeight,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          contentElement.style.overflow = 'hidden';
        },
        onComplete: () => {
          contentElement.style.overflowY = 'auto';
        }
      });
      
      // Fade out the gradient
      const fadeElement = contentElement.querySelector('.gradient-fade');
      if (fadeElement) {
        gsap.to(fadeElement, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    } else {
      // Collapse animation
      gsap.to(contentElement, {
        maxHeight: collapsedHeight,
        duration: 0.4,
        ease: 'power2.in',
        onStart: () => {
          contentElement.style.overflow = 'hidden';
        }
      });
      
      // Fade in the gradient
      const fadeElement = contentElement.querySelector('.gradient-fade');
      if (fadeElement) {
        gsap.to(fadeElement, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          delay: 0.1
        });
      }
    }
  }, [isExpanded, showReadMore, isResponsive]);

  // Button animation on toggle
  useEffect(() => {
    if (!isResponsive || !buttonRef.current || !showReadMore) return;

    const buttonElement = buttonRef.current;
    
    // Button scale animation
    gsap.to(buttonElement, {
      scale: isAnimating ? 0.95 : 1,
      duration: 0.2,
      ease: 'power2.out'
    });

    // Button content swap animation
    const buttons = buttonElement.querySelectorAll('button, [role="button"]');
    buttons.forEach((btn, index) => {
      gsap.fromTo(
        btn,
        { opacity: 0, y: index === 0 ? -10 : 10 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.1 }
      );
    });
  }, [isExpanded, isAnimating, showReadMore, isResponsive]);

  const descriptionText = seniorPastorData.description[0];

  const handleToggle = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsExpanded(prev => !prev);

    // Add a subtle click animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, [isAnimating]);

  const handleInstagramClick = useCallback(() => {
    // Add click animation before redirecting
    const button = document.querySelector('[data-instagram-button]');
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          window.open(seniorPastorData.instagramUrl, '_blank', 'noopener,noreferrer');
        }
      });
    } else {
      window.open(seniorPastorData.instagramUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <Section
      ref={sectionRef}
      padding="lg"
      fullHeight={false}
      className={cn(
        'relative w-full overflow-hidden min-h-[500px] md:min-h-[550px] flex items-center',
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
            <div
              className={cn(
                'transition-all duration-500',
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              )}
            >
              {/* Title with ref for animation */}
              <div ref={titleRef} className="text-center mb-6 md:mb-8">
                <H1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {seniorPastorData.title}
                </H1>
              </div>

              {/* Content Box with ref for animation */}
              <div 
                ref={contentBoxRef}
                className="bg-black/70 backdrop-blur-sm rounded-lg md:rounded-xl p-5 md:p-8 lg:p-10 border border-white/10"
              >
                {/* Desktop Layout */}
                {isDesktop ? (
                  <>
                    {/* Content */}
                    <div className="mb-4 md:mb-6">
                      <P className="text-sm md:text-base lg:text-lg text-gray-100 text-center leading-relaxed">
                        {descriptionText}
                      </P>
                    </div>

                    {/* Connect Button */}
                    <div className="flex flex-col items-center justify-center">
                      <Button
                        onClick={handleInstagramClick}
                        variant="primary"
                        size="sm"
                        curvature="full"
                        leftIcon={<Instagram className="w-3.5 h-3.5" />}
                        className="px-6 py-2 text-sm font-medium transition-transform duration-200 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, #E4405F, #C13584)`,
                          color: '#FFFFFF',
                        }}
                        data-instagram-button
                      >
                        Connect with Pastor
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Mobile/Tablet Accordion Layout */
                  <div className="w-full">
                    {/* Content Area with Accordion Behavior */}
                    <div
                      ref={contentRef}
                      className={cn(
                        'transition-all duration-300 ease-in-out mb-4',
                        // Base styles for both states
                        showReadMore && 'overflow-hidden',
                        // Initial collapsed state managed by GSAP
                        !isExpanded && showReadMore && 'max-h-[180px] relative',
                        // Expanded state managed by GSAP
                        isExpanded && showReadMore && 'overflow-y-auto pr-2',
                        // If no overflow
                        !showReadMore && 'max-h-none'
                      )}
                      style={{
                        maxHeight: !showReadMore ? 'none' : isExpanded ? '350px' : '180px'
                      }}
                    >
                      <P className="text-sm md:text-base lg:text-lg text-gray-100 text-center leading-relaxed">
                        {descriptionText}
                      </P>

                      {/* Gradient fade for truncated content in collapsed state */}
                      {!isExpanded && showReadMore && (
                        <div className="gradient-fade absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* Accordion Controls */}
                    <div 
                      ref={buttonRef}
                      className="flex flex-col items-center justify-center space-y-3"
                    >
                      {/* Main Action Button - Changes based on state */}
                      {showReadMore ? (
                        <>
                          {!isExpanded ? (
                            // COLLAPSED STATE: Show "Read More" button
                            <Button
                              onClick={handleToggle}
                              variant="primary"
                              size="sm"
                              curvature="full"
                              className="px-5 py-1.5 text-xs font-medium w-full max-w-[200px] transition-transform duration-200 hover:scale-105"
                              style={{
                                background: `linear-gradient(135deg, #F7DE12, #D4BC0F)`,
                                color: '#000000',
                              }}
                            >
                              <span className="flex items-center justify-center gap-1">
                                Read More
                                <ChevronDown className="w-3 h-3 transition-transform duration-300" />
                              </span>
                            </Button>
                          ) : (
                            // EXPANDED STATE: Show "Connect with Pastor" button
                            <div className="w-full max-w-[200px] space-y-2">
                              {/* "Show Less" text link */}
                              <button
                                onClick={handleToggle}
                                className="text-xs text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center gap-0.5 w-full"
                              >
                                <span className="underline">Show Less</span>
                                <ChevronUp className="w-3 h-3 transition-transform duration-300" />
                              </button>
                              
                              {/* "Connect with Pastor" button */}
                              <Button
                                onClick={handleInstagramClick}
                                variant="primary"
                                size="sm"
                                curvature="full"
                                leftIcon={<Instagram className="w-3.5 h-3.5" />}
                                className="px-5 py-1.5 text-xs font-medium w-full transition-transform duration-200 hover:scale-105"
                                style={{
                                  background: `linear-gradient(135deg, #E4405F, #C13584)`,
                                  color: '#FFFFFF',
                                }}
                                data-instagram-button
                              >
                                Connect with Pastor
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        // If content doesn't overflow, just show "Connect with Pastor"
                        <Button
                          onClick={handleInstagramClick}
                          variant="primary"
                          size="sm"
                          curvature="full"
                          leftIcon={<Instagram className="w-3.5 h-3.5" />}
                          className="px-5 py-1.5 text-xs font-medium w-full max-w-[200px] transition-transform duration-200 hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, #E4405F, #C13584)`,
                            color: '#FFFFFF',
                          }}
                          data-instagram-button
                        >
                          Connect with Pastor
                        </Button>
                      )}
                    </div>
                  </div>
                )}
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
                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-black whitespace-nowrap">
                  Senior Pastor
                </div>
              </div>
            </div>
          )}
        </FlexboxLayout>
      </Container>
    </Section>
  );
}