
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Construction } from 'lucide-react';

const ComingSoonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: t('subscriptionSuccessful'),
      description: t('youWillBeNotified').replace('{email}', email),
    });
    
    setEmail('');
    setIsSubmitting(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-amber-100 rounded-full">
            <Construction className="h-20 w-20 text-amber-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          {t('featureComingSoon')}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          {t('stayTunedForUpdates')}
        </p>
        
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-medium mb-4">{t('getNotified')}</h3>
          
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Input
                type="email"
                placeholder={t('yourEmailAddress')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow"
              />
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('subscribing') : t('subscribe')}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('wellNotifyYou')}
            </p>
          </form>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 justify-center">
          <div className="bg-muted/50 p-4 rounded-md max-w-xs">
            <h3 className="text-lg font-medium mb-2">{t('whatToExpect')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('comingSoonFeatures')}
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md max-w-xs">
            <h3 className="text-lg font-medium mb-2">{t('haveIdeas')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('shareYourFeedback')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
