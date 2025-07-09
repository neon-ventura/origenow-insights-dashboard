
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { UserSwitchingSplash } from '@/components/UserSwitchingSplash';
import { ProductActionBar } from '@/components/ProductActionBar';

interface LayoutProps {
  children: React.ReactNode;
  actionBar?: {
    selectedCount: number;
    onClose: () => void;
    onAction: (action: string) => void;
  } | null;
}

export const Layout = ({ children, actionBar }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 88 : 256;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* User Switching Splash Screen */}
      <UserSwitchingSplash />
      
      {/* Header fixo global que considera a largura do sidebar */}
      <Header sidebarWidth={sidebarWidth} />
      
      {/* Container principal com padding-top para compensar o header fixo */}
      <div className="flex pt-20">
        {/* Sidebar global */}
        <DraggableSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        {/* Container principal com padding de 10px e margem de 15px */}
        <div 
          className={`flex-1 p-[10px] transition-all duration-300 ${actionBar ? 'pb-[90px]' : ''}`}
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

      {/* Barra de Ações Global - aparece condicionalmente */}
      {actionBar && (
        <div 
          className="fixed bottom-0 bg-white border-t border-gray-200 shadow-lg z-30"
          style={{ 
            left: sidebarCollapsed ? '88px' : '256px',
            right: '0'
          }}
        >
          <div className="px-6 py-4 mr-[15px]">
            <ProductActionBar
              selectedCount={actionBar.selectedCount}
              onClose={actionBar.onClose}
              onAction={actionBar.onAction}
            />
          </div>
        </div>
      )}
    </div>
  );
};
