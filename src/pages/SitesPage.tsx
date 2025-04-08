
import React from 'react';
import Layout from '../components/Layout';
import SiteManagement from '../components/SiteManagement';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useBranches } from '@/hooks/useBranches';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

const SitesPage = () => {
  const { t } = useLanguage();
  const { currentCompany, userOrganization } = useAuth();
  
  // Use either the currentCompany id or the userOrganization id
  const companyId = currentCompany?.id || userOrganization?.id;
  
  // Get branches data
  const { data: branches = [], isLoading } = useBranches(companyId || '');
  
  return (
    <Layout currentPage="sites">
      <Card>
        <CardHeader>
          <CardTitle>{t('sitesManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          {branches.length === 0 && !isLoading ? (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertTitle>{t('noSites') || 'لا توجد مواقع'}</AlertTitle>
              <AlertDescription>
                {t('noSitesDescription') || 'لم يتم العثور على أي مواقع لهذه الشركة. يمكنك إضافة موقع جديد باستخدام زر الإضافة.'}
              </AlertDescription>
            </Alert>
          ) : (
            <SiteManagement companyId={companyId} />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SitesPage;
