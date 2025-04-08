
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Site, mockSites } from '../types/company';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  MoreVertical,
  CheckCircle, 
  XCircle,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBranches } from '@/hooks/useBranches';

interface SiteManagementProps {
  companyId?: string;
  showAddDialog?: boolean;
  setShowAddDialog?: (show: boolean) => void;
}

const SiteManagement: React.FC<SiteManagementProps> = ({ companyId, showAddDialog = false, setShowAddDialog }) => {
  const { t, language } = useLanguage();
  const { userOrganization } = useAuth();
  const { toast } = useToast();
  const { data: branchSites = [] } = useBranches(companyId || userOrganization?.id || '');
  
  const [sites, setSites] = useState<Site[]>(mockSites.filter(site => site.companyId === (companyId || userOrganization?.id)));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(showAddDialog);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSite, setNewSite] = useState<Partial<Site>>({
    name: '',
    nameAr: '',
    nameEn: '',
    address: '',
    city: '',
    phone: '',
    isActive: true
  });

  useEffect(() => {
    if (showAddDialog) {
      setIsAddDialogOpen(true);
    }
  }, [showAddDialog]);

  useEffect(() => {
    if (setShowAddDialog && !isAddDialogOpen) {
      setShowAddDialog(false);
    }
  }, [isAddDialogOpen, setShowAddDialog]);

  // Filter sites based on search term
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSite = () => {
    const effectiveCompanyId = companyId || userOrganization?.id;
    
    if (!effectiveCompanyId) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'لا يمكن إضافة فرع. المؤسسة غير محددة.' : 'Cannot add site. Organization not specified.',
        variant: 'destructive'
      });
      return;
    }

    // Validate required fields
    if (!newSite.name) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'اسم الفرع مطلوب.' : 'Site name is required.',
        variant: 'destructive'
      });
      return;
    }
    
    // Create new site
    const createdSite: Site = {
      id: `site${sites.length + 1}`,
      companyId: effectiveCompanyId,
      name: newSite.name,
      nameAr: newSite.nameAr,
      nameEn: newSite.nameEn,
      address: newSite.address,
      city: newSite.city,
      phone: newSite.phone,
      isActive: newSite.isActive || true,
      createdAt: new Date().toISOString()
    };
    
    // Add to sites list
    setSites([...sites, createdSite]);
    
    // Reset form and close dialog
    setNewSite({
      name: '',
      nameAr: '',
      nameEn: '',
      address: '',
      city: '',
      phone: '',
      isActive: true
    });
    setIsAddDialogOpen(false);
    
    // Show success message
    toast({
      title: language === 'ar' ? 'تمت الإضافة' : 'Site Added',
      description: language === 'ar' ? 'تم إضافة الفرع بنجاح.' : 'Site has been added successfully.',
    });
  };

  const handleEditSite = () => {
    if (!currentSite) return;
    
    // Update the site in the list
    const updatedSites = sites.map(site => 
      site.id === currentSite.id ? currentSite : site
    );
    
    setSites(updatedSites);
    setIsEditDialogOpen(false);
    
    // Show success message
    toast({
      title: language === 'ar' ? 'تم التعديل' : 'Site Updated',
      description: language === 'ar' ? 'تم تعديل الفرع بنجاح.' : 'Site has been updated successfully.',
    });
  };

  const handleDeleteSite = () => {
    if (!currentSite) return;
    
    // Remove the site from the list
    const updatedSites = sites.filter(site => site.id !== currentSite.id);
    
    setSites(updatedSites);
    setIsDeleteDialogOpen(false);
    
    // Show success message
    toast({
      title: language === 'ar' ? 'تم الحذف' : 'Site Deleted',
      description: language === 'ar' ? 'تم حذف الفرع بنجاح.' : 'Site has been deleted successfully.',
      variant: 'destructive'
    });
  };

  const handleToggleSiteStatus = (site: Site) => {
    // Update the site status in the list
    const updatedSites = sites.map(s => 
      s.id === site.id ? { ...s, isActive: !s.isActive } : s
    );
    
    setSites(updatedSites);
    
    // Show success message
    toast({
      title: site.isActive 
        ? (language === 'ar' ? 'تم تعطيل الفرع' : 'Site Disabled')
        : (language === 'ar' ? 'تم تفعيل الفرع' : 'Site Enabled'),
      description: site.isActive 
        ? (language === 'ar' ? 'تم تعطيل الفرع بنجاح.' : 'Site has been disabled successfully.')
        : (language === 'ar' ? 'تم تفعيل الفرع بنجاح.' : 'Site has been enabled successfully.'),
    });
  };

  const openEditDialog = (site: Site) => {
    setCurrentSite({ ...site });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (site: Site) => {
    setCurrentSite(site);
    setIsDeleteDialogOpen(true);
  };

  // Check if subscription is active to allow adding sites
  const canAddSites = userOrganization?.active ?? false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Add Site Button */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!canAddSites}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'إضافة فرع جديد' : 'Add New Site'}
        </Button>
      </div>

      {/* Sites Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'ar' ? 'اسم الفرع' : 'Site Name'}</TableHead>
              <TableHead>{language === 'ar' ? 'المدينة' : 'City'}</TableHead>
              <TableHead>{language === 'ar' ? 'العنوان' : 'Address'}</TableHead>
              <TableHead>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</TableHead>
              <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? (language === 'ar' ? 'لا توجد فروع مطابقة لبحثك' : 'No sites match your search')
                    : (language === 'ar' ? 'لا توجد فروع حالياً' : 'No sites available')
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.city || '-'}</TableCell>
                  <TableCell>{site.address || '-'}</TableCell>
                  <TableCell>{site.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={site.isActive ? 'outline' : 'secondary'}>
                      {site.isActive 
                        ? (language === 'ar' ? 'مفعل' : 'Active') 
                        : (language === 'ar' ? 'معطل' : 'Inactive')
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(site)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleSiteStatus(site)}>
                          {site.isActive ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              {language === 'ar' ? 'تعطيل' : 'Disable'}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {language === 'ar' ? 'تفعيل' : 'Enable'}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(site)}
                          className="text-red-600 hover:text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'حذف' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Site Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'إضافة فرع جديد' : 'Add New Site'}</DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'أدخل تفاصيل الفرع الجديد أدناه.'
                : 'Enter the details for the new site below.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium">
                {language === 'ar' ? 'اسم الفرع *' : 'Site Name *'}
              </label>
              <Input
                id="siteName"
                value={newSite.name}
                onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                placeholder={language === 'ar' ? 'أدخل اسم الفرع' : 'Enter site name'}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="siteNameAr" className="text-sm font-medium">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
                </label>
                <Input
                  id="siteNameAr"
                  value={newSite.nameAr || ''}
                  onChange={(e) => setNewSite({...newSite, nameAr: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل الاسم بالعربية' : 'Enter Arabic name'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="siteNameEn" className="text-sm font-medium">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
                </label>
                <Input
                  id="siteNameEn"
                  value={newSite.nameEn || ''}
                  onChange={(e) => setNewSite({...newSite, nameEn: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل الاسم بالإنجليزية' : 'Enter English name'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                {language === 'ar' ? 'المدينة' : 'City'}
              </label>
              <Input
                id="city"
                value={newSite.city || ''}
                onChange={(e) => setNewSite({...newSite, city: e.target.value})}
                placeholder={language === 'ar' ? 'أدخل اسم المدينة' : 'Enter city name'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                {language === 'ar' ? 'العنوان' : 'Address'}
              </label>
              <Input
                id="address"
                value={newSite.address || ''}
                onChange={(e) => setNewSite({...newSite, address: e.target.value})}
                placeholder={language === 'ar' ? 'أدخل العنوان' : 'Enter address'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <Input
                id="phone"
                value={newSite.phone || ''}
                onChange={(e) => setNewSite({...newSite, phone: e.target.value})}
                placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleAddSite}>
              {language === 'ar' ? 'إضافة' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Site Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'تعديل الفرع' : 'Edit Site'}</DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'قم بتعديل تفاصيل الفرع أدناه.'
                : 'Modify the site details below.'
              }
            </DialogDescription>
          </DialogHeader>
          {currentSite && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="editSiteName" className="text-sm font-medium">
                  {language === 'ar' ? 'اسم الفرع *' : 'Site Name *'}
                </label>
                <Input
                  id="editSiteName"
                  value={currentSite.name}
                  onChange={(e) => setCurrentSite({...currentSite, name: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل اسم الفرع' : 'Enter site name'}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="editSiteNameAr" className="text-sm font-medium">
                    {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
                  </label>
                  <Input
                    id="editSiteNameAr"
                    value={currentSite.nameAr || ''}
                    onChange={(e) => setCurrentSite({...currentSite, nameAr: e.target.value})}
                    placeholder={language === 'ar' ? 'أدخل الاسم بالعربية' : 'Enter Arabic name'}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="editSiteNameEn" className="text-sm font-medium">
                    {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
                  </label>
                  <Input
                    id="editSiteNameEn"
                    value={currentSite.nameEn || ''}
                    onChange={(e) => setCurrentSite({...currentSite, nameEn: e.target.value})}
                    placeholder={language === 'ar' ? 'أدخل الاسم بالإنجليزية' : 'Enter English name'}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="editCity" className="text-sm font-medium">
                  {language === 'ar' ? 'المدينة' : 'City'}
                </label>
                <Input
                  id="editCity"
                  value={currentSite.city || ''}
                  onChange={(e) => setCurrentSite({...currentSite, city: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل اسم المدينة' : 'Enter city name'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editAddress" className="text-sm font-medium">
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </label>
                <Input
                  id="editAddress"
                  value={currentSite.address || ''}
                  onChange={(e) => setCurrentSite({...currentSite, address: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل العنوان' : 'Enter address'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editPhone" className="text-sm font-medium">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <Input
                  id="editPhone"
                  value={currentSite.phone || ''}
                  onChange={(e) => setCurrentSite({...currentSite, phone: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleEditSite}>
              {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Site Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {language === 'ar' ? 'تأكيد حذف الفرع' : 'Confirm Site Deletion'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'هل أنت متأكد من أنك تريد حذف هذا الفرع؟ هذا الإجراء لا يمكن التراجع عنه.'
                : 'Are you sure you want to delete this site? This action cannot be undone.'
              }
            </DialogDescription>
          </DialogHeader>
          {currentSite && (
            <div className="py-4 border-t border-b">
              <h4 className="font-medium mb-2">
                {language === 'ar' ? 'معلومات الفرع:' : 'Site Information:'}
              </h4>
              <p><strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong> {currentSite.name}</p>
              {currentSite.city && (
                <p><strong>{language === 'ar' ? 'المدينة:' : 'City:'}</strong> {currentSite.city}</p>
              )}
              {currentSite.address && (
                <p><strong>{language === 'ar' ? 'العنوان:' : 'Address:'}</strong> {currentSite.address}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSite}
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteManagement;
