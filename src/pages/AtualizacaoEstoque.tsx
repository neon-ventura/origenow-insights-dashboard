
import React from 'react';
import { StockTemplateDownload } from '@/components/StockTemplateDownload';
import { StockUploadDropzone } from '@/components/StockUploadDropzone';
import { RefreshCw } from 'lucide-react';

const AtualizacaoEstoque = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <RefreshCw className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Atualização de Estoque</h1>
            <p className="text-gray-600 text-lg">Faça o download do modelo e envie sua planilha para atualizar preços e estoque</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Download do Template */}
        <StockTemplateDownload />

        {/* Upload de Estoque */}
        <StockUploadDropzone />
      </div>
    </>
  );
};

export default AtualizacaoEstoque;
