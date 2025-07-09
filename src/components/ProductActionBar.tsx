
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Package, Edit3, Trash2 } from 'lucide-react';

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
    { value: 'update-price', label: 'Atualizar Preços', icon: Edit3 },
    { value: 'update-stock', label: 'Atualizar Estoque', icon: Package },
    { value: 'delete', label: 'Excluir Produtos', icon: Trash2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div 
        className="mx-auto px-6 py-4"
        style={{ 
          marginLeft: '286px', // 271px (sidebar) + 15px (margin)
          marginRight: '15px'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                {selectedCount} produto{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <Select onValueChange={onAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar ação" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    <div className="flex items-center gap-2">
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
