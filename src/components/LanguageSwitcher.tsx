
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage} 
      className="flex items-center gap-2"
    >
      <Globe size={16} />
      {language === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
};

export default LanguageSwitcher;
