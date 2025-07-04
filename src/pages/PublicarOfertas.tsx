
import React from 'react';
import { OfertasUploadDropzone } from '@/components/OfertasUploadDropzone';
import { TemplateDownload } from '@/components/TemplateDownload';
import { Upload, FileUp } from 'lucide-react';

const PublicarOfertas = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Upload className="w-8 h-8 text-blue-600" />
          Publicar Ofertas
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <FileUp className="w-5 h-5 text-gray-500" />
          Faça o download do modelo e envie sua planilha de ofertas
        </p>
      </div>

      <div className="space-y-8">
        {/* Download do Template */}
        <TemplateDownload />

        {/* Upload de Ofertas */}
        <OfertasUploadDropzone />
      </div>
    </>
  );
};

export default PublicarOfertas;
