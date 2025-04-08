
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Settings } from 'lucide-react';

const VendorSettings: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [organizationName, setOrganizationName] = useState('');
  const [isMultiVendor, setIsMultiVendor] = useState(false);

  const handleSaveSettings = () => {
    // Here you would save the settings to your backend
    toast({
      title: t('save'),
      description: t('vendorSettings') + ' ' + t('save'),
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

      <Tabs defaultValue="general">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('multiVendor')}</CardTitle>
              <CardDescription>
                Enable multi-vendor mode to allow multiple organizations to use this system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="multi-vendor" 
                  checked={isMultiVendor} 
                  onCheckedChange={setIsMultiVendor} 
                />
                <Label htmlFor="multi-vendor">{t('multiVendor')}</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-name">{t('organizationName')}</Label>
                <Input 
                  id="org-name" 
                  value={organizationName} 
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Enter your organization name"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">{t('cancel')}</Button>
              <Button onClick={handleSaveSettings}>{t('save')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks for your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Appearance settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Manage user permissions and access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Permissions settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSettings;
