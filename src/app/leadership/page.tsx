'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Section, Container } from '@/components/layout';
import { H2, H3, BodyLG, BodySM, Caption, SmallText } from '@/components/text';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { apiClient } from '@/lib/api';
import type { LeadershipApplicationRequest, LeadershipMember, LeadershipRole } from '@/lib/types';

const ROLE_LABELS: Record<LeadershipRole, string> = {
  senior_pastor: 'Senior Pastor',
  associate_pastor: 'Associate Pastor',
  deacon: 'Deacon',
  deaconess: 'Deaconness',
  reverend: 'Reverend',
};

const ROLE_ORDER: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
  'deacon',
  'deaconess',
];

const ddmm = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
const ddmmyyyy = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const emptyForm: LeadershipApplicationRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'associate_pastor',
  bio: '',
  birthday: '',
  anniversary: '',
};

function initials(firstName?: string, lastName?: string) {
  const a = (firstName || '').trim()[0] || '';
  const b = (lastName || '').trim()[0] || '';
  return `${a}${b}`.toUpperCase() || 'LC';
}

export default function LeadershipPage() {
  const { colorScheme } = useTheme();
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<LeadershipApplicationRequest>(emptyForm);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient
      .listLeadership()
      .then((items) => {
        if (!active) return;
        setLeaders(Array.isArray(items) ? items : []);
        setLoadError(null);
      })
      .catch((err: any) => {
        if (!active) return;
        setLoadError(err?.message || 'Unable to load leadership.');
        setLeaders([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(
    () =>
      ROLE_ORDER.map((role) => ({
        role,
        label: ROLE_LABELS[role],
        items: leaders.filter((leader) => leader.role === role),
      })),
    [leaders]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setSubmitMessage({ type: 'error', text: 'First and last name are required.' });
      return;
    }
    if (form.birthday && !ddmm.test(form.birthday)) {
      setSubmitMessage({ type: 'error', text: 'Birthday must use DD/MM.' });
      return;
    }
    if (form.anniversary && !ddmmyyyy.test(form.anniversary)) {
      setSubmitMessage({ type: 'error', text: 'Wedding anniversary must use DD/MM/YYYY.' });
      return;
    }
    if (profileImage && profileImage.size > 5 * 1024 * 1024) {
      setSubmitMessage({ type: 'error', text: 'Profile image must be 5MB or less.' });
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl: string | undefined;
      if (profileImage) {
        const upload = await apiClient.uploadLeadershipImage(profileImage);
        imageUrl = upload?.url;
      }

      await apiClient.applyLeadership({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        role: form.role,
        bio: form.bio?.trim() || undefined,
        birthday: form.birthday?.trim() || undefined,
        anniversary: form.anniversary?.trim() || undefined,
        imageUrl,
      });
      setForm(emptyForm);
      setProfileImage(null);
      setSubmitMessage({
        type: 'success',
        text: 'Application submitted. Our leadership team will follow up soon.',
      });
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: err?.message || 'Unable to submit your application.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Section padding="lg" className="relative overflow-hidden" style={{ background: '#070707' }}>
        <Container size="xl" className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em]">
            Leadership
          </div>
          <H2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Leadership at Wisdom Church
          </H2>
          <BodyLG className="text-white/75 max-w-3xl">
            Our leaders steward the vision, care for the people, and build healthy ministries. Meet the
            team and apply if you have been called into leadership.
          </BodyLG>
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#0b0b0b]">
        <Container size="xl" className="space-y-8">
          <div className="flex flex-col gap-2">
            <H3 className="text-2xl sm:text-3xl font-bold">Meet the leadership</H3>
            <Caption className="text-white/60">
              Approved leaders are displayed here. Applications are reviewed by church leadership.
            </Caption>
          </div>

          {loading && <BodySM className="text-white/60">Loading leadership...</BodySM>}
          {loadError && <BodySM className="text-red-300">{loadError}</BodySM>}

          {!loading &&
            !loadError &&
            grouped.map((group) => (
              <div key={group.role} className="space-y-4">
                <SmallText className="text-white/70 uppercase tracking-[0.2em] text-xs">
                  {group.label}
                </SmallText>

                {group.items.length === 0 ? (
                  <Caption className="text-white/50">No approved leaders yet.</Caption>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((leader) => (
                      <div
                        key={leader.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl"
                      >
                        <div className="flex items-center gap-4">
                          {leader.imageUrl ? (
                            <img
                              src={leader.imageUrl}
                              alt={`${leader.firstName} ${leader.lastName}`}
                              className="h-14 w-14 rounded-full object-cover border border-white/15"
                            />
                          ) : (
                            <div
                              className="h-14 w-14 rounded-full flex items-center justify-center text-sm font-semibold"
                              style={{
                                background: `linear-gradient(140deg, ${colorScheme.primary} 0%, #1f2937 100%)`,
                              }}
                            >
                              {initials(leader.firstName, leader.lastName)}
                            </div>
                          )}

                          <div className="space-y-1">
                            <SmallText weight="bold" className="text-white">
                              {leader.firstName} {leader.lastName}
                            </SmallText>
                            <Caption className="text-white/60">{ROLE_LABELS[leader.role]}</Caption>
                          </div>
                        </div>

                        {leader.bio && (
                          <Caption className="text-white/65 mt-3 leading-relaxed">
                            {leader.bio}
                          </Caption>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <Container size="xl" className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-3">
            <H3 className="text-2xl sm:text-3xl font-bold">Leadership registration</H3>
            <BodySM className="text-white/70">
              This form is for Senior Pastor, Associate Pastor, Reverend, Deacon, and Deaconness
              leadership categories.
            </BodySM>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 space-y-1">
                First name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
              </label>

              <label className="text-sm text-white/80 space-y-1">
                Last name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 space-y-1">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
              </label>

              <label className="text-sm text-white/80 space-y-1">
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
              </label>
            </div>

            <label className="text-sm text-white/80 space-y-1">
              Role
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
              >
                {ROLE_ORDER.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 space-y-1">
                Birthday (DD/MM)
                <input
                  name="birthday"
                  value={form.birthday || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                  placeholder="25/12"
                />
              </label>

              <label className="text-sm text-white/80 space-y-1">
                Wedding anniversary (DD/MM/YYYY)
                <input
                  name="anniversary"
                  value={form.anniversary || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                  placeholder="16/06/2014"
                />
              </label>
            </div>

            <label className="text-sm text-white/80 space-y-1 block">
              Profile image (max 5MB)
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
              />
            </label>

            <label className="text-sm text-white/80 space-y-1 block">
              Short bio (optional)
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary min-h-[110px]"
                placeholder="Share your leadership assignment and experience."
              />
            </label>

            {submitMessage && (
              <Caption
                className={`${
                  submitMessage.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                {submitMessage.text}
              </Caption>
            )}

            <CustomButton
              type="submit"
              variant="primary"
              size="md"
              curvature="xl"
              elevated
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit leadership application'}
            </CustomButton>
          </form>
        </Container>
      </Section>
    </div>
  );
}
