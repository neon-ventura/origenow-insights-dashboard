import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Package, X, CheckCircle, Download, Loader2 } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';
import { useJobs } from '@/contexts/JobContext';
import { useUploadWithJobs } from '@/hooks/useUploadWithJobs';
import { toast } from '@/hooks/use-toast';
import { UploadConfirmationModal } from '@/components/UploadConfirmationModal';

export const StockUploadDropzone = () => {
  const { selectedUser } = useUserContext();
  const { completedJobs } = useJobs();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { uploadFile, isUploading } = useUploadWithJobs({
    endpoint: 'https://dev.huntdigital.com.br/projeto-amazon/atualizacao-estoque',
    jobType: 'price_stock',
  });

  const completedStockJobs = completedJobs.filter(job => job.type === 'price_stock');

  const validateFile = (file: File) => {
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidExtension) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie apenas arquivos Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
      return false;
    }
    
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 25MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileSelection = useCallback((file: File) => {
    if (!validateFile(file)) return;
    
    setPendingFile(file);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmUpload = useCallback(async () => {
    if (!pendingFile) return;
    
    setShowConfirmModal(false);
    const jobId = await uploadFile(pendingFile);
    if (jobId) {
      setUploadedFile(pendingFile);
    }
    setPendingFile(null);
  }, [pendingFile, uploadFile]);

  const handleCancelUpload = useCallback(() => {
    setShowConfirmModal(false);
    setPendingFile(null);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    const jobId = await uploadFile(file);
    if (jobId) {
      setUploadedFile(file);
    }
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [handleFileSelection]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input onChange triggered');
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('File selected:', files[0].name);
      handleFileSelection(files[0]);
    }
    // Reset input value para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const downloadFile = (downloadData: { file: string; filename: string }) => {
    try {
      const byteCharacters = atob(downloadData.file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download realizado!",
        description: "A planilha foi baixada com sucesso.",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível fazer o download da planilha.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!selectedUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" style={{ color: '#2563EB' }}/>
            <span>Atualização de Estoque</span>
          </CardTitle>
          <CardDescription>
            Selecione um usuário para atualizar o estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Por favor, selecione um usuário primeiro
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-orange-600" />
            <span>Atualização de Estoque</span>
          </CardTitle>
          <CardDescription>
            Faça o upload da sua planilha para atualizar preços e estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Jobs concluídos com download */}
          {completedStockJobs.length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Processos finalizados:</h4>
              {completedStockJobs.map((job) => (
                <div key={job.id} className={`p-3 rounded-lg border ${
                  job.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className={`w-4 h-4 ${
                        job.status === 'completed' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {job.status === 'completed' ? 'Concluído' : `Falhou: ${job.error}`}
                        </p>
                      </div>
                    </div>
                    {job.status === 'completed' && job.downloadData && (
                      <Button
                        size="sm"
                        onClick={() => downloadFile(job.downloadData!)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragOver ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <Upload className={`w-8 h-8 ${isDragOver ? 'text-orange-600' : 'text-gray-400'}`} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isDragOver ? 'Solte o arquivo aqui' : 'Arraste e solte sua planilha'}
                  </h3>
                  <p className="text-gray-500">
                    ou
                  </p>
                </div>
                
                <div className="relative inline-block">
                  <Button variant="outline" disabled={isUploading}>
                    {isUploading ? 'Enviando...' : 'Selecionar arquivo'}
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                    disabled={isUploading}
                  />
                </div>
                
                <p className="text-xs text-gray-400">
                  Apenas arquivos Excel (.xlsx, .xls) até 25MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.size)} • {isUploading ? 'Processando...' : 'Processamento iniciado'}
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={removeFile}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Atualizar outro arquivo
                </Button>
                <Button 
                  disabled={isUploading}
                  className="flex-1"
                  onClick={() => handleFileUpload(uploadedFile)}
                >
                  {isUploading ? 'Processando...' : 'Reprocessar'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UploadConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelUpload}
        onConfirm={handleConfirmUpload}
        fileName={pendingFile?.name || ''}
        fileSize={pendingFile ? formatFileSize(pendingFile.size) : ''}
        uploadType="price_stock"
      />
    </>
  );
};
