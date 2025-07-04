
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { FornecedoresMetrics } from '@/components/FornecedoresMetrics';
import { FornecedoresTable } from '@/components/FornecedoresTable';

const Fornecedores = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '89px' : '281px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6" style={{ marginLeft: '25px' }}>
          {/* Título da Página */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontSize: '32px' }}>
              Fornecedores
            </h1>
            <p className="text-gray-600" style={{ fontSize: '21px' }}>
              Gerencie todos os produtos dos seus fornecedores
            </p>
          </div>

          {/* Métricas dos Fornecedores */}
          <FornecedoresMetrics currentPage={currentPage} />

          {/* Tabela de Fornecedores */}
          <FornecedoresTable 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />
        </main>
      </div>
    </div>
  );
};

export default Fornecedores;
