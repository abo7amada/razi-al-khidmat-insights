
import React, { useState } from 'react';
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

interface LocationSelectorProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocationId?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelectLocation, selectedLocationId }) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const locationName = selectedLocation 
    ? (language === 'ar' ? selectedLocation.nameAr : selectedLocation.nameEn)
    : t('selectLocation');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {locationName}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={t('selectLocation')} />
          <CommandEmpty>{language === 'ar' ? 'لا توجد مواقع' : 'No locations found.'}</CommandEmpty>
          <CommandGroup>
            {locations.map((location) => (
              <CommandItem
                key={location.id}
                onSelect={() => {
                  onSelectLocation(location.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLocationId === location.id ? "opacity-100" : "opacity-0"
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
