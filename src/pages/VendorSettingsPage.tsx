
import React from 'react';
import Layout from '../components/Layout';
import VendorSettings from '../components/VendorSettings';
import { useLanguage } from '../context/LanguageContext';

const VendorSettingsPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout currentPage="vendor-settings">
      <VendorSettings />
    </Layout>
  );
};

export default VendorSettingsPage;
