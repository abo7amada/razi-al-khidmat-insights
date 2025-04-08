export type UserRole = 
  | 'super_admin'
  | 'system_admin'
  | 'company_owner'
  | 'company_admin'
  | 'editor'
  | 'viewer'
  | 'branchManager'
  | 'admin'; // Added 'admin' role

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  organizationId?: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  branches?: string[];
}

export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  plan: string;
  planExpiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  plan: string;
  planExpiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export const mockUsers: User[] = [
  {
    id: 'user1',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@example.com',
    password: 'password',
    role: 'super_admin',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user2',
    firstName: 'System',
    lastName: 'Admin',
    email: 'systemadmin@example.com',
    password: 'password',
    role: 'system_admin',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user3',
    firstName: 'Company',
    lastName: 'Owner',
    email: 'owner@example.com',
    password: 'password',
    role: 'company_owner',
    organizationId: 'org1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user4',
    firstName: 'Company',
    lastName: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'company_admin',
    organizationId: 'org1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
    {
    id: 'user10',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user5',
    firstName: 'Editor',
    lastName: 'User',
    email: 'editor@example.com',
    password: 'password',
    role: 'editor',
    organizationId: 'org1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user6',
    firstName: 'Viewer',
    lastName: 'User',
    email: 'viewer@example.com',
    password: 'password',
    role: 'viewer',
    organizationId: 'org1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user7',
    firstName: 'Branch',
    lastName: 'Manager',
    email: 'branch@example.com',
    password: 'password',
    role: 'branchManager',
    organizationId: 'org1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    branches: ['branch1']
  },
  {
    id: 'user8',
    firstName: 'Inactive',
    lastName: 'User',
    email: 'inactive@example.com',
    password: 'password',
    role: 'viewer',
    organizationId: 'org2',
    active: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user9',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password',
    role: 'company_admin',
    organizationId: 'org2',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Test Company',
    logoUrl: '/placeholder.svg',
    plan: 'premium',
    planExpiresAt: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 'user3',
  },
  {
    id: 'org2',
    name: 'Inactive Company',
    logoUrl: '/placeholder.svg',
    plan: 'basic',
    planExpiresAt: new Date(new Date().getFullYear() - 1, 0, 1).toISOString(),
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 'user8',
  },
];

export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'Acme Corp',
    logoUrl: '/placeholder.svg',
    plan: 'premium',
    planExpiresAt: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'acme-corp'
  },
  {
    id: 'comp2',
    name: 'Beta Co',
    logoUrl: '/placeholder.svg',
    plan: 'basic',
    planExpiresAt: new Date(new Date().getFullYear() + 1, 6, 1).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'beta-co'
  },
  {
    id: 'comp3',
    name: 'Gamma Industries',
    logoUrl: '/placeholder.svg',
    plan: 'enterprise',
    planExpiresAt: new Date(new Date().getFullYear() + 2, 0, 1).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'gamma-industries'
  },
  {
    id: 'comp4',
    name: 'Delta Solutions',
    logoUrl: '/placeholder.svg',
    plan: 'free',
    planExpiresAt: new Date().toISOString(),
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'delta-solutions'
  },
];
