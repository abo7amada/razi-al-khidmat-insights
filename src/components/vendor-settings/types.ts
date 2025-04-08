
export interface Organization {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'شركة النور للتقنية',
    email: 'admin@alnoor-tech.com',
    active: true
  },
  {
    id: 'org2', 
    name: 'مؤسسة الأمل للخدمات',
    email: 'info@alamal.com',
    active: true
  },
  {
    id: 'org3',
    name: 'مستشفى الرحمة',
    email: 'contact@rahma-hospital.com',
    active: false
  }
];
