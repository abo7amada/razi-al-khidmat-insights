
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  mockSurveyTemplates, 
  mockQuestions,
  mockSites,
  SurveyTemplate,
  Question 
} from '../types/company';
import NPSSurvey from '../components/survey/NPSSurvey';
import LikertSurvey from '../components/survey/LikertSurvey';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerSurveyPage = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get('id');
  const siteId = searchParams.get('site');
  
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<SurveyTemplate | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    // Simulate API call to fetch survey template
    setTimeout(() => {
      if (surveyId) {
        const foundTemplate = mockSurveyTemplates.find(t => t.id === surveyId);
        if (foundTemplate) {
          setTemplate(foundTemplate);
          
          // Fetch questions for this template
          const templateQuestions = mockQuestions.filter(q => q.templateId === foundTemplate.id);
          setQuestions(templateQuestions);
        }
      }
      setLoading(false);
    }, 1000);
  }, [surveyId]);
  
  const handleNPSSubmit = (data: { score: number; comment: string }) => {
    if (!template || !siteId) return;
    
    console.log('NPS Submission:', {
      surveyId: template.id,
      siteId,
      companyId: template.companyId,
      npsScore: data.score,
      comment: data.comment,
      createdAt: new Date().toISOString()
    });
    
    // Here you would submit to an API
  };
  
  const handleLikertSubmit = (data: { scores: Record<string, number>; comment: string }) => {
    if (!template || !siteId) return;
    
    console.log('Likert Submission:', {
      surveyId: template.id,
      siteId,
      companyId: template.companyId,
      likertScores: data.scores,
      comment: data.comment,
      createdAt: new Date().toISOString()
    });
    
    // Here you would submit to an API
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!template) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-xl font-bold text-red-500">
              {language === 'ar' ? 'الاستبيان غير موجود' : 'Survey Not Found'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === 'ar' 
                ? 'عذراً، الاستبيان المطلوب غير موجود أو تم حذفه.' 
                : 'Sorry, the requested survey does not exist or has been deleted.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Get site information if available
  const site = siteId ? mockSites.find(s => s.id === siteId) : null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      {site && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            {language === 'ar' ? site.nameAr : site.nameEn || site.name}
          </h2>
        </div>
      )}
      
      {template.type === 'NPS' && questions.length > 0 && (
        <NPSSurvey
          title={template.title}
          description={template.description}
          question={questions[0]}
          onSubmit={handleNPSSubmit}
        />
      )}
      
      {template.type === 'LIKERT' && questions.length > 0 && (
        <LikertSurvey
          title={template.title}
          description={template.description}
          questions={questions}
          onSubmit={handleLikertSubmit}
        />
      )}
    </div>
  );
};

export default CustomerSurveyPage;
