
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { mockSurveys } from '../data/mockSurveys';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface SurveyListProps {
  onCreateNew: () => void;
  onEdit: (surveyId: string) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({ onCreateNew, onEdit }) => {
  const { t, language } = useLanguage();
  
  const dateLocale = language === 'ar' ? ar : enUS;
  
  const handleDelete = (surveyId: string) => {
    // In a real application, we would delete from the database
    console.log('Delete survey:', surveyId);
  };

  const handleViewResponses = (surveyId: string) => {
    // In a real application, we would navigate to responses page
    console.log('View responses for:', surveyId);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('mySurveys')}</CardTitle>
        <Button onClick={onCreateNew}>{t('createNewSurvey')}</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('surveyTitle')}</TableHead>
              <TableHead>{t('createdOn')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('responses')}</TableHead>
              <TableHead className="text-right">{t('options')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSurveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>
                  {format(parseISO(survey.createdAt), 'PPP', { locale: dateLocale })}
                </TableCell>
                <TableCell>
                  <Badge variant={survey.status === 'active' ? 'default' : 'secondary'}>
                    {survey.status === 'active' ? t('active') : t('inactive')}
                  </Badge>
                </TableCell>
                <TableCell>{survey.responseCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewResponses(survey.id)}>
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onEdit(survey.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(survey.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SurveyList;
