
import React from 'react';
import { StockTemplateDownload } from '@/components/StockTemplateDownload';
import { StockUploadDropzone } from '@/components/StockUploadDropzone';
import { Package, RefreshCw } from 'lucide-react';

const AtualizacaoEstoque = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          Atualização de Estoque
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gray-500" />
          Faça o download do modelo e envie sua planilha para atualizar preços e estoque
        </p>
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
