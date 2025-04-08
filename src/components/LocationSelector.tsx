
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

interface LocationSelectorProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocationId?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelectLocation, selectedLocationId }) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(selectedLocationId);
  const [searchQuery, setSearchQuery] = useState("");

  // Update the selected location when the prop changes
  useEffect(() => {
    setSelected(selectedLocationId);
  }, [selectedLocationId]);

  const selectedLocation = locations.find(loc => loc.id === selected);
  const locationName = selectedLocation 
    ? (language === 'ar' ? selectedLocation.nameAr : selectedLocation.nameEn)
    : t('selectLocation');

  const handleSelect = useCallback((locationId: string) => {
    if (!locationId) return;
    
    setSelected(locationId);
    onSelectLocation(locationId);
    setOpen(false);
    
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      toast({
        title: t('locationSelected'),
        description: language === 'ar' ? location.nameAr : location.nameEn,
        duration: 3000,
      });
    }
  }, [language, onSelectLocation, t]);

  // Filter locations based on search query
  const filteredLocations = locations.filter(location => {
    if (!searchQuery) return true;
    const nameEn = location.nameEn.toLowerCase();
    const nameAr = location.nameAr.toLowerCase();
    const query = searchQuery.toLowerCase();
    return nameEn.includes(query) || nameAr.includes(query);
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
            {filteredLocations.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                {language === 'ar' ? 'لا توجد مواقع' : 'No locations found.'}
              </div>
            ) : (
              filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={cn(
                    "px-2 py-1.5 cursor-pointer flex items-center",
                    selected === location.id ? "bg-accent" : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(location.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === location.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language === 'ar' ? location.nameAr : location.nameEn}
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
