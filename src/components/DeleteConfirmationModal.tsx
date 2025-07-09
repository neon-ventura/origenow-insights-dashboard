
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmationValid = confirmationText.toLowerCase() === 'deletar';

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
      setConfirmationText(''); // Reset após confirmar
    }
  };

  const handleClose = () => {
    setConfirmationText(''); // Reset ao fechar
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
          <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Confirmar Exclusão</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <div className="space-y-3">
              <p className="font-medium">
                Você está prestes a <strong className="text-red-600">deletar permanentemente</strong> os anúncios especificados no arquivo:
              </p>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="font-mono text-sm text-gray-800">{fileName}</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Esta ação é irreversível!</strong> Os anúncios deletados não poderão ser recuperados.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Para confirmar esta ação, digite <strong>"deletar"</strong> no campo abaixo:
                </p>
                <Input
                  type="text"
                  placeholder="Digite: deletar"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className={`${!isConfirmationValid && confirmationText ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {confirmationText && !isConfirmationValid && (
                  <p className="text-xs text-red-500">Você deve digitar exatamente "deletar" para confirmar</p>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel onClick={handleClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!isConfirmationValid}
            className="bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Sim, Deletar Anúncios
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
