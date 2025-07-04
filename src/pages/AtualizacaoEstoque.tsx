
import React from 'react';
import { StockTemplateDownload } from '@/components/StockTemplateDownload';
import { StockUploadDropzone } from '@/components/StockUploadDropzone';

const AtualizacaoEstoque = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Atualização de Estoque
        </h1>
        <p className="text-gray-600 text-lg">
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
