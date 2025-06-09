
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle, Search, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/contexts/UserContext';

interface VerifyResponse {
  status: string;
  message: string;
  jobId?: string;
}

interface JobStatus {
  id: string;
  userName: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: Array<{
    gtin: string;
    in_amazon: boolean;
  }>;
  error?: string;
  startTime: string;
  endTime?: string;
  currentGtin?: string;
  file?: string;
  filename?: string;
}

export const GtinUploadDropzone = () => {
  const { selectedUser } = useUserContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verifyResponse, setVerifyResponse] = useState<VerifyResponse | null>(null);
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
    console.log('Starting SSE monitoring for job:', jobId);
    
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/job/${jobId}`);
    
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
            title: "Verificação concluída!",
            description: "A verificação dos GTINs foi finalizada com sucesso.",
          });
        } else if (jobData.status === 'failed') {
          console.log('Job failed:', jobData.error);
          eventSource.close();
          setIsMonitoring(false);
          
          toast({
            title: "Erro na verificação",
            description: jobData.error || "Ocorreu um erro durante a verificação.",
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
        description: "Erro ao monitorar o progresso da verificação.",
        variant: "destructive",
      });
    };
    
    return () => {
      eventSource.close();
      setIsMonitoring(false);
    };
  }, [isMonitoring]);

  const downloadExcelFile = useCallback(() => {
    if (!jobStatus?.file || !jobStatus?.filename) {
      toast({
        title: "Erro no download",
        description: "Arquivo não disponível para download.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Converter base64 para blob
      const byteCharacters = atob(jobStatus.file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = jobStatus.filename;
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
  }, [jobStatus]);

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
    setJobStatus(null);
    
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

      // Iniciar monitoramento via SSE se temos um jobId
      if (data.jobId) {
        monitorJob(data.jobId);
      }
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
  }, [selectedUser, monitorJob]);

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
                        {jobStatus.status === 'completed' ? 'Verificação Concluída' : 
                         jobStatus.status === 'failed' ? 'Verificação Falhou' : 
                         'Verificando GTINs...'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Progresso: {jobStatus.progress}%
                        {jobStatus.currentGtin && ` • Verificando: ${jobStatus.currentGtin}`}
                      </p>
                    </div>
                  </div>
                  {jobStatus.status === 'completed' && jobStatus.file && (
                    <Button onClick={downloadExcelFile} className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Baixar Resultado</span>
                    </Button>
                  )}
                </div>
                
                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      jobStatus.status === 'completed' ? 'bg-green-500' : 
                      jobStatus.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${jobStatus.progress}%` }}
                  />
                </div>

                {jobStatus.error && (
                  <div className="mt-3 text-sm text-red-600">
                    Erro: {jobStatus.error}
                  </div>
                )}

                {jobStatus.results && jobStatus.results.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    {jobStatus.results.length} GTINs verificados
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
                Verificar outro arquivo
              </Button>
              {!isUploading && !isMonitoring && verifyResponse && !jobStatus && (
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
