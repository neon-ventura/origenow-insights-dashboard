
import React from 'react';
import { HistoricoContent } from '@/components/HistoricoContent';

const Historico = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Histórico
        </h1>
        <p className="text-gray-600 text-lg">
          Histórico de processamentos realizados
        </p>
      </div>

      <HistoricoContent />
    </>
  );
};

export default Historico;
