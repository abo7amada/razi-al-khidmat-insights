
import React from 'react';
import Layout from '../components/Layout';
import SurveyCreator from '../components/SurveyCreator';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SurveyCreatorPage = () => {
  const { isSuperAdmin } = useAuth();
  
  // إذا كان المستخدم هو السوبر أدمن، قم بإعادة توجيهه إلى الصفحة الرئيسية
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <Layout currentPage="survey-creator">
      <SurveyCreator />
    </Layout>
  );
};

export default SurveyCreatorPage;
