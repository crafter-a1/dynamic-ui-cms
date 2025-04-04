
import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import Dashboard from '@/pages/Dashboard';
import Collections from '@/pages/Collections';
import FieldConfiguration from '@/pages/FieldConfiguration';
import CollectionPreview from '@/pages/CollectionPreview';
import Content from '@/pages/Content';
import Components from '@/pages/Components';
import Api from '@/pages/Api';
import Users from '@/pages/Users';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="cms-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:collectionId/fields" element={<FieldConfiguration />} />
            <Route path="/collections/:collectionId/preview" element={<CollectionPreview />} />
            <Route path="/content" element={<Content />} />
            <Route path="/components" element={<Components />} />
            <Route path="/api" element={<Api />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
