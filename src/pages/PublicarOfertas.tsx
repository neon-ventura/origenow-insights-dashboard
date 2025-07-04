
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { OfertasUploadDropzone } from '@/components/OfertasUploadDropzone';
import { TemplateDownload } from '@/components/TemplateDownload';

const PublicarOfertas = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '89px' : '281px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6" style={{ marginLeft: '15px' }}>
          {/* Título da Página */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontSize: '28px' }}>
              Publicar Ofertas
            </h1>
            <p className="text-gray-600" style={{ fontSize: '18px' }}>
              Faça o download do modelo e envie sua planilha de ofertas
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Download do Template */}
            <TemplateDownload />

            {/* Upload de Ofertas */}
            <OfertasUploadDropzone />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublicarOfertas;
