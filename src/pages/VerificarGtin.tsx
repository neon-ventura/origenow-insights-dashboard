
import React from 'react';
import { GtinTemplateDownload } from '@/components/GtinTemplateDownload';
import { GtinUploadDropzone } from '@/components/GtinUploadDropzone';
import { Search, Barcode } from 'lucide-react';

const VerificarGtin = () => {
  return (
    <>
      {/* Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Search className="w-8 h-8 text-blue-600" />
          Verificar Gtin
        </h1>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <Barcode className="w-5 h-5 text-gray-500" />
          Faça o download do modelo e envie sua planilha para verificação de GTINs
        </p>
      </div>

      <div className="space-y-8">
        {/* Download do Template */}
        <GtinTemplateDownload />

        {/* Upload de GTIN */}
        <GtinUploadDropzone />
      </div>
    </>
  );
};

export default VerificarGtin;
