
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface PublishAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

export const PublishAdsModal: React.FC<PublishAdsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
          <AlertDialogTitle className="flex items-center space-x-2 text-blue-600">
            <Upload className="w-5 h-5" />
            <span>Publicar Anúncios</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja publicar {selectedCount} produto{selectedCount !== 1 ? 's' : ''} como anúncio{selectedCount !== 1 ? 's' : ''}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Publicar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
