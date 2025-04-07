
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import NewFieldsShowcase from '@/components/fields/demos/NewFieldsShowcase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FieldsShowcase() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/collections')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Field Components Showcase</h1>
            <p className="text-muted-foreground">
              Preview of all available field components for collections
            </p>
          </div>
        </div>

        <NewFieldsShowcase />
      </div>
    </MainLayout>
  );
}
