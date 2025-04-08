
import React from 'react';
import Layout from '../components/Layout';
import SurveyList from '../components/SurveyList';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../context/LanguageContext';

const SurveyPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const handleCreateNew = () => {
    navigate('/survey-creator');
  };
  
  const handleEdit = (surveyId: string) => {
    navigate(`/survey-creator?edit=${surveyId}`);
  };
  
  const handleViewResponses = (surveyId: string) => {
    navigate(`/reports?survey=${surveyId}`);
  };
  
  return (
    <Layout currentPage="survey">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'الاستبيانات' : 'Surveys'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-surveys">
            <TabsList>
              <TabsTrigger value="my-surveys">{t('mySurveys')}</TabsTrigger>
              <TabsTrigger value="preview">{t('preview')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-surveys" className="mt-4">
              <SurveyList 
                onCreateNew={handleCreateNew} 
                onEdit={handleEdit} 
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <p className="text-center text-muted-foreground mb-4">
                      {language === 'ar' 
                        ? 'اختر استبيانًا من القائمة لمعاينته كما يراه المستخدمون'
                        : 'Select a survey from the list to preview it as users would see it'
                      }
                    </p>
                    <div className="w-full max-w-md">
                      <iframe 
                        src={`/survey?demo=true`} 
                        className="w-full h-[600px] border rounded-md"
                        title="Survey Preview"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SurveyPage;
