
export type UserRole = 
  'super_admin' | 
  'system_admin' | 
  'company_owner' | 
  'company_admin' | 
  'editor' | 
  'viewer' |
  'branchManager';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  planExpiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string;
}

export interface Site {
  id: string;
  companyId: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  address?: string;
  city?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SubscriptionLog {
  id: string;
  companyId: string;
  action: 'created' | 'renewed' | 'cancelled' | 'upgraded' | 'downgraded';
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  validFrom: string;
  validTo: string;
  createdAt: string;
  createdBy: string;
}

// Mock data for companies
export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'شركة النور للتقنية',
    logoUrl: '/placeholder.svg',
    plan: 'premium',
    planExpiresAt: '2025-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    slug: 'alnoor-tech'
  },
  {
    id: 'comp2',
    name: 'مؤسسة الأمل للخدمات',
    logoUrl: '/placeholder.svg',
    plan: 'basic',
    planExpiresAt: '2025-10-15T23:59:59Z',
    isActive: true,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
    slug: 'alamal'
  },
  {
    id: 'comp3',
    name: 'مستشفى الرحمة',
    logoUrl: '/placeholder.svg',
    plan: 'free',
    planExpiresAt: '2025-01-01T23:59:59Z',
    isActive: false,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
    slug: 'rahma-hospital'
  }
];

// Mock data for sites
export const mockSites: Site[] = [
  {
    id: 'site1',
    companyId: 'comp1',
    name: 'فرع الرياض - النور للتقنية',
    nameAr: 'فرع الرياض',
    nameEn: 'Riyadh Branch',
    address: 'شارع الملك فهد، الرياض',
    city: 'الرياض',
    phone: '+966 11 123 4567',
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: 'site2',
    companyId: 'comp1',
    name: 'فرع جدة - النور للتقنية',
    nameAr: 'فرع جدة',
    nameEn: 'Jeddah Branch',
    address: 'شارع الأندلس، جدة',
    city: 'جدة',
    phone: '+966 12 123 4567',
    isActive: true,
    createdAt: '2023-01-20T00:00:00Z'
  },
  {
    id: 'site3',
    companyId: 'comp2',
    name: 'فرع الرياض - الأمل للخدمات',
    nameAr: 'فرع الرياض',
    nameEn: 'Riyadh Branch',
    address: 'شارع التحلية، الرياض',
    city: 'الرياض',
    phone: '+966 11 987 6543',
    isActive: true,
    createdAt: '2023-02-15T00:00:00Z'
  },
  {
    id: 'site4',
    companyId: 'comp3',
    name: 'فرع الرياض - مستشفى الرحمة',
    nameAr: 'فرع الرياض',
    nameEn: 'Riyadh Branch',
    address: 'شارع العليا، الرياض',
    city: 'الرياض',
    phone: '+966 11 456 7890',
    isActive: false,
    createdAt: '2023-03-15T00:00:00Z'
  }
];

// Mock subscription logs
export const mockSubscriptionLogs: SubscriptionLog[] = [
  {
    id: 'log1',
    companyId: 'comp1',
    action: 'created',
    plan: 'basic',
    validFrom: '2023-01-01T00:00:00Z',
    validTo: '2024-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'log2',
    companyId: 'comp1',
    action: 'upgraded',
    plan: 'premium',
    validFrom: '2023-06-15T00:00:00Z',
    validTo: '2024-06-15T00:00:00Z',
    createdAt: '2023-06-15T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'log3',
    companyId: 'comp2',
    action: 'created',
    plan: 'basic',
    validFrom: '2023-02-01T00:00:00Z',
    validTo: '2024-02-01T00:00:00Z',
    createdAt: '2023-02-01T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'log4',
    companyId: 'comp3',
    action: 'created',
    plan: 'free',
    validFrom: '2023-03-01T00:00:00Z',
    validTo: '2024-03-01T00:00:00Z',
    createdAt: '2023-03-01T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'log5',
    companyId: 'comp3',
    action: 'cancelled',
    plan: 'free',
    validFrom: '2023-03-01T00:00:00Z',
    validTo: '2023-12-15T00:00:00Z', // Early cancellation
    createdAt: '2023-12-15T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'log6',
    companyId: 'comp2',
    action: 'renewed',
    plan: 'basic',
    validFrom: '2024-02-01T00:00:00Z',
    validTo: '2025-02-01T00:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    createdBy: 'admin1'
  },
  {
    id: 'log7',
    companyId: 'comp1',
    action: 'renewed',
    plan: 'premium',
    validFrom: '2024-06-15T00:00:00Z',
    validTo: '2025-06-15T00:00:00Z',
    createdAt: '2024-06-15T00:00:00Z',
    createdBy: 'admin1'
  }
];
