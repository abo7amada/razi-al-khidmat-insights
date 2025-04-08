
import React from 'react';
import Layout from '../components/Layout';
import LocationManagement from '../components/LocationManagement';
import { useLanguage } from '../context/LanguageContext';

const LocationsPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout currentPage="locations">
      <LocationManagement />
    </Layout>
  );
};

export default LocationsPage;
