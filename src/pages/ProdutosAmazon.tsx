
import React, { useState } from 'react';
import { ProductMetrics } from '@/components/ProductMetrics';
import { ProductsTable } from '@/components/ProductsTable';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { UpdatePriceStockModal } from '@/components/UpdatePriceStockModal';
import { Package } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { toast } from '@/hooks/use-toast';

const ProdutosAmazon = () => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleCloseActionBar = () => {
    setSelectedProducts(new Set());
  };

  const handleProductAction = (action: string) => {
    console.log(`Ação ${action} executada em ${selectedProducts.size} produtos`);
    
    if (action === 'delete') {
      setDeleteModalOpen(true);
    } else if (action === 'update-price-stock') {
      setUpdateModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    console.log(`Deletando ${selectedProducts.size} produtos:`, Array.from(selectedProducts));
    
    toast({
      title: "Anúncios deletados",
      description: `${selectedProducts.size} anúncio${selectedProducts.size !== 1 ? 's' : ''} deletado${selectedProducts.size !== 1 ? 's' : ''} com sucesso.`,
    });
    
    setDeleteModalOpen(false);
    setSelectedProducts(new Set());
    
    // Aqui você implementaria a lógica real de deleção
  };

  const handleUpdateConfirm = (price?: string, stock?: string) => {
    console.log(`Atualizando ${selectedProducts.size} produtos:`, {
      products: Array.from(selectedProducts),
      price,
      stock
    });
    
    const updates = [];
    if (price) updates.push(`preço para R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`);
    if (stock) updates.push(`estoque para ${stock} unidades`);
    
    toast({
      title: "Anúncios atualizados",
      description: `${selectedProducts.size} anúncio${selectedProducts.size !== 1 ? 's' : ''} atualizado${selectedProducts.size !== 1 ? 's' : ''} com sucesso. ${updates.join(' e ')}.`,
    });
    
    setUpdateModalOpen(false);
    setSelectedProducts(new Set());
    
    // Aqui você implementaria a lógica real de atualização
  };

  const actionBarConfig = selectedProducts.size > 0 ? {
    selectedCount: selectedProducts.size,
    onClose: handleCloseActionBar,
    onAction: handleProductAction
  } : null;

  return (
    <Layout actionBar={actionBarConfig}>
      {/* Título da Página */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Anúncios</h1>
            <p className="text-gray-600 text-lg">Gerencie seus anúncios e monitore o desempenho de vendas</p>
          </div>
        </div>
      </div>

      {/* Métricas dos Produtos */}
      <ProductMetrics />

      {/* Tabela de Produtos */}
      <ProductsTable 
        selectedProducts={selectedProducts}
        onSelectionChange={setSelectedProducts}
      />

      {/* Modal de Confirmação de Deleção */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        fileName={`${selectedProducts.size} anúncio${selectedProducts.size !== 1 ? 's' : ''} selecionado${selectedProducts.size !== 1 ? 's' : ''}`}
      />

      {/* Modal de Atualização de Preço e Estoque */}
      <UpdatePriceStockModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onConfirm={handleUpdateConfirm}
        selectedCount={selectedProducts.size}
      />
    </Layout>
  );
};

export default ProdutosAmazon;
