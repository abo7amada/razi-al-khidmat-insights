
import React from 'react';
import Layout from '../components/Layout';
import SurveyForm from '../components/SurveyForm';
import SurveyList from '../components/SurveyList';
import { useNavigate } from 'react-router-dom';

const SurveyPage = () => {
  const navigate = useNavigate();
  
  const handleCreateNew = () => {
    navigate('/survey-creator');
  };
  
  const handleEdit = (surveyId: string) => {
    navigate(`/survey-creator?edit=${surveyId}`);
  };
  
  return (
    <Layout currentPage="survey">
      <SurveyList onCreateNew={handleCreateNew} onEdit={handleEdit} />
    </Layout>
  );
};

export default SurveyPage;
