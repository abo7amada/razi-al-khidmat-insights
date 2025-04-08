
import React from 'react';
import Layout from '../components/Layout';
import SurveyList from '../components/SurveyList';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SurveyPage = () => {
  const { isSuperAdmin } = useAuth();
  
  // إذا كان المستخدم هو السوبر أدمن، قم بإعادة توجيهه إلى الصفحة الرئيسية
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <Layout currentPage="survey">
      <SurveyList />
    </Layout>
  );
};

export default SurveyPage;
