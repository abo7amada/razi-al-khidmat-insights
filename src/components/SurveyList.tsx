
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
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SurveyListProps {
  onCreateNew: () => void;
  onEdit: (surveyId: string) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({ onCreateNew, onEdit }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const dateLocale = language === 'ar' ? ar : enUS;
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [surveyToDelete, setSurveyToDelete] = React.useState<string | null>(null);
  
  const handleDelete = (surveyId: string) => {
    setSurveyToDelete(surveyId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (surveyToDelete) {
      // In a real application, we would delete from the database
      console.log('Delete survey:', surveyToDelete);
      
      toast({
        title: language === 'ar' ? 'تم الحذف بنجاح' : 'Successfully deleted',
        description: language === 'ar' 
          ? 'تم حذف الاستبيان بنجاح' 
          : 'Survey was successfully deleted',
      });
    }
    setDeleteDialogOpen(false);
    setSurveyToDelete(null);
  };

  const handleViewResponses = (surveyId: string) => {
    // Navigate to the reports page with the survey ID
    navigate(`/reports?survey=${surveyId}`);
  };

  return (
    <>
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
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleViewResponses(survey.id)}
                        title={language === 'ar' ? 'عرض التقارير' : 'View Reports'}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onEdit(survey.id)}
                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(survey.id)}
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
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
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar' 
                ? 'هل أنت متأكد من رغبتك في حذف هذا الاستبيان؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this survey? This action cannot be undone.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SurveyList;
