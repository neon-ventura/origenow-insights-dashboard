import React, { useState } from 'react';
import { Trash2, Upload, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useDeleteUpload } from '@/hooks/useDeleteUpload';
import { useUserContext } from '@/contexts/UserContext';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export const DeleteUploadDropzone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedUser } = useUserContext();
  const { uploadFile, isUploading, progress } = useDeleteUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato de arquivo inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleUploadClick = () => {
    if (!file) return;
    
    if (!selectedUser?.sellerId) {
      toast({
        title: "Usuário não selecionado",
        description: "Por favor, selecione um usuário antes de fazer o upload.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation modal instead of uploading directly
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!file) return;
    
    setShowConfirmation(false);
    
    try {
      await uploadFile(file, 'deletar-ofertas');
      setFile(null);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <span>Upload para Deletar Ofertas</span>
          </CardTitle>
          <CardDescription>
            Envie sua planilha preenchida para deletar ofertas da Amazon
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Alerta de Cuidado */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-2">Atenção - Ação Irreversível</h4>
                <p className="text-sm text-red-700">
                  Esta ação irá deletar permanentemente as ofertas especificadas na planilha. 
                  Certifique-se de que todas as informações estão corretas antes de prosseguir.
                </p>
              </div>
            </div>
          </div>

          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Arraste e solte seu arquivo aqui ou{' '}
                    <label className="text-red-600 hover:text-red-700 cursor-pointer underline">
                      clique para selecionar
                      <input
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Apenas arquivos Excel (.xlsx, .xls) até 10MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  Remover
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enviando arquivo...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleUploadClick}
                disabled={isUploading || !selectedUser?.sellerId}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isUploading ? 'Enviando...' : 'Deletar Ofertas'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmDelete}
        fileName={file?.name || ''}
      />
    </>
  );
};
