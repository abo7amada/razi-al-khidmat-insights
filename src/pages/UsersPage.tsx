
import React from 'react';
import Layout from '../components/Layout';
import UserManagement from '../components/UserManagement';
import { useLanguage } from '../context/LanguageContext';

const UsersPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout currentPage="users">
      <UserManagement />
    </Layout>
  );
};

export default UsersPage;
