
import React from 'react';
import { Database, Users, FileText, Image, BarChart3, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to DynamicCMS</h1>
        <p className="text-gray-500">Manage your content and configure your headless CMS</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Collections" 
          value="12" 
          icon={<Database size={24} className="text-cms-primary" />}
          change={{ value: 20, positive: true }}
        />
        <StatsCard 
          title="Content Entries" 
          value="156" 
          icon={<FileText size={24} className="text-cms-secondary" />}
          change={{ value: 15, positive: true }}
        />
        <StatsCard 
          title="Media Files" 
          value="43" 
          icon={<Image size={24} className="text-cms-accent" />}
          change={{ value: 5, positive: true }}
        />
        <StatsCard 
          title="API Calls" 
          value="2,430" 
          icon={<BarChart3 size={24} className="text-cms-success" />}
          change={{ value: 12, positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg flex items-start gap-4 hover:border-cms-primary/50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-cms-primary/10 flex items-center justify-center text-cms-primary">1</div>
              <div>
                <h3 className="font-medium mb-1">Create your first collection</h3>
                <p className="text-gray-500 text-sm mb-2">Define the structure for your content with custom fields and validations.</p>
                <Button size="sm">Create Collection</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg flex items-start gap-4 hover:border-cms-primary/50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-cms-primary/10 flex items-center justify-center text-cms-primary">2</div>
              <div>
                <h3 className="font-medium mb-1">Add content entries</h3>
                <p className="text-gray-500 text-sm mb-2">Start creating content based on your collection structure.</p>
                <Button size="sm" variant="outline">Manage Content</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg flex items-start gap-4 hover:border-cms-primary/50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-cms-primary/10 flex items-center justify-center text-cms-primary">3</div>
              <div>
                <h3 className="font-medium mb-1">Configure API access</h3>
                <p className="text-gray-500 text-sm mb-2">Set up API keys and permissions to access your content.</p>
                <Button size="sm" variant="outline">API Settings</Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-cms-secondary/10 flex items-center justify-center text-cms-secondary">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Blog post created</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-cms-primary/10 flex items-center justify-center text-cms-primary">
                <Database size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Products collection updated</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-cms-accent/10 flex items-center justify-center text-cms-accent">
                <Users size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">New user invited</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-cms-success/10 flex items-center justify-center text-cms-success">
                <Image size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">5 images uploaded</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-cms-warning/10 flex items-center justify-center text-cms-warning">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Event collection created</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
