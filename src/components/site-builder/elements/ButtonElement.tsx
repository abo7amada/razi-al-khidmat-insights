
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonElementProps {
  props: {
    label: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'small' | 'medium' | 'large';
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const ButtonElement: React.FC<ButtonElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { label, url, style, size } = props;

  const getButtonVariant = () => {
    switch (style) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'outline': return 'outline';
      case 'ghost': return 'ghost';
      default: return 'default';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return 'sm';
      case 'medium': return 'default';
      case 'large': return 'lg';
      default: return 'default';
    }
  };

  if (!editMode) {
    return (
      <div className="flex justify-center">
        <Button
          variant={getButtonVariant()}
          size={getButtonSize()}
          className="flex items-center"
          asChild
        >
          <a href={url || '#'} target="_blank" rel="noopener noreferrer">
            {label || t('buttonPlaceholder')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        <Button
          variant={getButtonVariant()}
          size={getButtonSize()}
          className="flex items-center"
        >
          {label || t('buttonPlaceholder')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="button-label">{t('label')}</Label>
          <Input 
            id="button-label" 
            value={label} 
            onChange={(e) => onUpdate({ label: e.target.value })} 
            placeholder={t('buttonPlaceholder')} 
          />
        </div>
        
        <div>
          <Label htmlFor="button-url">{t('url')}</Label>
          <Input 
            id="button-url" 
            value={url} 
            onChange={(e) => onUpdate({ url: e.target.value })} 
            placeholder="https://..." 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="button-style">{t('style')}</Label>
            <Select 
              value={style} 
              onValueChange={(value) => onUpdate({ style: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('style')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">{t('primary')}</SelectItem>
                <SelectItem value="secondary">{t('secondary')}</SelectItem>
                <SelectItem value="outline">{t('outline')}</SelectItem>
                <SelectItem value="ghost">{t('ghost')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="button-size">{t('size')}</Label>
            <Select 
              value={size} 
              onValueChange={(value) => onUpdate({ size: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('size')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t('small')}</SelectItem>
                <SelectItem value="medium">{t('medium')}</SelectItem>
                <SelectItem value="large">{t('large')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonElement;
