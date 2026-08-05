export type LeadershipRole =
  'senior_pastor' | 'associate_pastor' | 'deacon' | 'deaconess' | 'reverend';

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
