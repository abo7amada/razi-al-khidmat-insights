
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface TextElementProps {
  props: {
    content: string;
    fontSize: number;
    color: string;
    fontWeight: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const TextElement: React.FC<TextElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { content, fontSize, color, fontWeight, alignment } = props;

  if (!editMode) {
    return (
      <div 
        className={cn("w-full", {
          "text-left": alignment === 'left',
          "text-center": alignment === 'center',
          "text-right": alignment === 'right',
          "text-justify": alignment === 'justify',
        })}
        style={{ 
          fontSize: `${fontSize}px`, 
          color, 
          fontWeight 
        }}
        dangerouslySetInnerHTML={{ __html: content || t('textPlaceholder') }}
      />
    );
  }

  return (
    <div className="p-4">
      <div
        className={cn("w-full mb-4 p-2 border rounded-md", {
          "text-left": alignment === 'left',
          "text-center": alignment === 'center',
          "text-right": alignment === 'right',
          "text-justify": alignment === 'justify',
        })}
        style={{ 
          fontSize: `${fontSize}px`, 
          color, 
          fontWeight 
        }}
        dangerouslySetInnerHTML={{ __html: content || t('textPlaceholder') }}
      />
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="text-content">{t('content')}</Label>
          <Textarea 
            id="text-content" 
            value={content} 
            onChange={(e) => onUpdate({ content: e.target.value })} 
            placeholder={t('textPlaceholder')}
            rows={4}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="font-size">{t('fontSize')}</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="font-size" 
                type="number" 
                value={fontSize} 
                onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 14 })} 
              />
              <span>px</span>
            </div>
          </div>
          
          <div className="w-1/2">
            <Label htmlFor="text-color">{t('color')}</Label>
            <div className="flex gap-2">
              <Input 
                id="text-color" 
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

export default TextElement;
