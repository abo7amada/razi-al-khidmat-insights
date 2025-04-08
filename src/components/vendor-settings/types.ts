
export interface Organization {
  id: string;
  name: string;
  email: string;
  active: boolean;
  password?: string; // إضافة كلمة المرور للمؤسسة
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'organization';
  organizationId?: string;
}

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'شركة النور للتقنية',
    email: 'admin@alnoor-tech.com',
    active: true,
    password: 'password123'
  },
  {
    id: 'org2', 
    name: 'مؤسسة الأمل للخدمات',
    email: 'info@alamal.com',
    active: true,
    password: 'password123'
  },
  {
    id: 'org3',
    name: 'مستشفى الرحمة',
    email: 'contact@rahma-hospital.com',
    active: false,
    password: 'password123'
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@system.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 'org1user',
    email: 'admin@alnoor-tech.com',
    password: 'password123',
    role: 'organization',
    organizationId: 'org1'
  },
  {
    id: 'org2user',
    email: 'info@alamal.com',
    password: 'password123',
    role: 'organization',
    organizationId: 'org2'
  }
];
