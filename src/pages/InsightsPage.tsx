
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const InsightsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { t, language } = useLanguage();
  
  useEffect(() => {
    // If we have a company ID, redirect to the insights overview page
    if (id) {
      navigate(`/company/${id}/insights/overview`);
    } else {
      // If no company ID is provided, we can either:
      // 1. Redirect to a company selection page
      // 2. Use a default company ID if the user only has access to one company
      // 3. Redirect to the first insights page
      navigate('/'); // For now, just redirect to home
    }
  }, [id, navigate]);
  
  return <div>{language === 'ar' ? 'جاري التحويل...' : 'Redirecting...'}</div>;
};

export default InsightsPage;
