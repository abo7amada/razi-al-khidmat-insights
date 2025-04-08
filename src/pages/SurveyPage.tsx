
import React, { useState } from 'react';
import Layout from '../components/Layout';
import SurveyList from '../components/SurveyList';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, PlusCircle, FileText, BarChart } from 'lucide-react';

// مثال على بيانات استبيان واقعية
const exampleSurveys = [
  {
    id: '1',
    title: 'استبيان رضا العملاء',
    titleEn: 'Customer Satisfaction Survey',
    status: 'active',
    responses: 342,
    createdDate: '2025-03-15',
    lastUpdated: '2025-04-01',
    type: 'nps',
  },
  {
    id: '2',
    title: 'تقييم خدمة العملاء',
    titleEn: 'Customer Service Evaluation',
    status: 'active',
    responses: 189,
    createdDate: '2025-03-20',
    lastUpdated: '2025-03-28',
    type: 'likert',
  },
  {
    id: '3',
    title: 'استبيان ما بعد الشراء',
    titleEn: 'Post-Purchase Survey',
    status: 'inactive',
    responses: 78,
    createdDate: '2025-02-10',
    lastUpdated: '2025-03-05',
    type: 'nps',
  },
];

const SurveyPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('my-surveys');
  const [selectedSurvey, setSelectedSurvey] = useState(exampleSurveys[0]);
  
  const handleCreateNew = () => {
    navigate('/survey-creator');
  };
  
  const handleEdit = (surveyId: string) => {
    navigate(`/survey-creator?edit=${surveyId}`);
  };
  
  const handleViewResponses = (surveyId: string) => {
    navigate(`/reports?survey=${surveyId}`);
  };

  const handlePreviewSurvey = (survey: any) => {
    setSelectedSurvey(survey);
    setActiveTab('preview');
  };
  
  return (
    <Layout currentPage="survey">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h1 className="text-2xl font-bold">{language === 'ar' ? 'الاستبيانات' : 'Surveys'}</h1>
          <Button onClick={handleCreateNew} className="shrink-0">
            <PlusCircle className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'إنشاء استبيان جديد' : 'Create New Survey'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'الاستبيانات' : 'Surveys'}</CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'إدارة الاستبيانات وجمع الملاحظات من العملاء والمستفيدين'
                : 'Manage surveys and collect feedback from customers and beneficiaries'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="my-surveys">{t('mySurveys')}</TabsTrigger>
                <TabsTrigger value="preview">{t('preview')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-surveys" className="mt-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4">
                      {exampleSurveys.map((survey) => (
                        <div key={survey.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                          <div className="space-y-1 mb-4 md:mb-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {language === 'ar' ? survey.title : survey.titleEn}
                              </h3>
                              <Badge variant={survey.status === 'active' ? 'default' : 'secondary'}>
                                {survey.status === 'active' 
                                  ? (language === 'ar' ? 'نشط' : 'Active')
                                  : (language === 'ar' ? 'غير نشط' : 'Inactive')
                                }
                              </Badge>
                              <Badge variant="outline">
                                {survey.type === 'nps' ? 'NPS' : (language === 'ar' ? 'ليكرت' : 'Likert')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {language === 'ar' ? `${survey.responses} إجابة` : `${survey.responses} responses`}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {language === 'ar' ? `آخر تحديث: ${survey.lastUpdated}` : `Last updated: ${survey.lastUpdated}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" size="sm" onClick={() => handlePreviewSurvey(survey)}>
                              {language === 'ar' ? 'معاينة' : 'Preview'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(survey.id)}>
                              {language === 'ar' ? 'تعديل' : 'Edit'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewResponses(survey.id)}>
                              <BarChart className="h-4 w-4 mr-1" />
                              {language === 'ar' ? 'التحليلات' : 'Analytics'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'ar' ? `معاينة: ${selectedSurvey?.title}` : `Preview: ${selectedSurvey?.titleEn}`}
                    </CardTitle>
                    <CardDescription>
                      {language === 'ar' 
                        ? 'معاينة الاستبيان كما سيراه المستخدمون'
                        : 'Preview the survey as users would see it'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-md p-4 border rounded-md">
                        <h3 className="text-xl font-bold text-center mb-6">
                          {language === 'ar' ? selectedSurvey?.title : selectedSurvey?.titleEn}
                        </h3>
                        
                        {selectedSurvey?.type === 'nps' ? (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <p className="font-medium text-center">
                                {language === 'ar' 
                                  ? 'ما مدى احتمالية أن توصي بخدماتنا لصديق أو زميل؟'
                                  : 'How likely are you to recommend our services to a friend or colleague?'
                                }
                              </p>
                              <div className="flex justify-between mt-4">
                                {Array.from({ length: 11 }).map((_, i) => (
                                  <button key={i} className="w-8 h-8 rounded-full border hover:bg-primary hover:text-white focus:ring">
                                    {i}
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                                <span>{language === 'ar' ? 'غير محتمل على الإطلاق' : 'Not at all likely'}</span>
                                <span>{language === 'ar' ? 'محتمل للغاية' : 'Extremely likely'}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="font-medium">
                                {language === 'ar' ? 'ما هو سبب تقييمك؟' : 'What is the reason for your rating?'}
                              </label>
                              <textarea 
                                className="w-full h-24 border rounded-md p-2 resize-none" 
                                placeholder={language === 'ar' ? 'أدخل تعليقك هنا...' : 'Enter your comment here...'}
                              />
                            </div>
                            
                            <Button className="w-full">
                              {language === 'ar' ? 'إرسال' : 'Submit'}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="font-medium">
                                  {language === 'ar' 
                                    ? 'كيف تقيم جودة الخدمة المقدمة؟'
                                    : 'How would you rate the quality of service provided?'
                                  }
                                </p>
                                <div className="flex justify-between mt-2">
                                  {['1', '2', '3', '4', '5'].map((rating) => (
                                    <button key={rating} className="w-10 h-10 rounded-md border hover:bg-primary hover:text-white focus:ring">
                                      {rating}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                                  <span>{language === 'ar' ? 'سيء جدًا' : 'Very poor'}</span>
                                  <span>{language === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="font-medium">
                                  {language === 'ar' 
                                    ? 'كيف تقيم سرعة الخدمة؟'
                                    : 'How would you rate the speed of service?'
                                  }
                                </p>
                                <div className="flex justify-between mt-2">
                                  {['1', '2', '3', '4', '5'].map((rating) => (
                                    <button key={rating} className="w-10 h-10 rounded-md border hover:bg-primary hover:text-white focus:ring">
                                      {rating}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                                  <span>{language === 'ar' ? 'سيء جدًا' : 'Very poor'}</span>
                                  <span>{language === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="font-medium">
                                  {language === 'ar' 
                                    ? 'كيف تقيم سلوك الموظفين؟'
                                    : 'How would you rate the staff behavior?'
                                  }
                                </p>
                                <div className="flex justify-between mt-2">
                                  {['1', '2', '3', '4', '5'].map((rating) => (
                                    <button key={rating} className="w-10 h-10 rounded-md border hover:bg-primary hover:text-white focus:ring">
                                      {rating}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                                  <span>{language === 'ar' ? 'سيء جدًا' : 'Very poor'}</span>
                                  <span>{language === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="font-medium">
                                {language === 'ar' ? 'هل لديك أي اقتراحات للتحسين؟' : 'Do you have any suggestions for improvement?'}
                              </label>
                              <textarea 
                                className="w-full h-24 border rounded-md p-2 resize-none" 
                                placeholder={language === 'ar' ? 'أدخل اقتراحاتك هنا...' : 'Enter your suggestions here...'}
                              />
                            </div>
                            
                            <Button className="w-full">
                              {language === 'ar' ? 'إرسال' : 'Submit'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" onClick={() => setActiveTab('my-surveys')}>
                      {language === 'ar' ? 'العودة إلى الاستبيانات' : 'Back to Surveys'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SurveyPage;
