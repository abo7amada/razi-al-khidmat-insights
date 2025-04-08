
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define pricing data type
interface PlanPricing {
  id: string;
  planType: 'free' | 'basic' | 'premium' | 'enterprise';
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number;
  maxSites: number;
  features: string[];
  isActive: boolean;
}

// Mock pricing data
const initialPricingData: PlanPricing[] = [
  {
    id: 'price1',
    planType: 'free',
    monthlyPrice: 0,
    annualPrice: 0,
    maxUsers: 2,
    maxSites: 1,
    features: ['استطلاع رأي بسيط', 'تقارير أساسية', 'فرع واحد'],
    isActive: true
  },
  {
    id: 'price2',
    planType: 'basic',
    monthlyPrice: 99,
    annualPrice: 990,
    maxUsers: 5,
    maxSites: 3,
    features: ['استطلاعات رأي متعددة', 'تقارير متقدمة', '3 فروع', 'دعم فني بالبريد الإلكتروني'],
    isActive: true
  },
  {
    id: 'price3',
    planType: 'premium',
    monthlyPrice: 199,
    annualPrice: 1990,
    maxUsers: 15,
    maxSites: 10,
    features: ['استطلاعات رأي غير محدودة', 'تقارير احترافية', '10 فروع', 'دعم فني على مدار الساعة', 'تخصيص كامل'],
    isActive: true
  },
  {
    id: 'price4',
    planType: 'enterprise',
    monthlyPrice: 499,
    annualPrice: 4990,
    maxUsers: -1,
    maxSites: -1,
    features: ['كل المميزات', 'فروع غير محدودة', 'مستخدمين غير محدودين', 'دعم فني مخصص', 'تدريب مخصص'],
    isActive: true
  }
];

const pricingSchema = z.object({
  planType: z.enum(['free', 'basic', 'premium', 'enterprise'], {
    required_error: 'الرجاء اختيار نوع الاشتراك'
  }),
  monthlyPrice: z.coerce.number().min(0, 'السعر الشهري يجب أن يكون 0 أو أكبر'),
  annualPrice: z.coerce.number().min(0, 'السعر السنوي يجب أن يكون 0 أو أكبر'),
  maxUsers: z.coerce.number().min(-1, 'أقصى عدد مستخدمين يجب أن يكون -1 (غير محدود) أو أكبر'),
  maxSites: z.coerce.number().min(-1, 'أقصى عدد فروع يجب أن يكون -1 (غير محدود) أو أكبر'),
  features: z.string().min(1, 'الرجاء إدخال المميزات مفصولة بفاصلة'),
  isActive: z.boolean().default(true)
});

