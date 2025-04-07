
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Collections = lazy(() => import('./pages/Collections'));
const FieldConfiguration = lazy(() => import('./pages/FieldConfiguration'));
const FieldsShowcase = lazy(() => import('./pages/FieldsShowcase'));
const Components = lazy(() => import('./pages/Components'));
const ComponentDetails = lazy(() => import('./pages/ComponentDetails'));
const Content = lazy(() => import('./pages/Content'));
const Api = lazy(() => import('./pages/Api'));
const Users = lazy(() => import('./pages/Users'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-16 w-16 bg-blue-100 rounded-full mb-4"></div>
      <div className="h-4 w-32 bg-blue-100 rounded"></div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:collectionId/fields" element={<FieldConfiguration />} />
          <Route path="/fields-showcase" element={<FieldsShowcase />} />
          <Route path="/components" element={<Components />} />
          <Route path="/components/:componentId" element={<ComponentDetails />} />
          <Route path="/content" element={<Content />} />
          <Route path="/api" element={<Api />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
