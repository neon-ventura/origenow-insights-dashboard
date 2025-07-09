
import React, { useState } from 'react';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';
import { Package } from 'lucide-react';
import { Layout } from '@/components/Layout';

const ProdutosAmazon = () => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const handleCloseActionBar = () => {
    setSelectedProducts(new Set());
  };

  const handleProductAction = (action: string) => {
    console.log(`Ação ${action} executada em ${selectedProducts.size} produtos`);
    // Aqui você implementaria a lógica específica para cada ação
  };

  const actionBarConfig = selectedProducts.size > 0 ? {
    selectedCount: selectedProducts.size,
    onClose: handleCloseActionBar,
    onAction: handleProductAction
  } : null;

  return (
    <Layout actionBar={actionBarConfig}>
      {/* Título da Página */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Anúncios</h1>
            <p className="text-gray-600 text-lg">Gerencie seus anúncios e monitore o desempenho de vendas</p>
          </div>
        </div>
      </div>

      {/* Métricas dos Produtos */}
      <ProductMetrics />

      {/* Tabela de Produtos */}
      <ProductsTable 
        selectedProducts={selectedProducts}
        onSelectionChange={setSelectedProducts}
      />
    </Layout>
  );
};

export default ProdutosAmazon;
