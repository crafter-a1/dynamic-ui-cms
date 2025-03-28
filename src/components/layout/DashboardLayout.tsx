
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Database, Settings, Users, FileBox, Code2, ChevronLeft, Menu, 
  LogOut, MoonStar, Sun, Bell, Search, ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: darkMode ? "Light mode activated" : "Dark mode activated",
      duration: 2000,
    });
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutGrid size={20} /> },
    { name: 'Collections', path: '/collections', icon: <Database size={20} /> },
    { name: 'API Explorer', path: '/api', icon: <Code2 size={20} /> },
    { name: 'Media Library', path: '/media', icon: <FileBox size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={cn(
      "flex min-h-screen bg-cms-background transition-all duration-300",
      darkMode ? 'dark' : ''
    )}>
      {/* Sidebar */}
      <div className={cn(
        "bg-white dark:bg-gray-900 border-r border-cms-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-cms-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gradient-to-r from-cms-primary to-cms-secondary flex items-center justify-center text-white font-bold">
                D
              </div>
              <span className="font-semibold text-lg">DynamicCMS</span>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 mx-auto rounded bg-gradient-to-r from-cms-primary to-cms-secondary flex items-center justify-center text-white font-bold">
              D
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("transition-all", collapsed && "rotate-180")} size={18} />
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 py-6 px-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "sidebar-link",
                location.pathname === link.path ? "active" : "",
                collapsed && "justify-center px-2"
              )}
            >
              {link.icon}
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-auto border-t border-cms-border p-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full", collapsed && "justify-center")}
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={18} /> : <MoonStar size={18} />}
            {!collapsed && <span className="ml-2">Toggle Theme</span>}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-900 border-b border-cms-border h-16 flex items-center px-4 gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu size={20} />
          </Button>
          
          <div className="flex-1 relative max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 w-full rounded-md border border-cms-border bg-transparent focus:outline-none focus:border-cms-primary focus:ring-1 focus:ring-cms-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-cms-error rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-sm">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-gray-500">john@example.com</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
