
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { User, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { locations } from '../data/mockData';

// Mock user data
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  locationId: string;
  active: boolean;
}

const mockUsers: UserData[] = [
  {
    id: 'user1',
    name: 'محمد أحمد',
    email: 'mohammed@example.com',
    role: 'admin',
    locationId: 'hq1',
    active: true,
  },
  {
    id: 'user2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    role: 'user',
    locationId: 'h1',
    active: true,
  },
  {
    id: 'user3',
    name: 'خالد محمود',
    email: 'khalid@example.com',
    role: 'manager',
    locationId: 'h2',
    active: false,
  },
];

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "user", "manager"], {
    required_error: "Please select a role.",
  }),
  locationId: z.string({
    required_error: "Please select a location.",
  }),
});

const UserManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      locationId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof userFormSchema>) => {
    const newUser: UserData = {
      id: `user${users.length + 1}`,
      name: values.name,
      email: values.email,
      role: values.role as 'admin' | 'user' | 'manager',
      locationId: values.locationId,
      active: true,
    };
    
    setUsers([...users, newUser]);
    setOpen(false);
    form.reset();
    
    toast({
      title: t('userCreated'),
      description: t('userCreatedDesc'),
      duration: 3000,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.active ? t('userDeactivated') : t('userActivated'),
        description: `${user.name} ${user.active ? t('isNowDeactivated') : t('isNowActivated')}`,
        duration: 3000,
      });
    }
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? (language === 'ar' ? location.nameAr : location.nameEn) : '';
  };

  const getRoleTranslation = (role: string) => {
    switch(role) {
      case 'admin':
        return language === 'ar' ? 'مدير' : 'Admin';
      case 'user':
        return language === 'ar' ? 'مستخدم' : 'User';
      case 'manager':
        return language === 'ar' ? 'مشرف' : 'Manager';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('userManagement')}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <User className="mr-2 h-4 w-4" /> {t('addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('createNewUser')}</DialogTitle>
              <DialogDescription>{t('enterUserDetails')}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('role')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectRole')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">{t('admin')}</SelectItem>
                          <SelectItem value="manager">{t('manager')}</SelectItem>
                          <SelectItem value="user">{t('user')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('location')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectLocation')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {language === 'ar' ? location.nameAr : location.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit">{t('create')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className={user.active ? '' : 'opacity-70'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {user.name}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t('role')}:</span>
                  <span>{getRoleTranslation(user.role)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocationName(user.locationId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t('status')}:</span>
                  <span className={user.active ? 'text-green-600' : 'text-red-600'}>
                    {user.active ? t('active') : t('inactive')}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={user.active ? "destructive" : "default"} 
                size="sm" 
                className="w-full"
                onClick={() => toggleUserStatus(user.id)}
              >
                {user.active ? t('deactivate') : t('activate')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
