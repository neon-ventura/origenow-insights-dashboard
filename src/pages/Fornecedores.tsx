
import React, { useState } from 'react';
import { FornecedoresMetrics } from '@/components/FornecedoresMetrics';
import { FornecedoresTable } from '@/components/FornecedoresTable';
import { FornecedoresActionBar } from '@/components/FornecedoresActionBar';
import { PublishAdsModal } from '@/components/PublishAdsModal';
import { Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Fornecedores = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedProducts(selected);
  };

  const handleAction = (action: string) => {
    if (action === 'publish') {
      setShowPublishModal(true);
    }
  };

  const handlePublishConfirm = () => {
    console.log('Publishing ads for products:', Array.from(selectedProducts));
    
    toast({
      title: "Anúncios publicados",
      description: `${selectedProducts.size} produto${selectedProducts.size !== 1 ? 's' : ''} ${selectedProducts.size !== 1 ? 'foram publicados' : 'foi publicado'} com sucesso.`,
    });
    
    setShowPublishModal(false);
    setSelectedProducts(new Set());
  };

  const handleCloseActionBar = () => {
    setSelectedProducts(new Set());
  };

  return (
    <>
      {/* Título da Página */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>
            <p className="text-gray-600 text-lg">Gerencie todos os produtos dos seus fornecedores</p>
          </div>
        </div>
      </div>

      {/* Barra de Ações */}
      {selectedProducts.size > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <FornecedoresActionBar
            selectedCount={selectedProducts.size}
            onClose={handleCloseActionBar}
            onAction={handleAction}
          />
        </div>
      )}

      {/* Métricas dos Fornecedores */}
      <FornecedoresMetrics currentPage={currentPage} />

      {/* Tabela de Fornecedores */}
      <FornecedoresTable 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        selectedProducts={selectedProducts}
        onSelectionChange={handleSelectionChange}
      />

      {/* Modal de Confirmação para Publicar */}
      <PublishAdsModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublishConfirm}
        selectedCount={selectedProducts.size}
      />
    </>
  );
};

export default Fornecedores;
