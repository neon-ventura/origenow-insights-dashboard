import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';
const ProdutosAmazon = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return <div className="min-h-screen bg-gray-50 flex">
      <DraggableSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{
      marginLeft: sidebarCollapsed ? '89px' : '281px'
    }}>
        <Header />
        
        <main style={{
        marginLeft: '15px'
      }} className="flex-1 overflow-y-auto p-6 px-0 py-[24px]">
          {/* Título da Página */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{
            fontSize: '28px'
          }}>
              Meus Anúncios
            </h1>
            <p className="text-gray-600" style={{
            fontSize: '18px'
          }}>
              Gerencie seus anúncios e monitore o desempenho de vendas
            </p>
          </div>

          {/* Métricas dos Produtos */}
          <ProductMetrics />

          {/* Tabela de Produtos */}
          <ProductsTable />
        </main>
      </div>
    </div>;
};
export default ProdutosAmazon;