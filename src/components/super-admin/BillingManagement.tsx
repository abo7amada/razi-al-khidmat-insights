
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, CreditCard, DollarSign, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { mockCompanies } from '../../types/company';
import { mockSubscriptionLogs, SubscriptionLog } from '../../types/company';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BillingManagement = () => {
  const [logs, setLogs] = useState<SubscriptionLog[]>(mockSubscriptionLogs);
  const { toast } = useToast();

  // بيانات الرسم البياني للشركات وعدد استبياناتها
  const companyStats = [
    { name: 'شركة النور للتقنية', surveys: 25, active: 18 },
    { name: 'مؤسسة الأمل للخدمات', surveys: 15, active: 10 },
    { name: 'مستشفى الرحمة', surveys: 8, active: 2 },
  ];

  // تحويل تواريخ السجلات إلى تنسيق مقروء
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ar });
  };

  // ترجمة نوع الإجراء
  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created': return 'إنشاء اشتراك';
      case 'renewed': return 'تجديد اشتراك';
      case 'cancelled': return 'إلغاء اشتراك';
      case 'upgraded': return 'ترقية اشتراك';
      case 'downgraded': return 'تخفيض اشتراك';
      default: return action;
    }
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

  // الحصول على اسم الشركة من الID
  const getCompanyName = (companyId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company ? company.name : 'غير معروفة';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              إجمالي الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25,500 ريال</div>
            <p className="text-xs text-muted-foreground">+12% عن الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              الاشتراكات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 اشتراكات جديدة هذا الشهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              اشتراكات تنتهي خلال 30 يومًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">تحتاج إلى متابعة للتجديد</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>نشاط الاستبيانات</CardTitle>
          <CardDescription>عدد الاستبيانات النشطة والإجمالية لكل شركة</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={companyStats}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar name="إجمالي الاستبيانات" dataKey="surveys" fill="#8884d8" />
              <Bar name="استبيانات نشطة" dataKey="active" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">سجل عمليات الاشتراكات</h2>
      <div className="flex justify-end mb-4">
        <Button variant="outline" className="ml-2">
          <Filter className="h-4 w-4 mr-2" />
          تصفية
        </Button>
      </div>

      <Table className="border rounded">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">الشركة</TableHead>
            <TableHead>الإجراء</TableHead>
            <TableHead>الخطة</TableHead>
            <TableHead>تاريخ البدء</TableHead>
            <TableHead>تاريخ الانتهاء</TableHead>
            <TableHead>بواسطة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{getCompanyName(log.companyId)}</TableCell>
              <TableCell>
                <Badge 
                  variant={log.action === 'cancelled' ? 'destructive' : 'default'}
                  className={log.action === 'created' || log.action === 'renewed' ? 'bg-green-600' : ''}
                >
                  {getActionLabel(log.action)}
                </Badge>
              </TableCell>
              <TableCell>{getPlanName(log.plan)}</TableCell>
              <TableCell>{formatDate(log.validFrom)}</TableCell>
              <TableCell>{formatDate(log.validTo)}</TableCell>
              <TableCell>مدير النظام</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BillingManagement;
