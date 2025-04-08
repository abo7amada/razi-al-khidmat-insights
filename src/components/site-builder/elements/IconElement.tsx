
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import * as LucideIcons from 'lucide-react';

interface IconElementProps {
  props: {
    name: string;
    size: number;
    color: string;
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const IconElement: React.FC<IconElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { name = 'Heart', size = 24, color = '#000000' } = props;

  // Get all Lucide icons
  const iconNames = Object.keys(LucideIcons).filter(
    key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
  );

  // Render the selected icon
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ size: number; color: string }>;

  if (!editMode) {
    return (
      <div className="flex justify-center">
        {IconComponent ? (
          <IconComponent size={size} color={color} />
        ) : (
          <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
            {t('iconPlaceholder')}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        {IconComponent ? (
          <IconComponent size={size} color={color} />
        ) : (
          <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
            {t('iconPlaceholder')}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="icon-name">{t('iconName')}</Label>
          <Select 
            value={name} 
            onValueChange={(value) => onUpdate({ name: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectIcon')} />
            </SelectTrigger>
            <SelectContent>
              {iconNames.map(iconName => (
                <SelectItem key={iconName} value={iconName}>
                  {iconName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="icon-size">{t('size')}</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="icon-size" 
                type="number" 
                value={size} 
                onChange={(e) => onUpdate({ size: parseInt(e.target.value) || 24 })} 
              />
              <span>px</span>
            </div>
          </div>
          
          <div className="w-1/2">
            <Label htmlFor="icon-color">{t('color')}</Label>
            <div className="flex gap-2">
              <Input 
                id="icon-color" 
                type="color" 
                value={color} 
                onChange={(e) => onUpdate({ color: e.target.value })} 
                className="w-12 p-1"
              />
              <Input 
                type="text" 
                value={color} 
                onChange={(e) => onUpdate({ color: e.target.value })} 
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconElement;
