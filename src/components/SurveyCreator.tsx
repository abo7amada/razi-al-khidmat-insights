
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SurveyList from './SurveyList';
import SurveyEditor from './SurveyEditor';
import { useIsMobile } from '../hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

type ViewState = 'list' | 'create' | 'edit';

const SurveyCreator: React.FC = () => {
  const { t, language } = useLanguage();
  const [view, setView] = useState<ViewState>('list');
  const [editingSurveyId, setEditingSurveyId] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();
  
  const handleCreateNew = () => {
    setEditingSurveyId(undefined);
    setView('create');
    
    // Show a toast to confirm action
    toast({
      title: language === 'ar' ? 'إنشاء استبيان جديد' : 'Create New Survey',
      description: language === 'ar' 
        ? 'يمكنك الآن إنشاء استبيان جديد'
        : 'You can now create a new survey',
    });
  };
  
  const handleEditSurvey = (surveyId: string) => {
    setEditingSurveyId(surveyId);
    setView('edit');
    
    // Show a toast to confirm action
    toast({
      title: language === 'ar' ? 'تحرير الاستبيان' : 'Edit Survey',
      description: language === 'ar' 
        ? 'يمكنك الآن تحرير الاستبيان المحدد'
        : 'You can now edit the selected survey',
    });
  };
  
  const handleCancel = () => {
    // Ask for confirmation if in edit mode
    if (view === 'edit') {
      const confirmed = window.confirm(
        language === 'ar' 
          ? 'هل أنت متأكد من أنك تريد الخروج؟ قد تفقد التغييرات التي أجريتها.'
          : 'Are you sure you want to exit? You may lose changes you\'ve made.'
      );
      
      if (!confirmed) return;
    }
    
    setView('list');
    setEditingSurveyId(undefined);
  };
  
  const handleSaveSuccess = () => {
    setView('list');
    setEditingSurveyId(undefined);
    
    // Show a success toast
    toast({
      title: language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Successfully',
      description: language === 'ar' 
        ? 'تم حفظ الاستبيان بنجاح'
        : 'Survey has been saved successfully',
    });
  };
  
  return (
    <div className={isMobile ? "px-2" : "px-6"}>
      {view === 'list' && (
        <SurveyList 
          onCreateNew={handleCreateNew} 
          onEdit={handleEditSurvey} 
        />
      )}
      
      {(view === 'create' || view === 'edit') && (
        <SurveyEditor 
          surveyId={editingSurveyId} 
          onCancel={handleCancel}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default SurveyCreator;
