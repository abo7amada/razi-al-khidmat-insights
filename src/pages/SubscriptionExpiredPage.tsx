
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, ArrowRight, Home, FileText, BarChartBig, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SubscriptionExpiredPage = () => {
  const { userOrganization } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const handleRenewal = () => {
    // هذه مجرد واجهة للعرض حاليًا، لذا سنقوم بتوجيه المستخدم إلى الصفحة الرئيسية
    // في التطبيق الحقيقي، هنا سيتم التوجيه إلى صفحة الدفع
    navigate('/');
  };

  const blockedFeatures = [
    { name: language === 'ar' ? 'إنشاء استبيان' : 'Survey Creator', icon: FileText, path: '/survey-creator' },
    { name: language === 'ar' ? 'استبيان' : 'Survey', icon: FileText, path: '/survey' },
    { name: language === 'ar' ? 'التقارير' : 'Reports', icon: FileText, path: '/reports' },
    { name: language === 'ar' ? 'التحليلات' : 'Analytics', icon: BarChartBig, path: '/analytics' },
    { name: language === 'ar' ? 'الرؤى والتحليلات' : 'Insights', icon: TrendingUp, path: '/insights' }
  ];
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'انتهى اشتراكك' : 'Your Subscription has Expired'}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {language === 'ar' 
                  ? 'للأسف، انتهت صلاحية اشتراكك ولا يمكنك استخدام بعض ميزات النظام حتى تقوم بتجديد الاشتراك.'
                  : 'Unfortunately, your subscription has expired and you cannot use some system features until you renew your subscription.'}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{language === 'ar' ? 'الشركة:' : 'Company:'}</span>
                <span>{userOrganization?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{language === 'ar' ? 'الخطة:' : 'Plan:'}</span>
                <span>{userOrganization?.plan === 'free' ? (language === 'ar' ? 'مجاني' : 'Free') : 
                       userOrganization?.plan === 'basic' ? (language === 'ar' ? 'أساسي' : 'Basic') :
                       userOrganization?.plan === 'premium' ? (language === 'ar' ? 'متميز' : 'Premium') : 
                       (language === 'ar' ? 'مؤسسات' : 'Enterprise')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{language === 'ar' ? 'تاريخ الانتهاء:' : 'Expiry Date:'}</span>
                <span className="text-red-500">
                  {userOrganization?.planExpiresAt 
                    ? new Date(userOrganization.planExpiresAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') 
                    : (language === 'ar' ? 'غير متاح' : 'Not available')}
                </span>
              </div>
            </div>
            
            <div className="my-6">
              <h3 className="font-semibold text-lg mb-3">
                {language === 'ar' ? 'الميزات المحظورة:' : 'Blocked Features:'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {blockedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md bg-gray-50">
                    <feature.icon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <Button className="w-full" onClick={handleRenewal}>
                <CreditCard className="mr-2 h-4 w-4" /> 
                {language === 'ar' ? 'تجديد الاشتراك الآن' : 'Renew Subscription Now'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home Page'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionExpiredPage;
