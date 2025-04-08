
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { Building, Phone, MapPin, Plus, Trash, PencilIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { mockSites, Site } from '../types/company';

const siteFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nameAr: z.string().min(2, {
    message: "Name (Arabic) must be at least 2 characters.",
  }),
  nameEn: z.string().min(2, {
    message: "Name (English) must be at least 2 characters.",
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
});

const SiteManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser, userOrganization } = useAuth();
  const [sites, setSites] = useState<Site[]>(() => {
    const companyId = currentUser?.organizationId;
    return companyId ? mockSites.filter(site => site.companyId === companyId) : [];
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const createForm = useForm<z.infer<typeof siteFormSchema>>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      nameEn: "",
      address: "",
      city: "",
      phone: "",
    },
  });

  const editForm = useForm<z.infer<typeof siteFormSchema>>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      nameEn: "",
      address: "",
      city: "",
      phone: "",
    },
  });

  const handleCreate = (values: z.infer<typeof siteFormSchema>) => {
    if (!currentUser?.organizationId) {
      toast({
        title: t('error'),
        description: t('noCompanyAssigned'),
        variant: "destructive",
      });
      return;
    }
    
    const newSite: Site = {
      id: `site${Date.now()}`,
      companyId: currentUser.organizationId,
      name: values.name,
      nameAr: values.nameAr,
      nameEn: values.nameEn,
      address: values.address,
      city: values.city,
      phone: values.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    setSites([...sites, newSite]);
    setIsCreateOpen(false);
    createForm.reset();
    
    toast({
      title: t('siteCreated'),
      description: language === 'ar' ? values.nameAr : values.nameEn,
    });
  };

  const handleEdit = (site: Site) => {
    setSelectedSite(site);
    editForm.reset({
      name: site.name,
      nameAr: site.nameAr || "",
      nameEn: site.nameEn || "",
      address: site.address || "",
      city: site.city || "",
      phone: site.phone || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = (values: z.infer<typeof siteFormSchema>) => {
    if (!selectedSite) return;
    
    const updatedSites = sites.map(site => {
      if (site.id === selectedSite.id) {
        return {
          ...site,
          name: values.name,
          nameAr: values.nameAr,
          nameEn: values.nameEn,
          address: values.address,
          city: values.city,
          phone: values.phone,
        };
      }
      return site;
    });
    
    setSites(updatedSites);
    setIsEditOpen(false);
    setSelectedSite(null);
    
    toast({
      title: t('siteUpdated'),
      description: language === 'ar' ? values.nameAr : values.nameEn,
    });
  };

  const handleDelete = (site: Site) => {
    setSelectedSite(site);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedSite) return;
    
    const newSites = sites.filter(site => site.id !== selectedSite.id);
    setSites(newSites);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: t('siteDeleted'),
      description: language === 'ar' ? selectedSite.nameAr : selectedSite.nameEn,
      variant: "destructive",
    });
    
    setSelectedSite(null);
  };

  const isSubscriptionActive = userOrganization?.active ?? false;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('siteManagement')}</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={!isSubscriptionActive}>
              <Plus className="mr-2 h-4 w-4" /> {t('addSite')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{t('createNewSite')}</DialogTitle>
              <DialogDescription>{t('enterSiteDetails')}</DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={createForm.control}
                    name="nameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nameAr')}</FormLabel>
                        <FormControl>
                          <Input {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nameEn')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('displayName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('displayNameDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={createForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('city')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phone')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">{t('create')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!isSubscriptionActive && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-yellow-700">
                {t('subscriptionRequiredForSites')}
              </p>
            </div>
          </div>
        </div>
      )}

      {sites.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">{t('noSites')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('getStartedByCreating')}</p>
          <div className="mt-6">
            <Button 
              onClick={() => setIsCreateOpen(true)}
              disabled={!isSubscriptionActive}
            >
              <Plus className="mr-2 h-4 w-4" /> {t('addSite')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5 text-primary" />
                  {language === 'ar' ? site.nameAr : site.nameEn}
                </CardTitle>
                {site.address && (
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> 
                    {site.address}{site.city ? `, ${site.city}` : ''}
                  </CardDescription>
                )}
              </CardHeader>
              {site.phone && (
                <CardContent className="pt-0 pb-2">
                  <p className="text-sm flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" /> 
                    {site.phone}
                  </p>
                </CardContent>
              )}
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(site)}
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  {t('edit')}
                </Button>
                <AlertDialog open={isDeleteDialogOpen && selectedSite?.id === site.id} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(site)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      {t('delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('siteDeleteConfirmation', {
                          name: language === 'ar' ? site.nameAr : site.nameEn 
                        })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete}>
                        {t('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t('editSite')}</DialogTitle>
            <DialogDescription>
              {selectedSite && (language === 'ar' ? selectedSite.nameAr : selectedSite.nameEn)}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={editForm.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('nameAr')}</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('nameEn')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('displayName')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('displayNameDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('city')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">{t('save')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteManagement;
