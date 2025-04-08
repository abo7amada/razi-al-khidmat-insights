
import React from 'react';
import Layout from '../components/Layout';
import VendorSettings from '../components/VendorSettings';
import { useLanguage } from '../context/LanguageContext';

const VendorSettingsPage = () => {
  return (
    <Layout currentPage="dashboard">
      <VendorSettings />
    </Layout>
  );
};

export default VendorSettingsPage;
