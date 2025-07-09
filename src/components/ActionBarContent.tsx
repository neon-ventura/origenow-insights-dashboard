
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface ActionOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ActionBarContentProps {
  selectedCount: number;
  onClose: () => void;
  onAction: (action: string) => void;
  actions: ActionOption[];
  itemLabel: string; // e.g., "produto", "pedido", "fornecedor"
  icon: React.ComponentType<{ className?: string }>;
}

export const ActionBarContent: React.FC<ActionBarContentProps> = ({
  selectedCount,
  onClose,
  onAction,
  actions,
  itemLabel,
  icon: Icon
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">
            {selectedCount} {itemLabel}{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
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
  );
};
