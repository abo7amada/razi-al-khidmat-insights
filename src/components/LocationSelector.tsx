
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { locations } from '../data/mockData';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { useBranches } from '@/hooks/useBranches';
import { Site } from '@/types/company';

interface LocationSelectorProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocationId?: string;
  companyId?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelectLocation, selectedLocationId, companyId }) => {
  const { t, language } = useLanguage();
  const { userOrganization } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(selectedLocationId);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get company branches/sites
  const effectiveCompanyId = companyId || userOrganization?.id || '';
  const { data: companySites = [] } = useBranches(effectiveCompanyId);
  
  // Update the selected location when the prop changes
  useEffect(() => {
    setSelected(selectedLocationId);
  }, [selectedLocationId]);

  // Find the selected site from company sites
  const selectedSite = companySites.find(site => site.id === selected);
  
  // Display name based on language and selected site
  const locationName = selectedSite 
    ? (language === 'ar' ? (selectedSite.nameAr || selectedSite.name) : (selectedSite.nameEn || selectedSite.name))
    : t('selectLocation');

  const handleSelect = useCallback((locationId: string) => {
    if (!locationId) return;
    
    setSelected(locationId);
    onSelectLocation(locationId);
    setOpen(false);
    
    const site = companySites.find(site => site.id === locationId);
    if (site) {
      toast({
        title: t('locationSelected'),
        description: language === 'ar' ? (site.nameAr || site.name) : (site.nameEn || site.name),
        duration: 3000,
      });
    }
  }, [language, onSelectLocation, t, companySites]);

  // Filter sites based on search query
  const filteredSites = companySites.filter(site => {
    if (!searchQuery) return true;
    const name = site.name.toLowerCase();
    const nameAr = (site.nameAr || '').toLowerCase();
    const nameEn = (site.nameEn || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || nameAr.includes(query) || nameEn.includes(query);
  });

  // Safe search query change handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value || "");
  }, []);

  return (
    <div className="w-full relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        {locationName}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          <div className="p-2">
            <input
              className="w-full p-2 border rounded-md mb-2"
              placeholder={language === 'ar' ? 'بحث عن المواقع' : 'Search locations'}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredSites.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                {language === 'ar' ? 'لا توجد فروع لهذه الشركة' : 'No branches found for this company'}
              </div>
            ) : (
              filteredSites.map((site) => (
                <div
                  key={site.id}
                  className={cn(
                    "px-2 py-1.5 cursor-pointer flex items-center",
                    selected === site.id ? "bg-accent" : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(site.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === site.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language === 'ar' ? (site.nameAr || site.name) : (site.nameEn || site.name)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
