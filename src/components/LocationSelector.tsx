
import React, { useState, useEffect } from 'react';
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

  const handleSelect = (locationId: string) => {
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
  };

  // Filter locations based on search query
  const filteredLocations = locations.filter(location => {
    if (!searchQuery) return true;
    const nameEn = location.nameEn.toLowerCase();
    const nameAr = location.nameAr.toLowerCase();
    const query = searchQuery.toLowerCase();
    return nameEn.includes(query) || nameAr.includes(query);
  });

  // Handle search query change with proper type safety
  const handleSearchChange = (value: string) => {
    setSearchQuery(value || "");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder={language === 'ar' ? 'بحث عن المواقع' : 'Search locations'}
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandEmpty>{language === 'ar' ? 'لا توجد مواقع' : 'No locations found.'}</CommandEmpty>
          <CommandGroup>
            {filteredLocations.map((location) => (
              <CommandItem
                key={location.id}
                value={location.id}
                onSelect={() => handleSelect(location.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected === location.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {language === 'ar' ? location.nameAr : location.nameEn}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
