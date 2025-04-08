
import React from 'react';
import Layout from '../components/Layout';
import SurveyForm from '../components/SurveyForm';

const SurveyPage = () => {
  return (
    <Layout currentPage="survey">
      <SurveyForm />
    </Layout>
  );
};

export default SurveyPage;
