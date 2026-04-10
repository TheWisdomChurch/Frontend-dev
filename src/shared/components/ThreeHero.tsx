/**
 * Three.js Animated Hero Background
 * Displays animated particles, spheres, or waves
 * Optimized for church website aesthetic
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroProps {
  backgroundColor?: string;
  particleColor?: string;
  particleCount?: number;
  animationSpeed?: number;
  height?: string;
}

export default function ThreeHero({
  backgroundColor = '#0A0A0F',
  particleColor = '#C9A84C',
  particleCount = 100,
  animationSpeed = 0.5,
  height = '100vh',
}: ThreeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // ========================================
    // SCENE SETUP
    // ========================================
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(backgroundColor, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========================================
    // PARTICLE SYSTEM
    // ========================================
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 400; // x
      positions[i + 1] = (Math.random() - 0.5) * 400; // y
      positions[i + 2] = (Math.random() - 0.5) * 400; // z

      velocities[i] = (Math.random() - 0.5) * animationSpeed;
      velocities[i + 1] = (Math.random() - 0.5) * animationSpeed;
      velocities[i + 2] = (Math.random() - 0.5) * animationSpeed;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: 2,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // ========================================
    // ANIMATION LOOP
    // ========================================
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.00005;
        particlesRef.current.rotation.y += 0.0001;

        // Update particle positions for wave effect
        const positions = particleGeometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Wrap around if out of bounds
          if (Math.abs(positions[i]) > 200) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 200) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 200) velocities[i + 2] *= -1;
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ========================================
    // HANDLE WINDOW RESIZE
    // ========================================
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ========================================
    // CLEANUP
    // ========================================
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [backgroundColor, particleColor, particleCount, animationSpeed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height,
        overflow: 'hidden',
      }}
    />
  );
}
