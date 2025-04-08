
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SubscriptionExpiredPage = () => {
  const { userOrganization } = useAuth();
  const navigate = useNavigate();
  
  const handleRenewal = () => {
    // هذه مجرد واجهة للعرض حاليًا، لذا سنقوم بتوجيه المستخدم إلى الصفحة الرئيسية
    // في التطبيق الحقيقي، هنا سيتم التوجيه إلى صفحة الدفع
    navigate('/');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">انتهى اشتراكك</h1>
            <p className="text-gray-600 mt-2">
              للأسف، انتهت صلاحية اشتراكك ولا يمكنك استخدام بعض ميزات النظام حتى تقوم بتجديد الاشتراك.
            </p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">الشركة:</span>
              <span>{userOrganization?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">الخطة:</span>
              <span>{userOrganization?.plan === 'free' ? 'مجاني' : 
                     userOrganization?.plan === 'basic' ? 'أساسي' :
                     userOrganization?.plan === 'premium' ? 'متميز' : 'مؤسسات'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">تاريخ الانتهاء:</span>
              <span className="text-red-500">
                {userOrganization?.planExpiresAt ? new Date(userOrganization.planExpiresAt).toLocaleDateString('ar-SA') : 'غير متاح'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button className="w-full" onClick={handleRenewal}>
              <CreditCard className="mr-2 h-4 w-4" /> تجديد الاشتراك الآن
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              العودة للصفحة الرئيسية <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredPage;
