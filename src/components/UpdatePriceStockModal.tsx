
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit3, AlertTriangle } from 'lucide-react';

interface UpdatePriceStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

export const UpdatePriceStockModal: React.FC<UpdatePriceStockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-blue-600">
            <Edit3 className="w-5 h-5" />
            <span>Atualizar Preço e Estoque</span>
          </DialogTitle>
          <DialogDescription className="text-left">
            <div className="space-y-3">
              <p className="font-medium">
                Você está prestes a atualizar <strong className="text-blue-600">{selectedCount} anúncio{selectedCount !== 1 ? 's' : ''}</strong>.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Os preços e estoques serão atualizados com base nas informações dos produtos selecionados.
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Confirmar Atualização
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
