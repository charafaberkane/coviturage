import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '../common/Breadcrumbs';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Adaptive Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-4">
          {/* Breadcrumbs for easier navigation */}
          <div className="flex items-center justify-between">
            <Breadcrumbs />
          </div>
          
          {/* Nested routes are rendered here */}
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