const PricingManagement: React.FC = () => {
  const [pricingData, setPricingData] = useState<PlanPricing[]>(initialPricingData);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<PlanPricing | null>(null);
  const { toast } = useToast();

  const createForm = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      planType: 'basic',
      monthlyPrice: 0,
      annualPrice: 0,
      maxUsers: 1,
      maxSites: 1,
      features: '',
      isActive: true
    }
  });

  const editForm = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      planType: 'basic',
      monthlyPrice: 0,
      annualPrice: 0,
      maxUsers: 1,
      maxSites: 1,
      features: '',
      isActive: true
    }
  });

  const handleCreatePricing = (data: z.infer<typeof pricingSchema>) => {
    const newPricing: PlanPricing = {
      id: `price${pricingData.length + 1}`,
      planType: data.planType,
      monthlyPrice: data.monthlyPrice,
      annualPrice: data.annualPrice,
      maxUsers: data.maxUsers,
      maxSites: data.maxSites,
      features: data.features.split(',').map(item => item.trim()),
      isActive: data.isActive
    };

    setPricingData([...pricingData, newPricing]);
    setIsCreateDialogOpen(false);
    createForm.reset();

    toast({
      title: 'تم إضافة خطة الاشتراك بنجاح',
      description: `تم إضافة خطة ${getPlanName(data.planType)} إلى النظام`,
    });
  };

  const handleEditPricing = (data: z.infer<typeof pricingSchema>) => {
    if (!selectedPricing) return;

    const updatedPricingData = pricingData.map((pricing) => {
      if (pricing.id === selectedPricing.id) {
        return {
          ...pricing,
          planType: data.planType,
          monthlyPrice: data.monthlyPrice,
          annualPrice: data.annualPrice,
          maxUsers: data.maxUsers,
          maxSites: data.maxSites,
          features: data.features.split(',').map(item => item.trim()),
          isActive: data.isActive
        };
      }
      return pricing;
    });

    setPricingData(updatedPricingData);
    setIsEditDialogOpen(false);
    setSelectedPricing(null);

    toast({
      title: 'تم تعديل خطة الاشتراك بنجاح',
      description: `تم تحديث بيانات خطة ${getPlanName(data.planType)}`,
    });
  };

  const handleDeletePricing = () => {
    if (!selectedPricing) return;

    const filteredPricingData = pricingData.filter(
      (pricing) => pricing.id !== selectedPricing.id
    );

    setPricingData(filteredPricingData);
    setIsDeleteDialogOpen(false);

    toast({
      title: 'تم حذف خطة الاشتراك بنجاح',
      description: `تم حذف خطة ${getPlanName(selectedPricing.planType)} من النظام`,
      variant: 'destructive',
    });

    setSelectedPricing(null);
  };

  const loadPricingForEdit = (pricing: PlanPricing) => {
    setSelectedPricing(pricing);
    editForm.reset({
      planType: pricing.planType,
      monthlyPrice: pricing.monthlyPrice,
      annualPrice: pricing.annualPrice,
      maxUsers: pricing.maxUsers,
      maxSites: pricing.maxSites,
      features: pricing.features.join(', '),
      isActive: pricing.isActive
    });
    setIsEditDialogOpen(true);
  };

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
        <h2 className="text-2xl font-bold">إدارة أسعار الاشتراكات</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة خطة اشتراك
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>إضافة خطة اشتراك جديدة</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل خطة الاشتراك الجديدة
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreatePricing)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="planType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الخطة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الخطة" />
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
                  name="monthlyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر الشهري (ريال)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="annualPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر السنوي (ريال)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="maxUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>أقصى عدد مستخدمين</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="-1 = غير محدود" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="maxSites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>أقصى عدد فروع</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="-1 = غير محدود" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={createForm.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المميزات (مفصولة بفاصلة)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ميزة 1، ميزة 2، ميزة 3" />
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
                  <Button type="submit">إضافة خطة</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>نوع الخطة</TableHead>
            <TableHead>السعر الشهري</TableHead>
            <TableHead>السعر السنوي</TableHead>
            <TableHead>عدد المستخدمين</TableHead>
            <TableHead>عدد الفروع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="w-[150px]">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingData.map((pricing) => (
            <TableRow key={pricing.id}>
              <TableCell>
                <Badge variant={pricing.planType === 'free' ? 'outline' : 'default'}>
                  {getPlanName(pricing.planType)}
                </Badge>
              </TableCell>
              <TableCell>{pricing.monthlyPrice} ريال</TableCell>
              <TableCell>{pricing.annualPrice} ريال</TableCell>
              <TableCell>{pricing.maxUsers === -1 ? 'غير محدود' : pricing.maxUsers}</TableCell>
              <TableCell>{pricing.maxSites === -1 ? 'غير محدود' : pricing.maxSites}</TableCell>
              <TableCell>
                {pricing.isActive ? (
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
                    onClick={() => loadPricingForEdit(pricing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedPricing(pricing);
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

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>تعديل خطة الاشتراك</DialogTitle>
            <DialogDescription>
              تعديل بيانات خطة {selectedPricing && getPlanName(selectedPricing.planType)}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditPricing)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="planType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الخطة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الخطة" />
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
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر الشهري (ريال)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="annualPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر السنوي (ريال)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="maxUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>أقصى عدد مستخدمين</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="-1 = غير محدود" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="maxSites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>أقصى عدد فروع</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="-1 = غير محدود" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المميزات (مفصولة بفاصلة)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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

      {/* Delete Plan Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد حذف خطة {selectedPricing && getPlanName(selectedPricing.planType)}؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeletePricing}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingManagement;
