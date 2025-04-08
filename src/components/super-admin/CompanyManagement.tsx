import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, FileEdit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { mockCompanies } from '../../types/company';
import { useToast } from '@/components/ui/use-toast';

// Keep the existing types and mock data
export type UserRole = 
  | 'super_admin'
  | 'system_admin'
  | 'company_owner'
  | 'company_admin'
  | 'editor'
  | 'viewer'
  | 'branchManager'
  | 'admin';

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

// Add Site interface
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

// Add Survey related interfaces
export interface SurveyTemplate {
  id: string;
  companyId: string;
  type: 'NPS' | 'LIKERT';
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Question {
  id: string;
  templateId: string;
  textAr: string;
  textEn: string;
  order: number;
  scale: string;
}

export type ComplaintStatus = 'new' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  siteId: string;
  companyId: string;
  customerName: string;
  phone: string;
  issueType: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface Response {
  id: string;
  surveyId: string;
  siteId: string;
  companyId: string;
  npsScore?: number;
  likertScores?: Record<string, number>;
  comment?: string;
  createdAt: string;
  customerName?: string;
}

export interface SubscriptionLog {
  id: string;
  companyId: string;
  action: 'created' | 'renewed' | 'upgraded' | 'cancelled';
  plan: string;
  validFrom: string;
  validTo: string;
  createdAt: string;
  createdBy: string;
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

// Add mockSites data
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

// Add mockSurveyTemplates data
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

// Add mockQuestions data
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

// Add mockResponses data
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

// Add mockComplaints data
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

// Add mockSubscriptionLogs data
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
  }
];

// Add the actual CompanyManagement component
const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    plan: 'basic',
    isActive: true,
    logoUrl: '/placeholder.svg'
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setCompanies(mockCompanies);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddCompany = () => {
    // In a real application, this would be an API call
    const newCompanyWithId: Company = {
      ...newCompany as Company,
      id: `comp${companies.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planExpiresAt: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
      slug: newCompany.name?.toLowerCase().replace(/\s+/g, '-') || ''
    };
    
    setCompanies([...companies, newCompanyWithId]);
    setShowAddDialog(false);
    setNewCompany({
      name: '',
      plan: 'basic',
      isActive: true,
      logoUrl: '/placeholder.svg'
    });
    
    toast({
      title: "تم إضافة الشركة",
      description: `تمت إضافة ${newCompanyWithId.name} بنجاح.`
    });
  };
  
  const handleEditCompany = () => {
    // In a real application, this would be an API call
    if (!currentCompany) return;
    
    const updatedCompanies = companies.map(company => 
      company.id === currentCompany.id ? { ...currentCompany, updatedAt: new Date().toISOString() } : company
    );
    
    setCompanies(updatedCompanies);
    setShowEditDialog(false);
    setCurrentCompany(null);
    
    toast({
      title: "تم تحديث الشركة",
      description: `تم تحديث بيانات ${currentCompany.name} بنجاح.`
    });
  };
  
  const handleDeleteCompany = (id: string) => {
    // In a real application, this would be an API call
    const companyToDelete = companies.find(company => company.id === id);
    const updatedCompanies = companies.filter(company => company.id !== id);
    
    setCompanies(updatedCompanies);
    
    toast({
      title: "تم حذف الشركة",
      description: `تم حذف ${companyToDelete?.name} بنجاح.`
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="البحث عن الشركات..."
            className="pl-8 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> إضافة شركة
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشركة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الاشتراك</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">لا توجد شركات مطابقة للبحث</TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      {company.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">نشط</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {company.plan === 'premium' ? 'مميز' : 
                         company.plan === 'basic' ? 'أساسي' :
                         company.plan === 'enterprise' ? 'مؤسسات' : 'مجاني'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(company.planExpiresAt).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      {new Date(company.createdAt).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentCompany(company);
                            setShowEditDialog(true);
                          }}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCompany(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Company Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة شركة جديدة</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                اسم الشركة
              </Label>
              <Input
                id="name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                الاشتراك
              </Label>
              <Select 
                onValueChange={(value) => setNewCompany({ ...newCompany, plan: value })}
                defaultValue={newCompany.plan}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر نوع الاشتراك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">مجاني</SelectItem>
                  <SelectItem value="basic">أساسي</SelectItem>
                  <SelectItem value="premium">مميز</SelectItem>
                  <SelectItem value="enterprise">مؤسسات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                نشط
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isActive"
                  checked={newCompany.isActive}
                  onCheckedChange={(checked) => 
                    setNewCompany({ ...newCompany, isActive: checked === true })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddCompany}>
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Company Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الشركة</DialogTitle>
          </DialogHeader>
          {currentCompany && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  اسم الشركة
                </Label>
                <Input
                  id="edit-name"
                  value={currentCompany.name}
                  onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-plan" className="text-right">
                  الاشتراك
                </Label>
                <Select 
                  onValueChange={(value) => {
                    // Type assertion to ensure value is of correct type
                    const typedValue = value as "premium" | "basic" | "enterprise" | "free";
                    setCurrentCompany({ ...currentCompany, plan: typedValue });
                  }}
                  defaultValue={currentCompany.plan}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر نوع الاشتراك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">مجاني</SelectItem>
                    <SelectItem value="basic">أساسي</SelectItem>
                    <SelectItem value="premium">مميز</SelectItem>
                    <SelectItem value="enterprise">مؤسسات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  نشط
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-isActive"
                    checked={currentCompany.isActive}
                    onCheckedChange={(checked) => 
                      setCurrentCompany({ ...currentCompany, isActive: checked })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditCompany}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
