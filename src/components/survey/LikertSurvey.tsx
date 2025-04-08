
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Question } from '@/types/company';
import { useLanguage } from '@/context/LanguageContext';

interface LikertSurveyProps {
  title: string;
  description: string;
  questions: Question[];
  onSubmit?: (data: { scores: Record<string, number>; comment: string }) => void;
}

const LikertSurvey: React.FC<LikertSurveyProps> = ({
  title,
  description,
  questions,
  onSubmit
}) => {
  const { language } = useLanguage();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleRatingClick = (questionId: string, rating: number) => {
    setScores({
      ...scores,
      [questionId]: rating
    });
  };
  
  const handleSubmit = () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !scores[q.id]);
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: language === 'ar' ? 'لم تكتمل الإجابات' : 'Incomplete Responses',
        description: language === 'ar' 
          ? 'الرجاء الإجابة على جميع الأسئلة' 
          : 'Please answer all questions',
        variant: 'destructive'
      });
      return;
    }
    
    if (onSubmit) {
      onSubmit({ scores, comment });
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
  
  const getLikertLabels = () => {
    if (language === 'ar') {
      return [
        'غير راضٍ تماماً',
        'غير راضٍ',
        'محايد',
        'راضٍ',
        'راضٍ جداً'
      ];
    } else {
      return [
        'Very Dissatisfied',
        'Dissatisfied',
        'Neutral',
        'Satisfied',
        'Very Satisfied'
      ];
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="mb-6">
            <h3 className="text-lg font-medium mb-3">
              {language === 'ar' ? question.textAr : question.textEn}
            </h3>
            
            <div className="grid grid-cols-5 gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div 
                  key={rating} 
                  className={`flex flex-col items-center cursor-pointer`}
                  onClick={() => handleRatingClick(question.id, rating)}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-all
                    ${scores[question.id] === rating 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 hover:border-primary'
                    }
                  `}>
                    {rating}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {getLikertLabels().map((label, i) => (
                <span key={i} className={`text-center ${i === 0 ? 'text-left' : i === 4 ? 'text-right' : ''}`}>
                  {i === 0 || i === 2 || i === 4 ? label : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
        
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
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          {language === 'ar' ? 'إرسال التقييم' : 'Submit Feedback'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LikertSurvey;
