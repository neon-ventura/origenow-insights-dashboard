
import React from 'react';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';
import { Package, ShoppingBag } from 'lucide-react';

const ProdutosAmazon = () => {
  return (
    <>
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
      <ProductsTable />
    </>
  );
};

export default ProdutosAmazon;
