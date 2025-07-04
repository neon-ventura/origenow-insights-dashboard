
import React from 'react';
import { HistoricoContent } from '@/components/HistoricoContent';
import { History, Clock } from 'lucide-react';

const Historico = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <History className="w-8 h-8 text-blue-600" />
          Histórico
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Histórico de processamentos realizados
        </p>
      </div>

      <HistoricoContent />
    </>
  );
};

export default Historico;
