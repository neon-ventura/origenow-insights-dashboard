
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { DraggableSidebar } from '@/components/DraggableSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo global */}
      <Header />
      
      <div className="flex">
        {/* Sidebar global */}
        <DraggableSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        {/* Container principal com padding de 10px */}
        <div 
          className="flex-1 p-[10px] transition-all duration-300"
          style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
        >
          {/* Caixote onde as páginas vão ser renderizadas */}
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
