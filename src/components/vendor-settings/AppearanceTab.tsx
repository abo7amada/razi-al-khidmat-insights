
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AppearanceTab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('appearance')}</CardTitle>
        <CardDescription>
          {t('customizeAppearanceDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{t('appearanceSettingsAvailableSoon')}</p>
      </CardContent>
    </Card>
  );
};

export default AppearanceTab;
