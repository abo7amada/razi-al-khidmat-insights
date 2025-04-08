
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Check, Mail, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SurveyShareButtonProps {
  surveyId: string;
}

const SurveyShareButton: React.FC<SurveyShareButtonProps> = ({ surveyId }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const surveyUrl = `${window.location.origin}/survey/${surveyId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      toast({
        title: t('copied'),
        description: surveyUrl,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  };

  const handleShareVia = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(t('shareSurvey'))}&body=${encodeURIComponent(surveyUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(surveyUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(t('shareSurvey'))}&url=${encodeURIComponent(surveyUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(surveyUrl)}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleCopyLink}
      >
        {copied ? <Check size={16} /> : <Share size={16} />}
        <span>{copied ? t('copied') : t('shareSurvey')}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {t('shareVia')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleShareVia('email')}>
            <Mail className="mr-2 h-4 w-4" />
            <span>{t('email')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareVia('whatsapp')}>
            <span className="mr-2">📱</span>
            <span>{t('whatsapp')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareVia('twitter')}>
            <Twitter className="mr-2 h-4 w-4" />
            <span>{t('twitter')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareVia('facebook')}>
            <Facebook className="mr-2 h-4 w-4" />
            <span>{t('facebook')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SurveyShareButton;
