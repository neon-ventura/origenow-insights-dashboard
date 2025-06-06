
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle, Download, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/contexts/UserContext';

export const UploadDropzone = () => {
  const { selectedUser } = useUserContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const isValidType = allowedTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type)
    );
    
    if (!isValidType) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie apenas arquivos Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
      return false;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const startCountdown = (jobId: string) => {
    setCountdown(30);
    setJobId(jobId);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDownloadReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    
    if (!selectedUser) {
      toast({
        title: "Usuário não selecionado",
        description: "Por favor, selecione um usuário antes de fazer o upload.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setJobId(null);
    setIsDownloadReady(false);
    setCountdown(0);
    
    try {
      const formData = new FormData();
      formData.append('usuario', selectedUser.user);
      formData.append('sellerId', selectedUser.sellerId);
      formData.append('file', file);

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/processar-ofertas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar ofertas');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      toast({
        title: "Arquivo enviado com sucesso!",
        description: `${file.name} está sendo processado.`,
      });

      // Assumindo que a resposta contém o jobId
      if (data.jobId) {
        startCountdown(data.jobId);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [selectedUser]);

  const handleDownload = async () => {
    if (!jobId) return;

    try {
      const response = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/ofertas-download/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao baixar o arquivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ofertas-processadas-${jobId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download realizado com sucesso!",
        description: "O arquivo foi salvo em seus downloads.",
      });
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast({
        title: "Erro no download",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setJobId(null);
    setIsDownloadReady(false);
    setCountdown(0);
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
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload de Ofertas</span>
          </CardTitle>
          <CardDescription>
            Selecione um usuário para fazer o upload de ofertas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <span>Upload de Ofertas</span>
        </CardTitle>
        <CardDescription>
          Faça o upload da sua planilha de ofertas preenchida
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isDragOver ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {isDragOver ? 'Solte o arquivo aqui' : 'Arraste e solte sua planilha'}
                </h3>
                <p className="text-gray-500">
                  ou
                </p>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="relative">
                  Selecionar arquivo
                </Button>
              </div>
              
              <p className="text-xs text-gray-400">
                Apenas arquivos Excel (.xlsx, .xls) até 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.size)} • {isUploading ? 'Processando...' : 'Processado com sucesso'}
                  </p>
                </div>
              </div>
              {!isUploading && !jobId && (
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
            
            {jobId && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {countdown > 0 ? (
                        <Clock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Download className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {countdown > 0 ? 'Download será liberado em:' : 'Download liberado!'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {countdown > 0 ? `${countdown} segundos` : 'Clique no botão para baixar o arquivo processado'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDownload}
                    disabled={countdown > 0}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{countdown > 0 ? countdown : 'Baixar'}</span>
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={removeFile}
                disabled={isUploading}
                className="flex-1"
              >
                Enviar outro arquivo
              </Button>
              {!jobId && (
                <Button 
                  disabled={isUploading}
                  className="flex-1"
                  onClick={() => handleFileUpload(uploadedFile)}
                >
                  {isUploading ? 'Processando...' : 'Reprocessar'}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
