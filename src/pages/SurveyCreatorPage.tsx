
import React from 'react';
import Layout from '../components/Layout';
import SurveyCreator from '../components/SurveyCreator';

const SurveyCreatorPage = () => {
  return (
    <Layout currentPage="survey-creator">
      <SurveyCreator />
    </Layout>
  );
};

export default SurveyCreatorPage;
