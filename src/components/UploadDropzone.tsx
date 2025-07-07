import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle, TrendingUp, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useUserContext } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { getActiveToken } from '@/utils/auth';

interface ProcessResponse {
  status: string;
  message: string;
  jobId?: string;
}

interface OfertaResult {
  gtin: string;
  sku: string;
  status: string;
  preco: number;
  estoque: number;
  asin: string;
  restricao: string;
  tem_restricoes: boolean;
}

interface JobStatus {
  id: string;
  userName: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: OfertaResult[];
  error?: string;
  startTime: string;
  endTime?: string;
  totalItems?: number;
  processedItems?: number;
  currentItem?: string;
}

export const UploadDropzone = () => {
  const { selectedUser } = useUserContext();
  const { currentUser } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processResponse, setProcessResponse] = useState<ProcessResponse | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

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

  const monitorJob = useCallback((jobId: string) => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    console.log('Starting SSE monitoring for ofertas job:', jobId);
    
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/ofertas-relatorio/${jobId}`);
    
    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      try {
        const jobData: JobStatus = JSON.parse(event.data);
        setJobStatus(jobData);
        
        if (jobData.status === 'completed') {
          console.log('Job completed!');
          eventSource.close();
          setIsMonitoring(false);
          
          toast({
            title: "Processamento concluído!",
            description: "O processamento das ofertas foi finalizado com sucesso.",
          });
        } else if (jobData.status === 'failed') {
          console.log('Job failed:', jobData.error);
          eventSource.close();
          setIsMonitoring(false);
          
          toast({
            title: "Erro no processamento",
            description: jobData.error || "Ocorreu um erro durante o processamento.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      setIsMonitoring(false);
      
      toast({
        title: "Erro de conexão",
        description: "Erro ao monitorar o progresso do processamento.",
        variant: "destructive",
      });
    };
    
    return () => {
      eventSource.close();
      setIsMonitoring(false);
    };
  }, [isMonitoring]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    
    if (!currentUser || !currentUser.sellerId) {
      toast({
        title: "Usuário inválido",
        description: "Por favor, faça login com um usuário com sellerId válido.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setProcessResponse(null);
    setJobStatus(null);
    
    try {
      const token = getActiveToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const formData = new FormData();
      formData.append('usuario', currentUser.user);
      formData.append('sellerId', currentUser.sellerId);
      formData.append('file', file);

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/processar-ofertas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar ofertas');
      }

      const data: ProcessResponse = await response.json();
      console.log('Response data:', data);
      
      setProcessResponse(data);
      
      toast({
        title: "Processamento iniciado!",
        description: data.message || "O processamento foi iniciado com sucesso.",
      });

      // Iniciar monitoramento via SSE se temos um jobId
      if (data.jobId) {
        monitorJob(data.jobId);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no processamento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setUploadedFile(null);
      setProcessResponse(null);
    } finally {
      setIsUploading(false);
    }
  }, [selectedUser, monitorJob]);

  const handleDownloadReport = () => {
    if (processResponse?.jobId) {
      const downloadUrl = `https://dev.huntdigital.com.br/projeto-amazon/ofertas-download/${processResponse.jobId}`;
      window.open(downloadUrl, '_blank');
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
    setProcessResponse(null);
    setJobStatus(null);
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
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Publicar Ofertas</span>
          </CardTitle>
          <CardDescription>
            Selecione um usuário para publicar suas ofertas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
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
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Publicar Ofertas</span>
        </CardTitle>
        <CardDescription>
          Faça o upload da sua planilha preenchida para publicar ofertas
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
                    <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
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
              {!isUploading && !isMonitoring && !jobStatus && (
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

            {/* Resposta do processamento */}
            {processResponse && (
              <Alert className={`${processResponse.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${processResponse.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex items-center space-x-2">
                    {processResponse.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <Badge variant={processResponse.status === 'success' ? 'default' : 'destructive'} className="capitalize">
                      {processResponse.status}
                    </Badge>
                  </div>
                </div>
                <AlertDescription className="mt-2 text-sm">
                  {processResponse.message}
                  {processResponse.jobId && (
                    <div className="mt-1 text-xs text-gray-500">
                      ID do Job: {processResponse.jobId}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Status do Job */}
            {jobStatus && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {jobStatus.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : jobStatus.status === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {jobStatus.status === 'completed' ? 'Processamento Concluído' : 
                         jobStatus.status === 'failed' ? 'Processamento Falhou' : 
                         'Processando Ofertas...'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Progresso: {jobStatus.progress}%
                        {jobStatus.totalItems && ` • Total: ${jobStatus.totalItems} itens`}
                        {jobStatus.currentItem && ` • Processando: ${jobStatus.currentItem}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Barra de progresso */}
                <Progress value={jobStatus.progress} className="mb-3" />

                {jobStatus.error && (
                  <div className="mt-3 text-sm text-red-600">
                    Erro: {jobStatus.error}
                  </div>
                )}

                {/* Botão de download quando concluído */}
                {jobStatus.status === 'completed' && processResponse?.jobId && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleDownloadReport}
                      className="w-full flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar Relatório</span>
                    </Button>
                  </div>
                )}

                {jobStatus.results && jobStatus.results.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-gray-900">Resultados do Processamento:</h5>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {jobStatus.results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              result.status === 'SUCESSO' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-sm">SKU: {result.sku} • GTIN: {result.gtin}</p>
                              <p className="text-xs text-gray-500">
                                {result.status === 'SUCESSO' ? 
                                  `Preço: R$ ${result.preco} • Estoque: ${result.estoque} • ASIN: ${result.asin}` :
                                  'Erro no processamento'
                                }
                              </p>
                              {result.restricao && (
                                <p className={`text-xs ${result.tem_restricoes ? 'text-orange-600' : 'text-green-600'}`}>
                                  {result.restricao}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={result.status === 'SUCESSO' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={removeFile}
                disabled={isUploading || isMonitoring}
                className="flex-1"
              >
                Processar outro arquivo
              </Button>
              {!isUploading && !isMonitoring && processResponse && !jobStatus && (
                <Button 
                  className="flex-1"
                  onClick={() => handleFileUpload(uploadedFile)}
                >
                  Processar novamente
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
