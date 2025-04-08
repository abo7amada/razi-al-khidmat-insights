
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, User, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../../context/AuthContext';
import { User as UserType, mockUsers } from './types';
import { UserRole } from '../../types/company';

interface AuthenticationTabProps {
  onSaveCredentials: () => void;
}

const AuthenticationTab: React.FC<AuthenticationTabProps> = ({ onSaveCredentials }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [adminUsername, setAdminUsername] = useState('admin@system.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('company_admin');
  
  // تحقق مما إذا كان المستخدم هو مسؤول
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'company_admin';
  
  const handleSaveCredentials = () => {
    if (!adminPassword) {
      toast({
        title: t('error'),
        description: t('passwordRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    if (adminPassword !== confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        variant: 'destructive'
      });
      return;
    }
    
    // في الإنتاج، هنا يتم تحديث كلمة المرور في قاعدة البيانات
    
    toast({
      title: t('success'),
      description: t('credentialsUpdated')
    });
    
    setAdminPassword('');
    setConfirmPassword('');
    onSaveCredentials();
  };
  
  const handleAddUser = () => {
    if (!newUserEmail || !newUserPassword) {
      toast({
        title: t('error'),
        description: t('completeAllFields'),
        variant: 'destructive'
      });
      return;
    }
    
    if (users.some(user => user.email === newUserEmail)) {
      toast({
        title: t('error'),
        description: t('userAlreadyExists'),
        variant: 'destructive'
      });
      return;
    }
    
    const newUser: UserType = {
      id: `user${users.length + 1}`,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserPassword('');
    
    toast({
      title: t('success'),
      description: t('userAdded')
    });
  };
  
  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: t('success'),
      description: t('userDeleted')
    });
  };

  // إذا لم يكن مسؤولاً، فقط اعرض إمكانية تغيير كلمة المرور
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('authentication')}</CardTitle>
          <CardDescription>
            {t('changeYourPassword')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('currentPassword')}</Label>
            <Input 
              id="current-password" 
              type="password"
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
          <Button onClick={handleSaveCredentials}>
            <Save className="mr-2 h-4 w-4" />
            {t('saveCredentials')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('authentication')}</CardTitle>
        <CardDescription>
          {t('manageUsersAndCredentials')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="admin">
          <TabsList>
            <TabsTrigger value="admin">
              <User className="mr-2 h-4 w-4" />
              {t('adminSettings')}
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              {t('userManagement')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="space-y-4">
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
            
            <Button onClick={handleSaveCredentials}>
              <Save className="mr-2 h-4 w-4" />
              {t('saveCredentials')}
            </Button>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="new-user-email">{t('email')}</Label>
                <Input 
                  id="new-user-email" 
                  type="email"
                  value={newUserEmail} 
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-user-password">{t('password')}</Label>
                <Input 
                  id="new-user-password" 
                  type="password"
                  value={newUserPassword} 
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-user-role">{t('role')}</Label>
                <select 
                  id="new-user-role"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                >
                  <option value="company_admin">{t('admin')}</option>
                  <option value="editor">{t('editor')}</option>
                  <option value="viewer">{t('viewer')}</option>
                </select>
              </div>
            </div>
            
            <Button onClick={handleAddUser}>
              <User className="mr-2 h-4 w-4" />
              {t('addUser')}
            </Button>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">{t('usersList')}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('email')}</TableHead>
                    <TableHead>{t('role')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{t(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          {t('delete')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthenticationTab;
