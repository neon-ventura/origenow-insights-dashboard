
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/contexts/UserContext';

interface VerifyResponse {
  status: string;
  message: string;
  jobId?: string;
}

export const GtinUploadDropzone = () => {
  const { selectedUser } = useUserContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verifyResponse, setVerifyResponse] = useState<VerifyResponse | null>(null);

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

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    
    if (!selectedUser || !selectedUser.sellerId) {
      toast({
        title: "Usuário inválido",
        description: "Por favor, selecione um usuário com sellerId válido.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setVerifyResponse(null);
    
    try {
      const formData = new FormData();
      formData.append('userName', selectedUser.user);
      formData.append('sellerId', selectedUser.sellerId);
      formData.append('file', file);

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/verify-gtins', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar GTINs');
      }

      const data: VerifyResponse = await response.json();
      console.log('Response data:', data);
      
      setVerifyResponse(data);
      
      toast({
        title: "Verificação iniciada!",
        description: data.message || "A verificação foi iniciada com sucesso.",
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro na verificação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setUploadedFile(null);
      setVerifyResponse(null);
    } finally {
      setIsUploading(false);
    }
  }, [selectedUser]);

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
    setVerifyResponse(null);
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
            <Search className="w-5 h-5 text-blue-600" />
            <span>Verificação de GTINs</span>
          </CardTitle>
          <CardDescription>
            Selecione um usuário para fazer a verificação de GTINs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
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
          <Search className="w-5 h-5 text-blue-600" />
          <span>Verificação de GTINs</span>
        </CardTitle>
        <CardDescription>
          Faça o upload da sua planilha preenchida para verificação
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
                    {formatFileSize(uploadedFile.size)} • {isUploading ? 'Enviando...' : 'Upload concluído'}
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

            {/* Resposta da verificação */}
            {verifyResponse && (
              <Alert className={`${verifyResponse.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${verifyResponse.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex items-center space-x-2">
                    {verifyResponse.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <Badge variant={verifyResponse.status === 'success' ? 'default' : 'destructive'} className="capitalize">
                      {verifyResponse.status}
                    </Badge>
                  </div>
                </div>
                <AlertDescription className="mt-2 text-sm">
                  {verifyResponse.message}
                  {verifyResponse.jobId && (
                    <div className="mt-1 text-xs text-gray-500">
                      ID do Job: {verifyResponse.jobId}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={removeFile}
                disabled={isUploading}
                className="flex-1"
              >
                Verificar outro arquivo
              </Button>
              {!isUploading && verifyResponse && (
                <Button 
                  className="flex-1"
                  onClick={() => handleFileUpload(uploadedFile)}
                >
                  Verificar novamente
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
