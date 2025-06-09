
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/contexts/UserContext';
import { StockResults } from '@/components/StockResults';

interface StockResult {
  sku: number;
  status: string;
  mensagem: string;
}

interface StockResponse {
  mensagem: string;
  resultados: StockResult[];
}

export const StockUploadDropzone = () => {
  const { selectedUser } = useUserContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<StockResponse | null>(null);

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
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('usuario', selectedUser.user);
      formData.append('sellerId', selectedUser.sellerId);
      formData.append('file', file);

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/atualizar-preco-estoque', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar atualização de estoque');
      }

      const data: StockResponse = await response.json();
      console.log('Response data:', data);
      
      setResults(data);
      
      toast({
        title: "Arquivo processado com sucesso!",
        description: `${file.name} foi processado. Verifique os resultados abaixo.`,
      });
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
    setResults(null);
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
            <span>Upload para Atualização de Estoque</span>
          </CardTitle>
          <CardDescription>
            Selecione um usuário para fazer o upload da planilha de atualização
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload para Atualização de Estoque</span>
          </CardTitle>
          <CardDescription>
            Faça o upload da sua planilha de atualização de estoque preenchida
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
                  Enviar outro arquivo
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

      {/* Resultados */}
      {results && <StockResults results={results} />}
    </div>
  );
};
