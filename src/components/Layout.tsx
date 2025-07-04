
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
      
      {/* Container principal com padding-top para compensar o header fixo */}
      <div className="flex pt-20">
        {/* Sidebar global */}
        <DraggableSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        {/* Container principal com padding de 10px e margem de 15px */}
        <div 
          className="flex-1 p-[10px] transition-all duration-300"
          style={{ 
            marginLeft: sidebarCollapsed ? '79px' : '271px', // 64px + 15px e 256px + 15px
            marginRight: '15px',
            marginTop: '15px',
            marginBottom: '15px'
          }}
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
