
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SurveyList from './SurveyList';
import SurveyEditor from './SurveyEditor';

type ViewState = 'list' | 'create' | 'edit';

const SurveyCreator: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [editingSurveyId, setEditingSurveyId] = useState<string | undefined>(undefined);
  
  const handleCreateNew = () => {
    setEditingSurveyId(undefined);
    setView('create');
  };
  
  const handleEditSurvey = (surveyId: string) => {
    setEditingSurveyId(surveyId);
    setView('edit');
  };
  
  const handleCancel = () => {
    setView('list');
    setEditingSurveyId(undefined);
  };
  
  return (
    <div>
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
        />
      )}
    </div>
  );
};

export default SurveyCreator;
