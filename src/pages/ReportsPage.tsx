
import React from 'react';
import Layout from '../components/Layout';
import Reports from '../components/Reports';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ReportsPage = () => {
  const { isSuperAdmin } = useAuth();
  
  // إذا كان المستخدم هو السوبر أدمن، قم بإعادة توجيهه إلى الصفحة الرئيسية
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <Layout currentPage="reports">
      <Reports />
    </Layout>
  );
};

export default ReportsPage;
