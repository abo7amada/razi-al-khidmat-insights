
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-amber-100 mb-4">
              <ShieldAlert className="h-12 w-12 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">غير مصرح</h1>
            <p className="text-gray-600 mt-2">
              عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button className="w-full" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" /> العودة للصفحة الرئيسية
            </Button>
            <Button variant="outline" className="w-full" onClick={logout}>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
