
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome Back, Admin</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your content</p>
          </div>
          <div className="mt-4 md:mt-0 text-gray-500">{currentDate}</div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Collections" value="24" />
          <StatsCard title="Components" value="58" />
          <StatsCard title="Published Content" value="132" />
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div>
            <ActivityItem 
              title='New collection "Products" created' 
              timestamp='2 hours ago' 
            />
            <ActivityItem 
              title='Component "Product Card" updated' 
              timestamp='5 hours ago' 
            />
            <ActivityItem 
              title='New API key generated' 
              timestamp='Yesterday' 
            />
            <ActivityItem 
              title='Content "Homepage Banner" published' 
              timestamp='2 days ago' 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
