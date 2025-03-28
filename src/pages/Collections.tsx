
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { CalendarDemo } from '@/components/ui/calendar';
import { DndContext } from '@dnd-kit/core';
import ComponentPanel from '@/components/collections/ComponentPanel';
import CollectionBuilder from '@/components/collections/CollectionBuilder';

const Collections = () => {
  const [activeDropId, setActiveDropId] = React.useState<string | null>(null);

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveDropId(active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveDropId(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Collection Builder</h1>
        <p className="text-gray-500">Create and manage your content collections and field types</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="lg:col-span-2">
            <CollectionBuilder activeDropId={activeDropId || undefined} />
          </div>
          <div>
            <ComponentPanel />
          </div>
        </DndContext>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Component Showcase</h2>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Calendar Component</h3>
          <CalendarDemo />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Collections;
