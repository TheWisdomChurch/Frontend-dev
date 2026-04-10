/**
 * Three.js Animated Hero Background
 * Displays animated particles, spheres, or waves
 * Optimized for church website aesthetic
 */

'use client';

import { useEffect, useRef } from 'react';
import * as ThreeNamespace from 'three';

interface ThreeSceneLike {
  add: (object: ThreePointsLike) => void;
  remove: (object: ThreePointsLike) => void;
}

interface ThreeCameraLike {
  position: { z: number };
  aspect: number;
  updateProjectionMatrix: () => void;
}

interface ThreeRendererLike {
  domElement: HTMLCanvasElement;
  setSize: (width: number, height: number) => void;
  setClearColor: (color: string, alpha?: number) => void;
  setPixelRatio: (ratio: number) => void;
  render: (scene: ThreeSceneLike, camera: ThreeCameraLike) => void;
  dispose: () => void;
}

interface ThreeAttributeLike {
  array: ArrayLike<number>;
  needsUpdate: boolean;
}

interface ThreeGeometryLike {
  setAttribute: (name: string, attribute: ThreeAttributeLike) => void;
  getAttribute: (name: string) => ThreeAttributeLike;
  dispose: () => void;
}

interface ThreeMaterialLike {
  dispose: () => void;
}

interface ThreePointsLike {
  rotation: {
    x: number;
    y: number;
  };
}

interface ThreeModuleLike {
  Scene: new () => ThreeSceneLike;
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number
  ) => ThreeCameraLike;
  WebGLRenderer: new (options: {
    antialias: boolean;
    alpha: boolean;
  }) => ThreeRendererLike;
  BufferGeometry: new () => ThreeGeometryLike;
  BufferAttribute: new (
    array: Float32Array,
    itemSize: number
  ) => ThreeAttributeLike;
  PointsMaterial: new (options: {
    color: string;
    size: number;
    transparent: boolean;
    opacity: number;
    sizeAttenuation: boolean;
  }) => ThreeMaterialLike;
  Points: new (
    geometry: ThreeGeometryLike,
    material: ThreeMaterialLike
  ) => ThreePointsLike;
}

const THREE = ThreeNamespace as unknown as ThreeModuleLike;

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
  const sceneRef = useRef<ThreeSceneLike | null>(null);
  const rendererRef = useRef<ThreeRendererLike | null>(null);
  const particlesRef = useRef<ThreePointsLike | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
      75,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(backgroundColor, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
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
        const positionAttribute = particleGeometry.getAttribute('position');
        const positions = positionAttribute.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Wrap around if out of bounds
          if (Math.abs(positions[i]) > 200) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 200) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 200) velocities[i + 2] *= -1;
        }
        positionAttribute.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ========================================
    // HANDLE WINDOW RESIZE
    // ========================================
    const handleResize = () => {
      const width = container.clientWidth || window.innerWidth;
      const containerHeight = container.clientHeight || window.innerHeight;

      camera.aspect = width / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, containerHeight);
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
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      scene.remove(particles);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      particlesRef.current = null;
      rendererRef.current = null;
      sceneRef.current = null;
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
