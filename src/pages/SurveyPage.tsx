
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
  
  const handleViewResponses = (surveyId: string) => {
    navigate(`/reports?survey=${surveyId}`);
  };
  
  return (
    <Layout currentPage="survey">
      <SurveyForm />
    </Layout>
  );
};

export default SurveyPage;
