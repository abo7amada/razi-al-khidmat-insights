
import React from 'react';
import { SiteElement as SiteElementType, defaultElementProps } from '@/types/site-builder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Settings } from 'lucide-react';
import LogoElement from './elements/LogoElement';
import TextElement from './elements/TextElement';
import ImageElement from './elements/ImageElement';
import IconElement from './elements/IconElement';
import ContactElement from './elements/ContactElement';
import SurveyEmbedElement from './elements/SurveyEmbedElement';
import ButtonElement from './elements/ButtonElement';

interface SiteElementProps {
  element: SiteElementType;
  onUpdate: (props: Record<string, any>) => void;
  onDelete: () => void;
  editMode?: boolean;
}

const SiteElement: React.FC<SiteElementProps> = ({ 
  element, 
  onUpdate, 
  onDelete,
  editMode = true
}) => {
  const renderElement = () => {
    switch (element.type) {
      case 'Logo':
        return <LogoElement props={{...defaultElementProps.Logo, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      case 'Text':
        return <TextElement props={{...defaultElementProps.Text, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      case 'Image':
        return <ImageElement props={{...defaultElementProps.Image, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      case 'Icon':
        return <IconElement props={{...defaultElementProps.Icon, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      case 'Contact':
        return <ContactElement props={{...defaultElementProps.Contact, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      case 'SurveyEmbed':
        return <SurveyEmbedElement props={{...defaultElementProps.SurveyEmbed, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      case 'Button':
        return <ButtonElement props={{...defaultElementProps.Button, ...element.props}} onUpdate={onUpdate} editMode={editMode} />;
      default:
        return <div>Unknown element type: {element.type}</div>;
    }
  };

  if (!editMode) {
    return renderElement();
  }

  return (
    <Card className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="outline" size="icon" className="h-6 w-6">
          <Settings className="h-3 w-3" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <div className="p-3">
        {renderElement()}
      </div>
    </Card>
  );
};

export default SiteElement;
