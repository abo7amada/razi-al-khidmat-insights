
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LogoElementProps {
  props: {
    url: string;
    maxWidth: number;
    altText: string;
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const LogoElement: React.FC<LogoElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { url, maxWidth, altText } = props;
  
  if (!editMode) {
    return (
      <div className="flex justify-center">
        {url ? (
          <img 
            src={url} 
            alt={altText || 'Company Logo'} 
            style={{ maxWidth: `${maxWidth}px` }} 
          />
        ) : (
          <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
            {t('logoPlaceholder')}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        {url ? (
          <img 
            src={url} 
            alt={altText || 'Company Logo'} 
            style={{ maxWidth: `${maxWidth}px` }} 
          />
        ) : (
          <div className="p-8 bg-gray-100 rounded-md text-center text-gray-500">
            {t('logoPlaceholder')}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="logo-url">{t('logoUrl')}</Label>
          <div className="flex gap-2">
            <Input 
              id="logo-url" 
              value={url} 
              onChange={(e) => onUpdate({ url: e.target.value })} 
              placeholder="https://..." 
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="logo-alt">{t('altText')}</Label>
          <Input 
            id="logo-alt" 
            value={altText} 
            onChange={(e) => onUpdate({ altText: e.target.value })} 
            placeholder={t('altTextPlaceholder')} 
          />
        </div>
        
        <div>
          <Label htmlFor="logo-width">{t('maxWidth')}</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="logo-width" 
              type="number" 
              value={maxWidth} 
              onChange={(e) => onUpdate({ maxWidth: parseInt(e.target.value) || 0 })} 
            />
            <span>px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoElement;
