
import React from 'react';
import { Package, Edit3, Trash2 } from 'lucide-react';
import { ActionBarContent } from '@/components/ActionBarContent';

interface ProductActionBarProps {
  selectedCount: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ProductActionBar: React.FC<ProductActionBarProps> = ({
  selectedCount,
  onClose,
  onAction
}) => {
  const actions = [
    { value: 'update-price-stock', label: 'Atualizar Preço e Estoque', icon: Edit3 },
    { value: 'delete', label: 'Excluir Anúncios', icon: Trash2 },
  ];

  return (
    <ActionBarContent
      selectedCount={selectedCount}
      onClose={onClose}
      onAction={onAction}
      actions={actions}
      itemLabel="produto"
      icon={Package}
    />
  );
};
