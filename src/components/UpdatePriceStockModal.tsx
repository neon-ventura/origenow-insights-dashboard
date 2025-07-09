
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, AlertTriangle } from 'lucide-react';

interface UpdatePriceStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price?: string, stock?: string) => void;
  selectedCount: number;
}

export const UpdatePriceStockModal: React.FC<UpdatePriceStockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}) => {
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleConfirm = () => {
    if (price || stock) {
      onConfirm(price || undefined, stock || undefined);
      setPrice('');
      setStock('');
    }
  };

  const handleClose = () => {
    setPrice('');
    setStock('');
    onClose();
  };

  const isValid = price || stock;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                <p className="text-sm text-blue-700">
                  <strong>Importante:</strong> Deixe em branco os campos que não deseja alterar.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Novo Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 29.90"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Nova Quantidade em Estoque</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="Ex: 100"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!isValid}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Atualizar Anúncios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
