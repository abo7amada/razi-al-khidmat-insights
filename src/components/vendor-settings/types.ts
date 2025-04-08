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
  defaultSiteId?: string; // Added default site for company users
  branches?: string[]; // Added branches array for branch managers
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
    role: 'system_admin',
    active: true,
    name: 'مدير النظام',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user1',
    email: 'admin@alnoor-tech.com',
    password: 'password123',
    role: 'company_owner',
    organizationId: 'comp1',
    active: true,
    name: 'أحمد محمد',
    createdAt: '2024-01-01T00:00:00Z',
    defaultSiteId: 'site1'
  },
  {
    id: 'user2',
    email: 'editor@alnoor-tech.com',
    password: 'password123',
    role: 'editor',
    organizationId: 'comp1',
    active: true,
    name: 'سارة أحمد',
    createdAt: '2024-01-02T00:00:00Z',
    defaultSiteId: 'site2'
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
    role: 'company_owner',
    organizationId: 'comp2',
    active: true,
    name: 'فاطمة حسن',
    createdAt: '2024-02-15T00:00:00Z',
    defaultSiteId: 'site3'
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
  },
  {
    id: 'branchManager1',
    email: 'manager@alnoor-tech.com',
    password: 'password123',
    role: 'branchManager',
    organizationId: 'comp1',
    active: true,
    name: 'عمر محمود',
    createdAt: '2024-03-15T00:00:00Z',
    branches: ['site1', 'site2']
  }
];

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

// Mock data for survey templates
export const mockSurveyTemplates: SurveyTemplate[] = [
  {
    id: 'template1',
    companyId: 'comp1',
    type: 'NPS',
    title: 'استبيان رضا العملاء القياسي',
    description: 'استبيان قياسي لقياس مدى رضا العملاء وإمكانية توصيتهم لخدماتنا',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'template2',
    companyId: 'comp1',
    type: 'LIKERT',
    title: 'استبيان جودة الخدمة',
    description: 'استبيان لتقييم جوانب مختلفة من جودة الخدمة المقدمة',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  }
];

// Mock data for questions
export const mockQuestions: Question[] = [
  {
    id: 'q1',
    templateId: 'template1',
    textAr: 'ما مدى احتمال أن توصي خدماتنا لصديق أو زميل؟',
    textEn: 'How likely are you to recommend our services to a friend or colleague?',
    order: 1,
    scale: '0-10'
  },
  {
    id: 'q2',
    templateId: 'template2',
    textAr: 'ما مدى رضاك عن نظافة المكان؟',
    textEn: 'How satisfied are you with the cleanliness of the venue?',
    order: 1,
    scale: '1-5'
  },
  {
    id: 'q3',
    templateId: 'template2',
    textAr: 'ما مدى رضاك عن جودة الخدمة المقدمة؟',
    textEn: 'How satisfied are you with the quality of service provided?',
    order: 2,
    scale: '1-5'
  },
  {
    id: 'q4',
    templateId: 'template2',
    textAr: 'ما مدى رضاك عن سرعة الاستجابة؟',
    textEn: 'How satisfied are you with the response time?',
    order: 3,
    scale: '1-5'
  }
];

// Mock responses data
export const mockResponses: Response[] = [
  {
    id: 'resp1',
    surveyId: 'template1',
    siteId: 'site1',
    companyId: 'comp1',
    npsScore: 9,
    comment: 'خدمة ممتازة، شكراً!',
    createdAt: '2024-03-01T10:15:00Z',
    customerName: 'أحمد محمد'
  },
  {
    id: 'resp2',
    surveyId: 'template1',
    siteId: 'site2',
    companyId: 'comp1',
    npsScore: 7,
    comment: 'جيد، ولكن يمكن تحسين السرعة',
    createdAt: '2024-03-02T11:30:00Z',
    customerName: 'سارة أحمد'
  },
  {
    id: 'resp3',
    surveyId: 'template2',
    siteId: 'site1',
    companyId: 'comp1',
    likertScores: {
      'q2': 4,
      'q3': 5,
      'q4': 3
    },
    comment: 'جودة الخدمة ممتازة، لكن الاستجابة كانت بطيئة قليلاً',
    createdAt: '2024-03-03T14:45:00Z',
    customerName: 'محمد علي'
  }
];

// Mock complaints data
export const mockComplaints: Complaint[] = [
  {
    id: 'comp1',
    siteId: 'site1',
    companyId: 'comp1',
    customerName: 'خالد إبراهيم',
    phone: '+966501234567',
    issueType: 'جودة المنتج',
    description: 'المنتج لا يعمل بشكل صحيح بعد الاستخدام الأول',
    status: 'new',
    createdAt: '2024-03-01T09:20:00Z',
    updatedAt: '2024-03-01T09:20:00Z'
  },
  {
    id: 'comp2',
    siteId: 'site2',
    companyId: 'comp1',
    customerName: 'فاطمة محمد',
    phone: '+966512345678',
    issueType: 'تأخير الخدمة',
    description: 'انتظرت أكثر من ساعة للحصول على الخدمة المطلوبة',
    status: 'in_progress',
    createdAt: '2024-03-02T13:15:00Z',
    updatedAt: '2024-03-02T15:30:00Z',
    assignedTo: 'employee1'
  },
  {
    id: 'comp3',
    siteId: 'site1',
    companyId: 'comp1',
    customerName: 'عبدالله علي',
    phone: '+966523456789',
    issueType: 'فاتورة خاطئة',
    description: 'تم احتساب خدمات إضافية لم أطلبها في الفاتورة',
    status: 'resolved',
    createdAt: '2024-03-03T10:45:00Z',
    updatedAt: '2024-03-04T09:30:00Z'
  }
];
