
import React from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { useLanguage } from '../context/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <Layout currentPage="dashboard">
      <Dashboard />
    </Layout>
  );
};

export default Index;
