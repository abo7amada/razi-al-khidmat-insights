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
  createdBy: string; // user id who performed the action
  notes?: string;
}

export type UserRole = 'super_admin' | 'company_admin' | 'editor' | 'viewer' | 'system_admin' | 'company_owner';

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

// Mock sites data
export const mockSites: Site[] = [
  {
    id: 'site1',
    companyId: 'comp1',
    name: 'الفرع الرئيسي',
    nameAr: 'الفرع الرئيسي',
    nameEn: 'Main Branch',
    address: 'شارع الملك فهد، الرياض',
    city: 'الرياض',
    phone: '+966 11 123 4567',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'site2',
    companyId: 'comp1',
    name: 'فرع الدمام',
    nameAr: 'فرع الدمام',
    nameEn: 'Dammam Branch',
    address: 'طريق الملك خالد، الدمام',
    city: 'الدمام',
    phone: '+966 13 123 4567',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'site3',
    companyId: 'comp2',
    name: 'المقر الرئيسي',
    nameAr: 'المقر الرئيسي',
    nameEn: 'Headquarters',
    address: 'شارع التحلية، جدة',
    city: 'جدة',
    phone: '+966 12 123 4567',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'site4',
    companyId: 'comp2',
    name: 'فرع المدينة',
    nameAr: 'فرع المدينة',
    nameEn: 'Madinah Branch',
    address: 'شارع العزيزية، المدينة المنورة',
    city: 'المدينة المنورة',
    phone: '+966 14 123 4567',
    isActive: true,
    createdAt: '2024-02-20T00:00:00Z'
  }
];
