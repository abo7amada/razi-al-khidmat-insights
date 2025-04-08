
import React from 'react';
import Layout from '../components/Layout';
import SurveyList from '../components/SurveyList';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const SurveyPage = () => {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  // إذا كان المستخدم هو السوبر أدمن، قم بإعادة توجيهه إلى الصفحة الرئيسية
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  const handleCreateNew = () => {
    navigate('/survey-creator');
  };
  
  const handleEdit = (surveyId: string) => {
    navigate(`/survey-creator?id=${surveyId}`);
  };
  
  return (
    <Layout currentPage="survey">
      <SurveyList onCreateNew={handleCreateNew} onEdit={handleEdit} />
    </Layout>
  );
};

export default SurveyPage;
