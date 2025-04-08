
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// This page is now just a redirect to SitesPage
const LocationsPage = () => {
  return <Navigate to="/sites" replace />;
};

export default LocationsPage;
