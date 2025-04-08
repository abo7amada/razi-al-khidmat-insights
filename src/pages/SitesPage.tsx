
import React from 'react';
import Layout from '../components/Layout';
import SiteManagement from '../components/SiteManagement';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';

const SitesPage = () => {
  const { t } = useLanguage();
  const { currentCompany, userOrganization } = useAuth();
  
  // Use either the currentCompany id or the userOrganization id
  const companyId = currentCompany?.id || userOrganization?.id;
  
  return (
    <Layout currentPage="sites">
      <Card>
        <CardHeader>
          <CardTitle>{t('sitesManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteManagement companyId={companyId} />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SitesPage;
