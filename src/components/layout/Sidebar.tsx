
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, Component, FileText, FileCode, Users, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Collections', path: '/collections', icon: Box },
  { name: 'Components', path: '/components', icon: Component },
  { name: 'Content', path: '/content', icon: FileText },
  { name: 'API', path: '/api', icon: FileCode },
  { name: 'Users', path: '/users', icon: Users },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-cms-darkBlue text-white transition-transform duration-300 ease-in-out", 
        collapsed ? "-translate-x-full" : "translate-x-0",
        "md:translate-x-0"
      )}>
        <div className="flex justify-between items-center p-4 h-16">
          <h1 className="text-lg font-bold">CMS System</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(true)} 
            className="md:hidden text-white hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 mx-2 rounded-md transition-colors",
                      isActive 
                        ? "bg-slate-700 text-white" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
