/**
 * Leadership role is free text supplied by the applicant. These slugs are the
 * canonical values for the founding pastors / board — the directory groups on
 * them and gives them friendly labels — but any string is valid.
 */
export type LeadershipRoleSlug =
  'senior_pastor' | 'associate_pastor' | 'deacon' | 'deaconess' | 'reverend';

export type LeadershipRole = LeadershipRoleSlug | (string & {});

const ROLE_LABELS: Record<LeadershipRoleSlug, string> = {
  senior_pastor: 'Senior Pastor',
  associate_pastor: 'Associate Pastor',
  deacon: 'Deacon',
  deaconess: 'Deaconess',
  reverend: 'Reverend',
};

const KNOWN_ROLE_SLUGS = Object.keys(ROLE_LABELS) as LeadershipRoleSlug[];

export function isKnownLeadershipRole(
  role: string
): role is LeadershipRoleSlug {
  return (KNOWN_ROLE_SLUGS as string[]).includes(role);
}

/** A canonical slug → its label; free text → itself (slug-style `_` turned
 *  into spaced Title Case for the odd legacy value). */
export function formatLeadershipRole(role: string): string {
  if (isKnownLeadershipRole(role)) return ROLE_LABELS[role];

  const trimmed = role.trim();
  if (!trimmed) return 'Leadership';
  if (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(trimmed)) {
    return trimmed
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return trimmed;
}

export type LeadershipStatus = 'pending' | 'approved' | 'declined';

export interface LeadershipMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: LeadershipRole;
  status: LeadershipStatus;
  bio?: string | null;
  imageUrl?: string | null;
  birthday?: string;
  anniversary?: string;
  birthdayMonth?: number;
  birthdayDay?: number;
  anniversaryMonth?: number;
  anniversaryDay?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadershipApplicationRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: LeadershipRole;
  bio?: string;
  imageUrl?: string;
  birthday?: string;
  anniversary?: string;
}
