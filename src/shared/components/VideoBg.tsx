'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface VideoBgProps {
  src: string;
  overlay?: boolean;
  overlayOpacity?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function VideoBg({
  src,
  overlay = true,
  overlayOpacity = 0.4,
  autoPlay = true,
  muted = true,
  loop = true,
  className = '',
  style = {},
}: VideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current && autoPlay) {
          videoRef.current.play().catch(() => {
            // Autoplay failed, user interaction required or browser policy
          });
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (videoRef.current) {
      const handleCanPlay = () => {
        setIsLoaded(true);
        // Fade in animation
        gsap.to(videoRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      };

      videoRef.current.addEventListener('canplay', handleCanPlay);
      return () =>
        videoRef.current?.removeEventListener('canplay', handleCanPlay);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`video-bg-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
        }}
      />

      {/* Overlay Gradient */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, 
              rgba(10, 10, 15, ${overlayOpacity}) 0%,
              rgba(20, 20, 24, ${overlayOpacity * 0.8}) 50%,
              rgba(201, 168, 76, ${overlayOpacity * 0.3}) 100%)`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Loading State */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0A0A0F, #141418)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 0,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(201, 168, 76, 0.2)',
              borderTopColor: '#C9A84C',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
