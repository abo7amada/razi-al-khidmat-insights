
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { t, language } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // إذا كان المستخدم مسجلاً بالفعل، قم بتوجيهه إلى الصفحة الرئيسية
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        // تم تسجيل الدخول بنجاح - يتم التوجيه في useEffect عند تغيير isAuthenticated
        toast({
          title: t('loginSuccess'),
          description: t('welcomeBack'),
        });
      } else {
        toast({
          title: t('loginFailed'),
          description: t('invalidCredentials'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t('error'),
        description: t('somethingWentWrong'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
            <CardDescription>
              {language === 'ar' ? 'أدخل بيانات الدخول الخاصة بك للوصول إلى لوحة التحكم' : 'Enter your credentials to access the dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder={language === 'ar' ? "البريد الإلكتروني" : "Email"}
                          dir={language === 'ar' ? "rtl" : "ltr"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder={language === 'ar' ? "كلمة المرور" : "Password"}
                          dir={language === 'ar' ? "rtl" : "ltr"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? (language === 'ar' ? 'جاري الدخول...' : 'Logging in...') : t('login')}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-center text-sm">
              <p>{language === 'ar' ? 'بيانات الدخول التجريبية:' : 'Demo credentials:'}</p>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'مدير النظام: admin@system.com / admin123' : 'Super Admin: admin@system.com / admin123'}
              </p>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'مدير شركة: admin@alnoor-tech.com / password123' : 'Company Admin: admin@alnoor-tech.com / password123'}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
