
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LocationSelector from './LocationSelector';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const RatingScale: React.FC<{
  name: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ name, value, onChange }) => {
  const { t } = useLanguage();
  
  return (
    <RadioGroup
      value={value.toString()}
      onValueChange={(val) => onChange(parseInt(val))}
      className="flex space-x-2 rtl:space-x-reverse"
    >
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex flex-col items-center gap-1">
          <RadioGroupItem value={rating.toString()} id={`${name}-${rating}`} />
          <Label htmlFor={`${name}-${rating}`} className="text-xs">
            {rating === 5 && t('excellent')}
            {rating === 4 && t('good')}
            {rating === 3 && t('average')}
            {rating === 2 && t('poor')}
            {rating === 1 && t('veryPoor')}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

const SurveyForm: React.FC = () => {
  const { t, language } = useLanguage();
  const [locationId, setLocationId] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    serviceQuality: 3,
    staffBehavior: 3,
    waitingTime: 3,
    facilities: 3,
    comments: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationId) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'الرجاء اختيار موقع الخدمة' 
          : 'Please select a service location',
        variant: 'destructive'
      });
      return;
    }
    
    // In a real application, we would submit to an API here
    console.log('Form submitted:', { locationId, ...formData });
    
    // Show success message
    toast({
      title: t('thankYou'),
      description: language === 'ar' 
        ? 'تم استلام تقييمك بنجاح' 
        : 'Your feedback has been received successfully',
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-primary">{t('thankYou')}</CardTitle>
          <CardDescription className="text-center">
            {language === 'ar' 
              ? 'نشكرك على وقتك وتقييمك. رأيك يساعدنا في تحسين خدماتنا.'
              : 'Thank you for your time and feedback. Your opinion helps us improve our services.'}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={() => {
              setSubmitted(false);
              setFormData({
                serviceQuality: 3,
                staffBehavior: 3,
                waitingTime: 3,
                facilities: 3,
                comments: '',
              });
              setLocationId('');
            }}
            className="w-full"
          >
            {language === 'ar' ? 'تقييم جديد' : 'New Survey'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary">{t('yourFeedback')}</CardTitle>
        <CardDescription className="text-center">
          {language === 'ar' 
            ? 'يرجى تقييم تجربتك معنا اليوم'
            : 'Please rate your experience with us today'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t('selectLocation')}</Label>
            <LocationSelector 
              onSelectLocation={setLocationId} 
              selectedLocationId={locationId} 
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('serviceQuality')}</Label>
              <RatingScale 
                name="serviceQuality" 
                value={formData.serviceQuality} 
                onChange={(value) => setFormData({...formData, serviceQuality: value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('staffBehavior')}</Label>
              <RatingScale 
                name="staffBehavior" 
                value={formData.staffBehavior} 
                onChange={(value) => setFormData({...formData, staffBehavior: value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('waitingTime')}</Label>
              <RatingScale 
                name="waitingTime" 
                value={formData.waitingTime} 
                onChange={(value) => setFormData({...formData, waitingTime: value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('facilities')}</Label>
              <RatingScale 
                name="facilities" 
                value={formData.facilities} 
                onChange={(value) => setFormData({...formData, facilities: value})} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t('comments')}</Label>
            <Textarea 
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              placeholder={language === 'ar' ? 'أضف تعليقاتك هنا (اختياري)' : 'Add your comments here (optional)'}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">{t('submit')}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SurveyForm;
