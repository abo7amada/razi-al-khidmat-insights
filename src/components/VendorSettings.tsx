
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Key, UserPlus, Lock, Save } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'شركة النور للتقنية',
    email: 'admin@alnoor-tech.com',
    active: true
  },
  {
    id: 'org2', 
    name: 'مؤسسة الأمل للخدمات',
    email: 'info@alamal.com',
    active: true
  },
  {
    id: 'org3',
    name: 'مستشفى الرحمة',
    email: 'contact@rahma-hospital.com',
    active: false
  }
];

const VendorSettings: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [organizationName, setOrganizationName] = useState('');
  const [organizationEmail, setOrganizationEmail] = useState('');
  const [isMultiVendor, setIsMultiVendor] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveSettings = () => {
    if (adminPassword && adminPassword !== confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: t('settingsSaved'),
      description: t('vendorSettingsSaved'),
    });
  };
  
  const handleAddOrganization = () => {
    if (!organizationName || !organizationEmail) {
      toast({
        title: t('error'),
        description: t('pleaseCompleteAllFields'),
        variant: 'destructive'
      });
      return;
    }
    
    const newOrg: Organization = {
      id: `org${organizations.length + 1}`,
      name: organizationName,
      email: organizationEmail,
      active: true
    };
    
    setOrganizations([...organizations, newOrg]);
    setOrganizationName('');
    setOrganizationEmail('');
    
    toast({
      title: t('success'),
      description: t('organizationAdded')
    });
  };
  
  const toggleOrganizationStatus = (id: string) => {
    setOrganizations(organizations.map(org => 
      org.id === id ? { ...org, active: !org.active } : org
    ));
  };
  
  const deleteOrganization = (id: string) => {
    setOrganizations(organizations.filter(org => org.id !== id));
    toast({
      title: t('success'),
      description: t('organizationDeleted')
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
          <Card>
            <CardHeader>
              <CardTitle>{t('manageOrganizations')}</CardTitle>
              <CardDescription>
                {t('addAndManageOrganizationsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">{t('organizationName')}</Label>
                  <Input 
                    id="org-name" 
                    value={organizationName} 
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder={language === 'ar' ? "اسم المؤسسة" : "Organization name"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">{t('email')}</Label>
                  <Input 
                    id="org-email" 
                    type="email"
                    value={organizationEmail} 
                    onChange={(e) => setOrganizationEmail(e.target.value)}
                    placeholder={language === 'ar' ? "البريد الإلكتروني للمؤسسة" : "Organization email"}
                  />
                </div>
              </div>
              <Button onClick={handleAddOrganization}>
                <UserPlus className="mr-2 h-4 w-4" />
                {t('addOrganization')}
              </Button>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">{t('organizationsList')}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('organizationName')}</TableHead>
                      <TableHead>{t('email')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead className="text-right">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch 
                              checked={org.active}
                              onCheckedChange={() => toggleOrganizationStatus(org.id)}
                              className="mr-2"
                            />
                            <span>{org.active ? t('active') : t('inactive')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteOrganization(org.id)}
                          >
                            {t('delete')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('multiVendor')}</CardTitle>
              <CardDescription>
                {t('enableMultiVendorDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch 
                  id="multi-vendor" 
                  checked={isMultiVendor} 
                  onCheckedChange={setIsMultiVendor} 
                />
                <Label htmlFor="multi-vendor">{t('multiVendor')}</Label>
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
              <CardTitle>{t('appearance')}</CardTitle>
              <CardDescription>
                {t('customizeAppearanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('appearanceSettingsAvailableSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="authentication" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('authentication')}</CardTitle>
              <CardDescription>
                {t('manageAdminCredentialsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">{t('adminUsername')}</Label>
                <Input 
                  id="admin-username" 
                  value={adminUsername} 
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">{t('newPassword')}</Label>
                <Input 
                  id="admin-password" 
                  type="password"
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                {t('saveCredentials')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSettings;
