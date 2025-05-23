
import React from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useLanguage();
  const { canManageCompanies } = useAuth();
  
  return (
    <Layout currentPage="dashboard">
      {canManageCompanies && (
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/companies">
              <Building className="h-4 w-4 ml-2" />
              إدارة الشركات
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            يمكنك إدارة الشركات المشتركة والتحكم في اشتراكاتهم من خلال الضغط على زر إدارة الشركات
          </p>
        </div>
      )}
      <Dashboard />
    </Layout>
  );
};

export default Index;
