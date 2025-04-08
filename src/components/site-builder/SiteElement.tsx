
import React from 'react';
import { SiteElement as SiteElementType, defaultElementProps, ElementType } from '@/types/site-builder';
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
        return <LogoElement 
          props={{
            url: element.props.url || defaultElementProps.Logo.url,
            maxWidth: element.props.maxWidth || defaultElementProps.Logo.maxWidth,
            altText: element.props.altText || defaultElementProps.Logo.altText
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
      case 'Text':
        return <TextElement 
          props={{
            content: element.props.content || defaultElementProps.Text.content,
            fontSize: element.props.fontSize || defaultElementProps.Text.fontSize,
            color: element.props.color || defaultElementProps.Text.color,
            fontWeight: element.props.fontWeight || defaultElementProps.Text.fontWeight,
            alignment: element.props.alignment || defaultElementProps.Text.alignment
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
      case 'Image':
        return <ImageElement 
          props={{
            url: element.props.url || defaultElementProps.Image.url,
            altText: element.props.altText || defaultElementProps.Image.altText,
            maxWidth: element.props.maxWidth || defaultElementProps.Image.maxWidth
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
      case 'Icon':
        return <IconElement 
          props={{
            name: element.props.name || defaultElementProps.Icon.name,
            size: element.props.size || defaultElementProps.Icon.size,
            color: element.props.color || defaultElementProps.Icon.color
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
      case 'Contact':
        return <ContactElement 
          props={{
            phone: element.props.phone || defaultElementProps.Contact.phone,
            email: element.props.email || defaultElementProps.Contact.email,
            address: element.props.address || defaultElementProps.Contact.address,
            socials: {
              facebook: element.props.socials?.facebook || defaultElementProps.Contact.socials.facebook,
              twitter: element.props.socials?.twitter || defaultElementProps.Contact.socials.twitter,
              instagram: element.props.socials?.instagram || defaultElementProps.Contact.socials.instagram,
            },
            showLabels: element.props.showLabels !== undefined ? element.props.showLabels : defaultElementProps.Contact.showLabels
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
      case 'SurveyEmbed':
        return <SurveyEmbedElement 
          props={{
            surveyId: element.props.surveyId || defaultElementProps.SurveyEmbed.surveyId,
            buttonText: element.props.buttonText || defaultElementProps.SurveyEmbed.buttonText,
            buttonStyle: element.props.buttonStyle || defaultElementProps.SurveyEmbed.buttonStyle
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
      case 'Button':
        return <ButtonElement 
          props={{
            label: element.props.label || defaultElementProps.Button.label,
            url: element.props.url || defaultElementProps.Button.url,
            style: element.props.style || defaultElementProps.Button.style,
            size: element.props.size || defaultElementProps.Button.size
          }}
          onUpdate={onUpdate} 
          editMode={editMode}
        />;
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
