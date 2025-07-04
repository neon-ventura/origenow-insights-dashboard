
import React from 'react';
import { DeleteTemplateDownload } from '@/components/DeleteTemplateDownload';
import { DeleteUploadDropzone } from '@/components/DeleteUploadDropzone';
import { Trash2, FileX } from 'lucide-react';

const DeletarOfertas = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Trash2 className="w-8 h-8 text-blue-600" />
          Deletar Ofertas
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <FileX className="w-5 h-5 text-gray-500" />
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
