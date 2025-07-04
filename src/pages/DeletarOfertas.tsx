
import React from 'react';
import { DeleteTemplateDownload } from '@/components/DeleteTemplateDownload';
import { DeleteUploadDropzone } from '@/components/DeleteUploadDropzone';

const DeletarOfertas = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Deletar Ofertas
        </h1>
        <p className="text-gray-600 text-lg">
          Faça o download do modelo e envie sua planilha para deletar ofertas
        </p>
      </div>

      <div className="space-y-8">
        {/* Download do Template */}
        <DeleteTemplateDownload />

        {/* Upload de Deletar Ofertas */}
        <DeleteUploadDropzone />
      </div>
    </>
  );
};

export default DeletarOfertas;
