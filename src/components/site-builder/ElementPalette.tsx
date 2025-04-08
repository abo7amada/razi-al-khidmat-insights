
import React from 'react';
import { useDrag } from 'react-dnd';
import { ElementType } from '@/types/site-builder';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Image, 
  Type, 
  Square, 
  FileText, 
  Phone,
  FileQuestion, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ElementPaletteProps {
  onAddElement?: (type: ElementType) => void;
}

const ElementItem = ({ type, label, icon: Icon }: { type: ElementType; label: string; icon: React.ElementType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Button variant="outline" className="w-full flex justify-start gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </div>
  );
};

const ElementPalette: React.FC<ElementPaletteProps> = ({ onAddElement }) => {
  const { t } = useLanguage();
  
  const elements = [
    { type: 'Logo' as ElementType, label: t('logo'), icon: Square },
    { type: 'Text' as ElementType, label: t('text'), icon: Type },
    { type: 'Image' as ElementType, label: t('image'), icon: Image },
    { type: 'Icon' as ElementType, label: t('icon'), icon: FileText },
    { type: 'Contact' as ElementType, label: t('contactInfo'), icon: Phone },
    { type: 'SurveyEmbed' as ElementType, label: t('surveyEmbed'), icon: FileQuestion },
    { type: 'Button' as ElementType, label: t('button'), icon: ArrowRight },
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">{t('elements')}</h3>
        
        <div className="space-y-2">
          {elements.map((element) => (
            <ElementItem 
              key={element.type}
              type={element.type}
              label={element.label}
              icon={element.icon}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementPalette;
