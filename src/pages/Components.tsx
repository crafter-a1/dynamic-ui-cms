
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ComponentsPanel } from '@/components/ComponentsPanel';

const ComponentsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <ComponentsPanel />
      </div>
    </MainLayout>
  );
};

export default ComponentsPage;
