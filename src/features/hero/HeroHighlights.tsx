// components/ui/Homepage/HeroHighlights.tsx
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarClock, Clock, MapPin } from 'lucide-react';
import * as THREE from 'three';

import { BaseModal } from '@/shared/ui/modals/Base';
import { Container } from '@/shared/layout';
import CustomButton from '@/shared/utils/buttons/CustomButton';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';

/* =============================================================================
   Data
============================================================================= */

const departments = [
  'Media',
  'Music',
  'Hospitality',
  'Protocol',
  'Prayer',
  'Children',
  'Ushering',
] as const;

type Department = (typeof departments)[number];
type ModalKey = 'visit' | 'watch' | 'join' | null;

const actions = [
  { key: 'visit' as const, label: 'Plan Your Visit' },
  { key: 'watch' as const, label: 'Stream Our Service' },
  { key: 'join' as const, label: 'Join Us' },
] as const;

/* =============================================================================
   Modal shell
============================================================================= */

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
          Quick form
        </p>
        {children}
      </div>
    </BaseModal>
  );
}

/* =============================================================================
   Page component
============================================================================= */

type VisitState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  attendance: string;
  notes: string;
};

type WatchState = {
  name: string;
  email: string;
};

type JoinState = {
  name: string;
  email: string;
  phone: string;
  department: Department;
  experience: string;
};

