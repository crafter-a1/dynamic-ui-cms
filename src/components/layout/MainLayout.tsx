
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn(
        "flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out",
        className
      )}>
        {children}
      </main>
    </div>
  );
}
