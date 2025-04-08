
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface AuthenticationTabProps {
  onSaveCredentials: () => void;
}

const AuthenticationTab: React.FC<AuthenticationTabProps> = ({ onSaveCredentials }) => {
  const { t } = useLanguage();
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
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
        <Button onClick={onSaveCredentials}>
          <Save className="mr-2 h-4 w-4" />
          {t('saveCredentials')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthenticationTab;
