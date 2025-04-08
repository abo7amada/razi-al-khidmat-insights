
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageElementProps {
  props: {
    url: string;
    altText: string;
    maxWidth: string;
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const ImageElement: React.FC<ImageElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { url, altText, maxWidth = '100%' } = props;

  if (!editMode) {
    return (
      <div className="flex justify-center">
        {url ? (
          <img 
            src={url} 
            alt={altText || 'Image'} 
            style={{ maxWidth }} 
          />
        ) : (
          <div className="p-8 bg-gray-100 rounded-md text-center text-gray-500">
            {t('imagePlaceholder')}
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
            alt={altText || 'Image'} 
            style={{ maxWidth }} 
            className="max-h-48 object-contain"
          />
        ) : (
          <div className="p-8 bg-gray-100 rounded-md text-center text-gray-500">
            {t('imagePlaceholder')}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="image-url">{t('imageUrl')}</Label>
          <div className="flex gap-2">
            <Input 
              id="image-url" 
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
          <Label htmlFor="image-alt">{t('altText')}</Label>
          <Input 
            id="image-alt" 
            value={altText} 
            onChange={(e) => onUpdate({ altText: e.target.value })} 
            placeholder={t('altTextPlaceholder')} 
          />
        </div>
        
        <div>
          <Label htmlFor="image-width">{t('maxWidth')}</Label>
          <Input 
            id="image-width" 
            value={maxWidth} 
            onChange={(e) => onUpdate({ maxWidth: e.target.value })} 
            placeholder="100%" 
          />
        </div>
      </div>
    </div>
  );
};

export default ImageElement;
