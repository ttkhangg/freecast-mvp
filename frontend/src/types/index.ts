export enum Role {
  ADMIN = 'ADMIN',
  BRAND = 'BRAND',
  KOL = 'KOL',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  socialLink?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  rating?: number; // NEW: Số sao trung bình
}

export enum CampaignStatus {
  OPEN = 'OPEN',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline: string;
  status: CampaignStatus;
  brandId: string;
  brand: {
    id: string;
    fullName: string;
    avatar: string | null;
    bio?: string | null;
  };
  _count?: {
    applications: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}