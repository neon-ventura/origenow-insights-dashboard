
import React from 'react';
import { DeleteTemplateDownload } from '@/components/DeleteTemplateDownload';
import { DeleteUploadDropzone } from '@/components/DeleteUploadDropzone';
import { Trash2, FileX } from 'lucide-react';

const DeletarOfertas = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trash2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deletar Ofertas</h1>
            <p className="text-gray-600 text-lg">Faça o download do modelo e envie sua planilha para deletar ofertas</p>
          </div>
        </div>
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
