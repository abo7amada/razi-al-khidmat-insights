
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  planExpiresAt: string; // ISO date string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string; // للاستخدام في URLs
}

export interface SubscriptionLog {
  id: string;
  companyId: string;
  action: 'created' | 'renewed' | 'cancelled' | 'upgraded' | 'downgraded';
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  validFrom: string;
  validTo: string;
  createdAt: string;
  createdBy: string; // user id who performed the action
  notes?: string;
}

export type UserRole = 'super_admin' | 'company_admin' | 'editor' | 'viewer';

// قائمة الشركات المزيفة للعرض
export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'شركة النور للتقنية',
    logoUrl: '/placeholder.svg',
    plan: 'premium',
    planExpiresAt: '2025-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    slug: 'alnoor-tech'
  },
  {
    id: 'comp2',
    name: 'مؤسسة الأمل للخدمات',
    logoUrl: '/placeholder.svg',
    plan: 'basic',
    planExpiresAt: '2025-10-15T23:59:59Z',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    slug: 'alamal'
  },
  {
    id: 'comp3',
    name: 'مستشفى الرحمة',
    logoUrl: '/placeholder.svg',
    plan: 'free',
    planExpiresAt: '2025-01-01T23:59:59Z',
    isActive: false,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-04-01T10:30:00Z',
    slug: 'rahma-hospital'
  }
];

// قائمة سجلات الاشتراكات المزيفة
export const mockSubscriptionLogs: SubscriptionLog[] = [
  {
    id: 'sl1',
    companyId: 'comp1',
    action: 'created',
    plan: 'premium',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'sl2',
    companyId: 'comp2',
    action: 'created',
    plan: 'basic',
    validFrom: '2024-02-15T00:00:00Z',
    validTo: '2025-10-15T23:59:59Z',
    createdAt: '2024-02-15T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'sl3',
    companyId: 'comp3',
    action: 'created',
    plan: 'free',
    validFrom: '2024-03-01T00:00:00Z',
    validTo: '2025-01-01T23:59:59Z',
    createdAt: '2024-03-01T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'sl4',
    companyId: 'comp3',
    action: 'cancelled',
    plan: 'free',
    validFrom: '2024-03-01T00:00:00Z',
    validTo: '2024-04-01T10:30:00Z',
    createdAt: '2024-04-01T10:30:00Z',
    createdBy: 'admin1',
    notes: 'تم إيقاف الاشتراك لعدم السداد'
  }
];
