
import React from 'react';
import { HistoricoContent } from '@/components/HistoricoContent';
import { History, Clock } from 'lucide-react';

const Historico = () => {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <History className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
            <p className="text-gray-600 text-lg">Histórico de processamentos realizados</p>
          </div>
        </div>
      </div>

      <HistoricoContent />
    </>
  );
};

export default Historico;
