
import React from 'react';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';
import { Package, ShoppingBag } from 'lucide-react';

const ProdutosAmazon = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          Meus Anúncios
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-gray-500" />
          Gerencie seus anúncios e monitore o desempenho de vendas
        </p>
      </div>

      {/* Métricas dos Produtos */}
      <ProductMetrics />

      {/* Tabela de Produtos */}
      <ProductsTable />
    </>
  );
};

export default ProdutosAmazon;
