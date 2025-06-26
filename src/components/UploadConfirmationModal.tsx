
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
import { Upload, FileSpreadsheet } from 'lucide-react';

interface UploadConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  fileSize: string;
  uploadType: 'verification' | 'ofertas' | 'price_stock';
}

const getUploadTypeLabel = (type: string) => {
  switch (type) {
    case 'verification':
      return 'Verificação de GTIN';
    case 'ofertas':
      return 'Publicação de Ofertas';
    case 'price_stock':
      return 'Atualização de Estoque';
    default:
      return 'Upload';
  }
};

export const UploadConfirmationModal: React.FC<UploadConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  fileSize,
  uploadType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Confirmar Upload</span>
          </DialogTitle>
          <DialogDescription>
            Confirme se deseja enviar este arquivo para {getUploadTypeLabel(uploadType)}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{fileName}</p>
            <p className="text-sm text-gray-500">{fileSize}</p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Confirmar Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
