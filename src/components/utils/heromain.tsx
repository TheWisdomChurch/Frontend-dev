import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Wave } from './wave';
import { H1, H2, P } from '../text';
import type { StaticImageData } from 'next/image';

import { hero_bg_1, hero_bg_2, hero_bg_3 } from '../assets';

const theme: {
  background: string;
  text: string;
  primary: string;
  accent: string;
  textSecondary: string;
  overlay: string;
} = {
  background: '#0f172a',
  text: '#e6edf3',
  primary: '#60a5fa',
  accent: '#f97316',
  textSecondary: '#cbd5e1',
  overlay: 'rgba(2,6,23,0.6)',
};

gsap.registerPlugin(ScrollTrigger);
interface Slide {
  image: string | StaticImageData;
  subtitle: string;
  title: string;
}

const slides: Slide[] = [
  {
    image: hero_bg_1.src,
    subtitle: "Experience God's Transforming Power",
    title:
      'Welcome to The Wisdom House Church where lives are transformed through faith, community, and divine guidance.',
  },
  {
    image: hero_bg_2.src,
    subtitle: 'Deepen Your Spiritual Journey',
    title:
      'Join our vibrant community as we grow together in faith, love, and service to others.',
  },
  {
    image: hero_bg_3.src,
    subtitle: 'Connect With Believers',
    title:
      'Experience the warmth of genuine fellowship and build lasting relationships in Christ.',
  },
];

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const waveCanvasRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLHeadingElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const chevronsRef = useRef<HTMLDivElement>(null);
  const currentSlideIndex = useRef(0);

  useEffect(() => {
    // Intro animation
    const tl = gsap.timeline();
    tl.to([introTextRef.current, waveCanvasRef.current], {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: 'power3.out',
      stagger: 0.2,
    })
      .to([introTextRef.current, waveCanvasRef.current], {
        opacity: 0,
        y: -50,
        duration: 1.5,
        ease: 'power3.in',
        delay: 2,
      })
      .then(() => {
        gsap.to(sliderRef.current, { opacity: 1, duration: 1 });
      });

    // Auto-slide
    // Auto-slide
    const slideInterval = setInterval(animateSlideTransition, 5000);

    // Chevrons animation
    const chevronsChildren = chevronsRef.current?.children;
    if (chevronsChildren && chevronsChildren.length) {
      gsap.to(Array.from(chevronsChildren), {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: 'power1.inOut',
      });
    }

    // Parallax on slider
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => {
        gsap.to(sliderRef.current, { y: self.progress * 100, ease: 'none' });
      },
    });
    return () => clearInterval(slideInterval);
  }, []);

  const animateSlideTransition = () => {
    const slidesElements = sliderRef.current?.querySelectorAll('.slide');
    if (!slidesElements) return;

    gsap.to(
      slidesElements[currentSlideIndex.current].querySelectorAll('h2, p'),
      {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.in',
      }
    );

    currentSlideIndex.current = (currentSlideIndex.current + 1) % slides.length;

    gsap.to(slidesElements, { opacity: 0, duration: 1, ease: 'power2.inOut' });
    gsap.to(slidesElements[currentSlideIndex.current], {
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
    });

    gsap.fromTo(
      slidesElements[currentSlideIndex.current].querySelectorAll('h2, p'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.5,
      }
    );
  };

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {/* Intro Container */}
      <div
        ref={introRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 15,
        }}
      >
        {/* 3D Wave Canvas */}
        <div
          ref={waveCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            transform: 'translateY(50px)',
          }}
        >
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Wave />
          </Canvas>
        </div>

        {/* Intro Text */}
        <H1
          ref={introTextRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            textAlign: 'center',
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            color: theme.primary,
            zIndex: 20,
          }}
        >
          The Wave of Greatness
        </H1>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        style={{
          opacity: 0,
          height: '100%',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="slide"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === 0 ? 1 : 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 10%',
            }}
          >
            <H2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                color: theme.accent,
                marginBottom: '1rem',
              }}
            >
              {slide.subtitle}
            </H2>
            <P
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.8rem)',
                maxWidth: '800px',
                color: theme.textSecondary,
              }}
            >
              {slide.title}
            </P>
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          background: `linear-gradient(to bottom, transparent, ${theme.overlay})`,
          zIndex: 5,
        }}
      />

      {/* Chevrons */}
      <div
        ref={chevronsRef}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <ChevronDown size={24} color={theme.primary} />
        <ChevronDown size={24} color={theme.primary} />
      </div>
    </section>
  );
};

export default HeroSection;
