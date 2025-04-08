
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Building, Plus, Trash, Edit, Users, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mockCompanies, Company } from '../../types/company';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const companySchema = z.object({
  name: z.string().min(2, { message: 'الاسم مطلوب ويجب أن يكون أكثر من حرفين' }),
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صحيح' }),
  plan: z.enum(['free', 'basic', 'premium', 'enterprise'], { 
    required_error: 'الرجاء اختيار نوع الاشتراك' 
  }),
  isActive: z.boolean().default(true),
  planExpiresAt: z.date({ required_error: 'الرجاء تحديد تاريخ انتهاء الاشتراك' }),
});

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlanExpiry, setSelectedPlanExpiry] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // تحميل بيانات الشركات عند تهيئة المكون
  useEffect(() => {
    // استخدام البيانات التجريبية من mockCompanies
    setCompanies(mockCompanies);
  }, []);

  // نموذج إنشاء شركة جديدة
  const createForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      email: '',
      plan: 'basic',
      isActive: true,
    },
  });
  
  // نموذج تعديل شركة
  const editForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      email: '',
      plan: 'basic',
      isActive: true,
    },
  });
  
  // دالة إنشاء شركة جديدة
  const handleCreateCompany = (data: z.infer<typeof companySchema>) => {
    const newCompany: Company = {
      id: `comp${companies.length + 1}`,
      name: data.name,
      logoUrl: '/placeholder.svg',
      plan: data.plan,
      planExpiresAt: data.planExpiresAt.toISOString(),
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: data.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    setCompanies([...companies, newCompany]);
    setIsCreateDialogOpen(false);
    createForm.reset();
    
    toast({
      title: 'تم إنشاء الشركة بنجاح',
      description: `تم إضافة ${data.name} إلى النظام`,
    });
  };
  
  // دالة تعديل شركة
  const handleEditCompany = (data: z.infer<typeof companySchema>) => {
    if (!selectedCompany) return;
    
    const updatedCompanies = companies.map((company) => {
      if (company.id === selectedCompany.id) {
        return {
          ...company,
          name: data.name,
          plan: data.plan,
          planExpiresAt: data.planExpiresAt.toISOString(),
          isActive: data.isActive,
          updatedAt: new Date().toISOString(),
        };
      }
      return company;
    });
    
    setCompanies(updatedCompanies);
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
    
    toast({
      title: 'تم تعديل الشركة بنجاح',
      description: `تم تحديث بيانات ${data.name}`,
    });
  };
  
  // دالة حذف شركة
  const handleDeleteCompany = () => {
    if (!selectedCompany) return;
    
    const filteredCompanies = companies.filter(
      (company) => company.id !== selectedCompany.id
    );
    
    setCompanies(filteredCompanies);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: 'تم حذف الشركة بنجاح',
      description: `تم حذف ${selectedCompany.name} من النظام`,
      variant: 'destructive',
    });
    
    setSelectedCompany(null);
  };
  
  // دالة تجديد اشتراك شركة
  const handleRenewSubscription = (company: Company) => {
    const currentDate = new Date(company.planExpiresAt);
    const newExpiryDate = new Date(currentDate);
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    
    const updatedCompanies = companies.map((c) => {
      if (c.id === company.id) {
        return {
          ...c,
          planExpiresAt: newExpiryDate.toISOString(),
          isActive: true,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    
    setCompanies(updatedCompanies);
    
    toast({
      title: 'تم تجديد الاشتراك بنجاح',
      description: `تم تجديد اشتراك ${company.name} حتى ${format(newExpiryDate, 'yyyy/MM/dd')}`,
    });
  };
  
  // تحميل بيانات الشركة للتعديل
  const loadCompanyForEdit = (company: Company) => {
    setSelectedCompany(company);
    editForm.reset({
      name: company.name,
      email: '', // نحتاج إلى إضافة البريد الإلكتروني للشركة في النموذج المزيف
      plan: company.plan,
      isActive: company.isActive,
      planExpiresAt: new Date(company.planExpiresAt),
    });
    setSelectedPlanExpiry(new Date(company.planExpiresAt));
    setIsEditDialogOpen(true);
  };
  
  // دالة تنشيط/تعطيل شركة
  const toggleCompanyStatus = (company: Company) => {
    const updatedCompanies = companies.map((c) => {
      if (c.id === company.id) {
        return {
          ...c,
          isActive: !c.isActive,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    
    setCompanies(updatedCompanies);
    
    toast({
      title: company.isActive ? 'تم تعطيل الشركة' : 'تم تنشيط الشركة',
      description: `تم ${company.isActive ? 'تعطيل' : 'تنشيط'} ${company.name}`,
    });
  };
  
  // ترجمة نوع الخطة
  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'مجاني';
      case 'basic': return 'أساسي';
      case 'premium': return 'متميز';
      case 'enterprise': return 'مؤسسات';
      default: return plan;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الشركات</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              إضافة شركة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>إنشاء شركة جديدة</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الشركة الجديدة التي تريد إضافتها إلى النظام
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateCompany)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الشركة</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل اسم الشركة" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل البريد الإلكتروني للشركة" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الاشتراك</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الاشتراك" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">مجاني</SelectItem>
                          <SelectItem value="basic">أساسي</SelectItem>
                          <SelectItem value="premium">متميز</SelectItem>
                          <SelectItem value="enterprise">مؤسسات</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="planExpiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ انتهاء الاشتراك</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-right ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "yyyy/MM/dd")
                              ) : (
                                <span>اختر التاريخ</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none mr-2">
                        <FormLabel>نشط</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">إنشاء شركة</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {companies.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/10">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">لا توجد شركات حاليًا</h3>
          <p className="text-muted-foreground mb-4">قم بإضافة شركة جديدة للبدء</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة شركة جديدة
          </Button>
        </div>
      ) : (
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">اسم الشركة</TableHead>
              <TableHead>نوع الاشتراك</TableHead>
              <TableHead>تاريخ انتهاء الاشتراك</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="w-[150px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-primary" />
                    {company.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={company.plan === 'free' ? 'outline' : 'default'}>
                    {getPlanName(company.plan)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(company.planExpiresAt), 'yyyy/MM/dd')}
                </TableCell>
                <TableCell>
                  {company.isActive ? (
                    <Badge className="bg-green-600">نشط</Badge>
                  ) : (
                    <Badge variant="destructive">غير نشط</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadCompanyForEdit(company)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={company.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleCompanyStatus(company)}
                    >
                      {company.isActive ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRenewSubscription(company)}
                    >
                      تجديد
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* حوار تعديل الشركة */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>تعديل الشركة</DialogTitle>
            <DialogDescription>
              تعديل بيانات الشركة {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCompany)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الشركة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل اسم الشركة" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل البريد الإلكتروني للشركة" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الاشتراك</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الاشتراك" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">مجاني</SelectItem>
                        <SelectItem value="basic">أساسي</SelectItem>
                        <SelectItem value="premium">متميز</SelectItem>
                        <SelectItem value="enterprise">مؤسسات</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="planExpiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ انتهاء الاشتراك</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-right ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "yyyy/MM/dd")
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setSelectedPlanExpiry(date);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none mr-2">
                      <FormLabel>نشط</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* حوار تأكيد الحذف */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد حذف شركة {selectedCompany?.name}؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
