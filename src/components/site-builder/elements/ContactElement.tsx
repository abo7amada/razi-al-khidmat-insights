
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

interface ContactElementProps {
  props: {
    phone: string;
    email: string;
    address: string;
    socials: {
      facebook: string;
      twitter: string;
      instagram: string;
    };
    showLabels: boolean;
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const ContactElement: React.FC<ContactElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { phone, email, address, socials, showLabels = true } = props;

  const updateSocial = (network: string, value: string) => {
    onUpdate({
      socials: {
        ...props.socials,
        [network]: value
      }
    });
  };

  if (!editMode) {
    return (
      <div className="space-y-2">
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" />
            {showLabels && <span className="font-medium">{t('phone')}:</span>}
            <span>{phone}</span>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            {showLabels && <span className="font-medium">{t('email')}:</span>}
            <span>{email}</span>
          </div>
        )}
        
        {address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {showLabels && <span className="font-medium">{t('address')}:</span>}
            <span>{address}</span>
          </div>
        )}
        
        {(socials?.facebook || socials?.twitter || socials?.instagram) && (
          <div className="flex items-center gap-3 mt-2">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4 mb-4">
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" />
            {showLabels && <span className="font-medium">{t('phone')}:</span>}
            <span>{phone}</span>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            {showLabels && <span className="font-medium">{t('email')}:</span>}
            <span>{email}</span>
          </div>
        )}
        
        {address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {showLabels && <span className="font-medium">{t('address')}:</span>}
            <span>{address}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="contact-phone">{t('phone')}</Label>
          <Input 
            id="contact-phone" 
            value={phone} 
            onChange={(e) => onUpdate({ phone: e.target.value })} 
            placeholder="+966 12 345 6789" 
          />
        </div>
        
        <div>
          <Label htmlFor="contact-email">{t('email')}</Label>
          <Input 
            id="contact-email" 
            value={email} 
            onChange={(e) => onUpdate({ email: e.target.value })} 
            placeholder="example@domain.com" 
          />
        </div>
        
        <div>
          <Label htmlFor="contact-address">{t('address')}</Label>
          <Input 
            id="contact-address" 
            value={address} 
            onChange={(e) => onUpdate({ address: e.target.value })} 
            placeholder={t('addressPlaceholder')} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>{t('socialMedia')}</Label>
          
          <div className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            <Input 
              value={socials?.facebook || ''} 
              onChange={(e) => updateSocial('facebook', e.target.value)} 
              placeholder="https://facebook.com/..." 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            <Input 
              value={socials?.twitter || ''} 
              onChange={(e) => updateSocial('twitter', e.target.value)} 
              placeholder="https://twitter.com/..." 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            <Input 
              value={socials?.instagram || ''} 
              onChange={(e) => updateSocial('instagram', e.target.value)} 
              placeholder="https://instagram.com/..." 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="show-labels">{t('showLabels')}</Label>
          <Switch 
            id="show-labels" 
            checked={showLabels} 
            onCheckedChange={(checked) => onUpdate({ showLabels: checked })} 
          />
        </div>
      </div>
    </div>
  );
};

export default ContactElement;
