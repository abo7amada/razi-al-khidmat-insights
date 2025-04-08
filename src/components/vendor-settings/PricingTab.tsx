
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface PricingPlan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}

const PricingTab = ({ onSave }: { onSave: () => void }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      name: 'free',
      priceMonthly: 0,
      priceYearly: 0,
      features: ['استبيان واحد نشط', 'موقع واحد', 'تقارير أساسية']
    },
    {
      name: 'basic',
      priceMonthly: 99,
      priceYearly: 990,
      features: ['حتى 3 استبيانات نشطة', 'حتى 3 مواقع', 'تقارير متقدمة']
    },
    {
      name: 'premium',
      priceMonthly: 199,
      priceYearly: 1990,
      features: ['استبيانات غير محدودة', 'حتى 10 مواقع', 'تقارير متقدمة', 'تحليل المشاعر']
    },
    {
      name: 'enterprise',
      priceMonthly: 499,
      priceYearly: 4990,
      features: ['استبيانات غير محدودة', 'مواقع غير محدودة', 'جميع الميزات', 'دعم مخصص']
    }
  ]);
  
  const handlePriceChange = (index: number, field: 'priceMonthly' | 'priceYearly', value: string) => {
    const newPlans = [...plans];
    const numValue = parseFloat(value) || 0;
    newPlans[index][field] = numValue;
    setPlans(newPlans);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // في تطبيق حقيقي، هنا سيتم حفظ البيانات في قاعدة البيانات
    toast({
      title: t('pricingUpdated'),
      description: t('pricingPlansSaved'),
    });
    onSave();
  };
  
  const getPlanTitle = (planName: string) => {
    switch (planName) {
      case 'free': return 'مجاني';
      case 'basic': return 'أساسي';
      case 'premium': return 'مميز';
      case 'enterprise': return 'مؤسسات';
      default: return planName;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('pricingSettings')}</h3>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {t('saveChanges')}
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">
        {t('pricingDescription')}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, index) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{getPlanTitle(plan.name)}</CardTitle>
                <CardDescription>
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-center mt-1">
                      <span className="text-xs">• {feature}</span>
                    </div>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${plan.name}-monthly`}>{t('monthlyPrice')} (رس)</Label>
                    <Input
                      id={`${plan.name}-monthly`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={plan.priceMonthly}
                      onChange={(e) => handlePriceChange(index, 'priceMonthly', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${plan.name}-yearly`}>{t('yearlyPrice')} (رس)</Label>
                    <Input
                      id={`${plan.name}-yearly`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={plan.priceYearly}
                      onChange={(e) => handlePriceChange(index, 'priceYearly', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </form>
    </div>
  );
};

export default PricingTab;
