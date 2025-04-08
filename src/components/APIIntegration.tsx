
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Code, Key, Copy, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const APIIntegration: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isWebhookEnabled, setIsWebhookEnabled] = useState(false);
  
  // Demo API key for the example
  const demoApiKey = "sk_test_51KvLMpF5Jd8wKzxC9LmvKsT7H";
  
  const handleGenerateNewKey = () => {
    toast({
      title: language === 'ar' ? 'تم إنشاء مفتاح API جديد' : 'New API key generated',
      description: language === 'ar' 
        ? 'تم إنشاء مفتاح API جديد بنجاح. تأكد من حفظه في مكان آمن.'
        : 'A new API key has been generated successfully. Make sure to save it in a secure place.',
    });
  };
  
  const handleCopyKey = () => {
    navigator.clipboard.writeText(demoApiKey);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied',
      description: language === 'ar' 
        ? 'تم نسخ مفتاح API إلى الحافظة'
        : 'API key copied to clipboard',
    });
  };
  
  const handleSaveWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'الرجاء إدخال رابط webhook صالح'
          : 'Please enter a valid webhook URL',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'ar' ? 'تم الحفظ' : 'Saved',
      description: language === 'ar' 
        ? 'تم حفظ إعدادات webhook بنجاح'
        : 'Webhook settings saved successfully',
    });
  };
  
  const handleWebhookToggle = (checked: boolean) => {
    setIsWebhookEnabled(checked);
    toast({
      title: checked 
        ? (language === 'ar' ? 'تم تفعيل Webhook' : 'Webhook Enabled') 
        : (language === 'ar' ? 'تم تعطيل Webhook' : 'Webhook Disabled'),
      description: checked
        ? (language === 'ar' ? 'سيتم إرسال الإشعارات إلى الرابط المحدد' : 'Notifications will be sent to the specified URL')
        : (language === 'ar' ? 'لن يتم إرسال الإشعارات' : 'Notifications will not be sent'),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'مفتاح API' : 'API Key'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'استخدم مفتاح API هذا للوصول إلى واجهة برمجة التطبيق الخاصة بنا'
              : 'Use this API key to access our application programming interface'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="apiKey">
                {language === 'ar' ? 'مفتاح API الخاص بك' : 'Your API Key'}
              </Label>
              <div className="flex">
                <Input
                  id="apiKey"
                  type={apiKeyVisible ? "text" : "password"}
                  value={demoApiKey}
                  readOnly
                  className="flex-1 font-mono"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="ml-2"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyKey}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button onClick={handleGenerateNewKey}>
              {language === 'ar' ? 'إنشاء مفتاح جديد' : 'Generate New Key'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'Webhook للإشعارات' : 'Webhook Notifications'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'قم بتكوين webhook لتلقي الإشعارات عندما يتم إكمال الاستطلاعات'
              : 'Configure a webhook to receive notifications when surveys are completed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook-toggle" className="flex flex-col space-y-1">
                <span>{language === 'ar' ? 'تفعيل webhook' : 'Enable webhook'}</span>
                <span className="font-normal text-xs text-muted-foreground">
                  {language === 'ar' 
                    ? 'سيتم إرسال إشعار عندما يتم إكمال استطلاع'
                    : 'A notification will be sent when a survey is completed'}
                </span>
              </Label>
              <Switch
                id="webhook-toggle"
                checked={isWebhookEnabled}
                onCheckedChange={handleWebhookToggle}
              />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="webhookUrl">
                {language === 'ar' ? 'رابط Webhook' : 'Webhook URL'}
              </Label>
              <Input
                id="webhookUrl"
                placeholder={language === 'ar' ? 'أدخل رابط webhook الخاص بك' : 'Enter your webhook URL'}
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                disabled={!isWebhookEnabled}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveWebhook}
            disabled={!isWebhookEnabled}
            className="w-full"
          >
            {language === 'ar' ? 'حفظ إعدادات Webhook' : 'Save Webhook Settings'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'وثائق API' : 'API Documentation'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'طريقة استخدام واجهة برمجة التطبيق الخاصة بنا'
              : 'How to use our application programming interface'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4 overflow-x-auto">
            <pre className="text-xs md:text-sm font-mono">
{`// ${language === 'ar' ? 'مثال على استخدام واجهة برمجة التطبيق' : 'Example API usage'}
fetch('https://api.example.com/surveys', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${demoApiKey}',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
            </pre>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex gap-2" onClick={() => {
              toast({
                title: language === 'ar' ? 'فتح التوثيق' : 'Opening Documentation',
                description: language === 'ar' 
                  ? 'جاري فتح التوثيق الكامل في نافذة جديدة'
                  : 'Opening full documentation in a new window',
              });
            }}>
              <Code className="h-4 w-4" />
              {language === 'ar' ? 'عرض التوثيق الكامل' : 'View Full Documentation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIIntegration;
