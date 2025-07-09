
import React from 'react';
import { Package, Upload } from 'lucide-react';
import { ActionBarContent } from '@/components/ActionBarContent';

interface FornecedoresActionBarProps {
  selectedCount: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const FornecedoresActionBar: React.FC<FornecedoresActionBarProps> = ({
  selectedCount,
  onClose,
  onAction
}) => {
  const actions = [
    { value: 'publish', label: 'Publicar Anúncios', icon: Upload },
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
