
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
import { useToast } from '@/components/ui/use-toast';

// Import types from the company.ts file instead of redefining them here
import {
  Company,
  mockCompanies as importedMockCompanies,
  UserRole,
  User,
  Organization,
  Site,
  SurveyTemplate,
  Question,
  Response,
  Complaint,
  ComplaintStatus,
  SubscriptionLog,
  mockUsers,
  mockOrganizations,
  mockSites,
  mockSurveyTemplates,
  mockQuestions,
  mockResponses,
  mockComplaints,
  mockSubscriptionLogs
} from '../../types/company';

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
      setCompanies(importedMockCompanies);
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
                onValueChange={(value) => {
                  // Ensure value is of the correct type
                  const planValue = value as 'free' | 'basic' | 'premium' | 'enterprise';
                  setNewCompany({ ...newCompany, plan: planValue });
                }}
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
                    // Ensure value is of the correct type
                    const planValue = value as 'free' | 'basic' | 'premium' | 'enterprise';
                    setCurrentCompany({ ...currentCompany, plan: planValue });
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
