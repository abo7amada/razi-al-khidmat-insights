
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface GeneralTabProps {
  isMultiVendor: boolean;
  setIsMultiVendor: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ isMultiVendor, setIsMultiVendor, onSave }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('multiVendor')}</CardTitle>
        <CardDescription>
          {t('enableMultiVendorDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch 
            id="multi-vendor" 
            checked={isMultiVendor} 
            onCheckedChange={setIsMultiVendor} 
          />
          <Label htmlFor="multi-vendor">{t('multiVendor')}</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">{t('cancel')}</Button>
        <Button onClick={onSave}>{t('save')}</Button>
      </CardFooter>
    </Card>
  );
};

export default GeneralTab;
