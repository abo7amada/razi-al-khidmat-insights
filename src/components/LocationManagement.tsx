
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
import { toast } from '@/hooks/use-toast';
import { MapPin, Plus, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { locations } from '../data/mockData';

// Definición del tipo de Location
interface Location {
  id: string;
  nameEn: string;
  nameAr: string;
}

const locationFormSchema = z.object({
  nameEn: z.string().min(2, {
    message: "Name (English) must be at least 2 characters.",
  }),
  nameAr: z.string().min(2, {
    message: "Name (Arabic) must be at least 2 characters.",
  }),
});

const LocationManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [locationsList, setLocationsList] = useState<Location[]>(locations);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof locationFormSchema>>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
    },
  });

  const onSubmit = (values: z.infer<typeof locationFormSchema>) => {
    const newLocation: Location = {
      id: `loc${locationsList.length + 1}`,
      nameEn: values.nameEn,
      nameAr: values.nameAr,
    };
    
    setLocationsList([...locationsList, newLocation]);
    setOpen(false);
    form.reset();
    
    toast({
      title: t('locationCreated'),
      description: language === 'ar' ? values.nameAr : values.nameEn,
      duration: 3000,
    });
  };

  const handleDelete = (locationId: string) => {
    setSelectedLocationId(locationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedLocationId) return;

    const newLocations = locationsList.filter(
      location => location.id !== selectedLocationId
    );
    
    setLocationsList(newLocations);
    setDeleteDialogOpen(false);
    
    const deletedLocation = locationsList.find(loc => loc.id === selectedLocationId);
    if (deletedLocation) {
      toast({
        title: t('locationDeleted'),
        description: language === 'ar' ? deletedLocation.nameAr : deletedLocation.nameEn,
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('locationManagement')}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t('addLocation')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('createNewLocation')}</DialogTitle>
              <DialogDescription>{t('enterLocationDetails')}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
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
                <DialogFooter className="pt-4">
                  <Button type="submit">{t('create')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locationsList.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {language === 'ar' ? location.nameAr : location.nameEn}
              </CardTitle>
              <CardDescription>
                {language !== 'ar' ? location.nameAr : location.nameEn}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AlertDialog open={deleteDialogOpen && selectedLocationId === location.id} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDelete(location.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" /> {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === 'ar' 
                        ? `هل أنت متأكد أنك تريد حذف ${location.nameAr}؟`
                        : `Are you sure you want to delete ${location.nameEn}?`
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocationManagement;
