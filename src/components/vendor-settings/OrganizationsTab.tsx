
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

interface OrganizationsTabProps {
  initialOrganizations: Organization[];
}

const OrganizationsTab: React.FC<OrganizationsTabProps> = ({ initialOrganizations }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [organizationName, setOrganizationName] = useState('');
  const [organizationEmail, setOrganizationEmail] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);

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
  );
};

export default OrganizationsTab;