export default function HeroHighlights() {
  const serviceUnavailable = useServiceUnavailable();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [modal, setModal] = useState<ModalKey>(null);

  const [visit, setVisit] = useState<VisitState>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    attendance: '1',
    notes: '',
  });

  const [watch, setWatch] = useState<WatchState>({
    name: '',
    email: '',
  });

  const [join, setJoin] = useState<JoinState>({
    name: '',
    email: '',
    phone: '',
    department: departments[0],
    experience: '',
  });

  const openModal = useCallback((key: ModalKey) => setModal(key), []);
  const closeModal = useCallback(() => setModal(null), []);

  const showUnavailable = useCallback(() => {
    serviceUnavailable.open({
      title: 'Service not available yet',
      message:
        'We are polishing this experience for production. Please check back soon.',
      actionLabel: 'Okay, thanks',
    });
  }, [serviceUnavailable]);

  const onSubmitVisit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      closeModal();
      showUnavailable();
      setVisit({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        attendance: '1',
        notes: '',
      });
    },
    [closeModal, showUnavailable]
  );

  const onSubmitWatch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      closeModal();
      showUnavailable();
      setWatch({ name: '', email: '' });
    },
    [closeModal, showUnavailable]
  );

  const onSubmitJoin = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      closeModal();
      showUnavailable();
      setJoin({
        name: '',
        email: '',
        phone: '',
        department: departments[0],
        experience: '',
      });
    },
    [closeModal, showUnavailable]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(6, 3, 60, 30);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0d0d12),
      emissive: new THREE.Color(0x1b1206),
      metalness: 0.3,
      roughness: 0.8,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -0.6;
    scene.add(plane);

    const light = new THREE.DirectionalLight(0xf7de12, 0.65);
    light.position.set(2, 3, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let rafId = 0;
    let active = true;
    const tick = () => {
      if (!active) return;
      frame += 0.0025;
      plane.rotation.z = frame * 0.4;
      plane.position.y = Math.sin(frame) * 0.08;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      active = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative z-30 -mt-2 sm:-mt-4">
      <Container size="xl" className="relative pb-4 sm:pb-6">
        <div className="mx-auto mb-2 w-full max-w-5xl px-2 sm:px-0">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[22px] border border-white/12 bg-[#0a0a0f]/90 shadow-[0_22px_70px_rgba(0,0,0,0.4)]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full opacity-70"
          />
          <div className="relative z-10 px-4 py-5 sm:px-6 sm:py-6">
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 sm:p-5">
              <div className="flex flex-col gap-3 text-left">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Next Steps
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Take your next step
                </h3>
                <p className="text-[11px] text-white/60">
                  Plan a visit, watch live, or join a serve team.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {actions.map(action => (
                  <CustomButton
                    key={action.key}
                    variant="outline"
                    size="sm"
                    curvature="full"
                    className="border border-white/25 text-[11px] text-white"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.3)',
                    }}
                    onClick={() => openModal(action.key)}
                    type="button"
                  >
                    {action.label}
                  </CustomButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ===================== MODALS ===================== */}

      <ModalShell
        open={modal === 'visit'}
        onClose={closeModal}
        title="Plan your visit"
        subtitle="Book a visit appointment—so we can prepare seats, parking, and a warm welcome."
      >
        <form className="space-y-3" onSubmit={onSubmitVisit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.name}
              onChange={e => setVisit(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.email}
              onChange={e => setVisit(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.phone}
              onChange={e => setVisit(p => ({ ...p, phone: e.target.value }))}
            />
            <select
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.attendance}
              onChange={e =>
                setVisit(p => ({ ...p, attendance: e.target.value }))
              }
              aria-label="Number of attendees"
            >
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5+">5+ people</option>
            </select>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <CalendarClock className="w-4 h-4" />
              Appointment details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                  Date
                </span>
                <input
                  type="date"
                  className="w-full rounded-2xl bg-black/30 border border-white/12 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  value={visit.date}
                  onChange={e =>
                    setVisit(p => ({ ...p, date: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                  Time
                </span>
                <input
                  type="time"
                  className="w-full rounded-2xl bg-black/30 border border-white/12 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  value={visit.time}
                  onChange={e =>
                    setVisit(p => ({ ...p, time: e.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-white/75">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                <Clock className="w-3.5 h-3.5" /> Sundays 9:00 AM (WAT)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                <MapPin className="w-3.5 h-3.5" /> We'll email directions
              </span>
            </div>
          </div>

          <textarea
            placeholder="Notes (optional) — kids, first time, prayer request, accessibility needs…"
            className="w-full min-h-[96px] rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary resize-none"
            value={visit.notes}
            onChange={e => setVisit(p => ({ ...p, notes: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Confirm appointment <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-white/50 text-xs">
            We confirm by email and send a reminder. No spam, ever.
          </p>
        </form>
      </ModalShell>

      <ModalShell
        open={modal === 'watch'}
        onClose={closeModal}
        title="Watch live or on-demand"
        subtitle="Drop your email and we’ll remind you 30 minutes before we go live."
      >
        <form className="space-y-3" onSubmit={onSubmitWatch}>
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
            value={watch.name}
            onChange={e => setWatch(p => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
            value={watch.email}
            onChange={e => setWatch(p => ({ ...p, email: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Notify me <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/50 text-xs">
            Service reminders only. No spam.
          </p>
        </form>
      </ModalShell>

      <ModalShell
        open={modal === 'join'}
        onClose={closeModal}
        title="Join a serve team"
        subtitle="Pick a department and we’ll connect you with the team lead within 24 hours."
      >
        <form className="space-y-3" onSubmit={onSubmitJoin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.name}
              onChange={e => setJoin(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.email}
              onChange={e => setJoin(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.phone}
              onChange={e => setJoin(p => ({ ...p, phone: e.target.value }))}
            />

            <select
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.department}
              onChange={e =>
                setJoin(p => ({
                  ...p,
                  department: e.target.value as Department,
                }))
              }
              required
              aria-label="Select department"
            >
              {departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Any experience? (optional) — music instrument, camera, design, admin, teaching…"
            className="w-full min-h-[96px] rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary resize-none"
            value={join.experience}
            onChange={e => setJoin(p => ({ ...p, experience: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Send interest <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-white/50 text-xs">
            We’ll reach out by email (or phone if provided). No spam.
          </p>
        </form>
      </ModalShell>
    </section>
  );
}
