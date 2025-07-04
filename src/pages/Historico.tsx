
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { HistoricoContent } from '@/components/HistoricoContent';

const Historico = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '89px' : '281px' }}
      >
        <main className="flex-1 overflow-y-auto p-6" style={{ marginLeft: '15px' }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontSize: '28px' }}>
              Histórico
            </h1>
            <p className="text-gray-600" style={{ fontSize: '18px' }}>
              Histórico de processamentos realizados
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <HistoricoContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Historico;
