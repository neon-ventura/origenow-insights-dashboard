
import React, { useState } from 'react';
import { FornecedoresMetrics } from '@/components/FornecedoresMetrics';
import { FornecedoresTable } from '@/components/FornecedoresTable';
import { Users, Building2 } from 'lucide-react';

const Fornecedores = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Título da Página */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Fornecedores
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-500" />
          Gerencie todos os produtos dos seus fornecedores
        </p>
      </div>

      {/* Métricas dos Fornecedores */}
      <FornecedoresMetrics currentPage={currentPage} />

      {/* Tabela de Fornecedores */}
      <FornecedoresTable currentPage={currentPage} onPageChange={handlePageChange} />
    </>
  );
};

export default Fornecedores;
