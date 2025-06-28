
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';

const ProdutosAmazon = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '88px' : '256px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto px-16 py-8 space-y-8">
          {/* Métricas dos Produtos */}
          <ProductMetrics />

          {/* Tabela de Produtos */}
          <ProductsTable />
        </main>
      </div>
    </div>
  );
};

export default ProdutosAmazon;
