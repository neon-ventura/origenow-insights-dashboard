
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';

const ProdutosAmazon = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Título da Página */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Produtos Amazon</h1>
            <p className="text-gray-600">Acompanhe e gerencie todos os seus produtos listados na Amazon</p>
          </div>

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
