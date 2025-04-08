
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Question } from '@/types/company';
import { useLanguage } from '@/context/LanguageContext';

interface NPSSurveyProps {
  title: string;
  description: string;
  question: Question;
  onSubmit?: (data: { score: number; comment: string }) => void;
}

const NPSSurvey: React.FC<NPSSurveyProps> = ({ 
  title, 
  description, 
  question,
  onSubmit 
}) => {
  const { language } = useLanguage();
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const getScoreLabel = () => {
    if (score >= 9) {
      return language === 'ar' ? 'مروج' : 'Promoter';
    } else if (score >= 7) {
      return language === 'ar' ? 'محايد' : 'Passive';
    } else {
      return language === 'ar' ? 'منتقد' : 'Detractor';
    }
  };
  
  const getScoreLabelColor = () => {
    if (score >= 9) {
      return 'text-green-500';
    } else if (score >= 7) {
      return 'text-yellow-500';
    } else {
      return 'text-red-500';
    }
  };
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ score, comment });
    }
    
    setSubmitted(true);
    
    toast({
      title: language === 'ar' ? 'شكراً لك!' : 'Thank you!',
      description: language === 'ar' 
        ? 'تم استلام تقييمك بنجاح' 
        : 'Your feedback has been submitted successfully',
    });
  };
  
  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {language === 'ar' ? 'شكراً لك!' : 'Thank you!'}
          </CardTitle>
          <CardDescription className="text-center">
            {language === 'ar' 
              ? 'تم استلام تقييمك بنجاح' 
              : 'Your feedback has been submitted successfully'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button onClick={() => setSubmitted(false)}>
            {language === 'ar' ? 'العودة' : 'Back'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {language === 'ar' ? question.textAr : question.textEn}
          </h3>
          
          <div className="mb-8">
            <Slider 
              value={[score]} 
              min={0} 
              max={10} 
              step={1}
              onValueChange={(values) => setScore(values[0])}
            />
            
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <span key={num}>{num}</span>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                {language === 'ar' ? 'غير محتمل إطلاقاً' : 'Not at all likely'}
              </span>
              <span className="text-sm text-muted-foreground">
                {language === 'ar' ? 'محتمل جداً' : 'Extremely likely'}
              </span>
            </div>
            
            <div className="mt-4 text-center">
              <span className={`text-lg font-medium ${getScoreLabelColor()}`}>
                {score} - {getScoreLabel()}
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium mb-2">
              {language === 'ar' ? 'أي تعليقات إضافية؟' : 'Any additional comments?'}
            </h3>
            <Textarea
              placeholder={language === 'ar' ? 'اكتب تعليقك هنا...' : 'Type your comment here...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          {language === 'ar' ? 'إرسال التقييم' : 'Submit Feedback'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NPSSurvey;
