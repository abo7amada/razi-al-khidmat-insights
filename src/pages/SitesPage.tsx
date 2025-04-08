
import React, { useState } from 'react';
import Layout from '../components/Layout';
import SiteManagement from '../components/SiteManagement';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useBranches } from '@/hooks/useBranches';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const SitesPage = () => {
  const { t, language } = useLanguage();
  const { currentCompany, userOrganization, isSuperAdmin } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // إذا كان المستخدم هو السوبر أدمن، قم بإعادة توجيهه إلى الصفحة الرئيسية
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // Use either the currentCompany id or the userOrganization id
  const companyId = currentCompany?.id || userOrganization?.id;
  
  // Get branches data
  const { data: branches = [], isLoading } = useBranches(companyId || '');
  
  const handleAddSite = () => {
    setShowAddDialog(true);
  };
  
  return (
    <Layout currentPage="sites">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('sitesManagement')}</CardTitle>
          {branches.length === 0 && !isLoading && (
            <Button onClick={handleAddSite}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'إضافة موقع جديد' : 'Add New Site'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {branches.length === 0 && !isLoading ? (
            <div className="space-y-4">
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertTitle>{t('noSites') || 'لا توجد مواقع'}</AlertTitle>
                <AlertDescription>
                  {t('noSitesDescription') || 'لم يتم العثور على أي مواقع لهذه الشركة. يمكنك إضافة موقع جديد باستخدام زر الإضافة.'}
                </AlertDescription>
              </Alert>
              <div className="flex justify-center mt-4">
                <Button onClick={handleAddSite}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إضافة موقع جديد' : 'Add New Site'}
                </Button>
              </div>
            </div>
          ) : (
            <SiteManagement companyId={companyId} showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SitesPage;
