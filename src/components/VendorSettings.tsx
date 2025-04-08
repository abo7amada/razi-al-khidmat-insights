
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Key, UserPlus, Lock, Save } from 'lucide-react';
import OrganizationsTab from './vendor-settings/OrganizationsTab';
import GeneralTab from './vendor-settings/GeneralTab';
import AppearanceTab from './vendor-settings/AppearanceTab';
import AuthenticationTab from './vendor-settings/AuthenticationTab';
import { mockOrganizations } from './vendor-settings/types';

const VendorSettings: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isMultiVendor, setIsMultiVendor] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: t('settingsSaved'),
      description: t('vendorSettingsSaved'),
    });
  };

  const handleSaveCredentials = () => {
    // Get values from the AuthenticationTab component via state lifting or context
    // For now, we'll just show a success message
    toast({
      title: t('settingsSaved'),
      description: t('credentialsSaved'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          <Settings className="inline-block mr-2" />
          {t('vendorSettings')}
        </h2>
      </div>

      <Tabs defaultValue="organizations">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="organizations">{t('organizations')}</TabsTrigger>
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
          <TabsTrigger value="authentication">{t('authentication')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizations" className="mt-4 space-y-4">
          <OrganizationsTab initialOrganizations={mockOrganizations} />
        </TabsContent>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <GeneralTab 
            isMultiVendor={isMultiVendor} 
            setIsMultiVendor={setIsMultiVendor} 
            onSave={handleSaveSettings} 
          />
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4">
          <AppearanceTab />
        </TabsContent>
        
        <TabsContent value="authentication" className="mt-4">
          <AuthenticationTab onSaveCredentials={handleSaveCredentials} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSettings;
