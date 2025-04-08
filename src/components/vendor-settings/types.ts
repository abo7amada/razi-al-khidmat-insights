
import { UserRole } from '../../types/company';

export interface Organization {
  id: string;
  name: string;
  email: string;
  active: boolean;
  password?: string;
  logoUrl?: string;
  plan?: 'free' | 'basic' | 'premium' | 'enterprise';
  planExpiresAt?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId?: string;
  name?: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
}

export const mockOrganizations: Organization[] = [
  {
    id: 'comp1',
    name: 'شركة النور للتقنية',
    email: 'admin@alnoor-tech.com',
    active: true,
    password: 'password123',
    logoUrl: '/placeholder.svg',
    plan: 'premium',
    planExpiresAt: '2025-12-31T23:59:59Z'
  },
  {
    id: 'comp2', 
    name: 'مؤسسة الأمل للخدمات',
    email: 'info@alamal.com',
    active: true,
    password: 'password123',
    logoUrl: '/placeholder.svg',
    plan: 'basic',
    planExpiresAt: '2025-10-15T23:59:59Z'
  },
  {
    id: 'comp3',
    name: 'مستشفى الرحمة',
    email: 'contact@rahma-hospital.com',
    active: false,
    password: 'password123',
    logoUrl: '/placeholder.svg',
    plan: 'free',
    planExpiresAt: '2025-01-01T23:59:59Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@system.com',
    password: 'admin123',
    role: 'super_admin',
    active: true,
    name: 'مدير النظام',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user1',
    email: 'admin@alnoor-tech.com',
    password: 'password123',
    role: 'company_admin',
    organizationId: 'comp1',
    active: true,
    name: 'أحمد محمد',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user2',
    email: 'editor@alnoor-tech.com',
    password: 'password123',
    role: 'editor',
    organizationId: 'comp1',
    active: true,
    name: 'سارة أحمد',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'user3',
    email: 'viewer@alnoor-tech.com',
    password: 'password123',
    role: 'viewer',
    organizationId: 'comp1',
    active: true,
    name: 'خالد علي',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'user4',
    email: 'admin@alamal.com',
    password: 'password123',
    role: 'company_admin',
    organizationId: 'comp2',
    active: true,
    name: 'فاطمة حسن',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'user5',
    email: 'admin@rahma-hospital.com',
    password: 'password123',
    role: 'company_admin',
    organizationId: 'comp3',
    active: false,
    name: 'محمد عبدالله',
    createdAt: '2024-03-01T00:00:00Z'
  }
];
