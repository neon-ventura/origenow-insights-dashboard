
import React from 'react';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';

const ProdutosAmazon = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Meus Anúncios
        </h1>
        <p className="text-gray-600 text-lg">
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
