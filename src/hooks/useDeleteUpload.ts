
import { useCallback, useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useUserContext } from '@/contexts/UserContext';
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext';
import { toast } from '@/hooks/use-toast';
import { getActiveToken } from '@/utils/auth';
import { SSEClient } from '@/utils/sseClient';

export const useDeleteUpload = () => {
  const { selectedUser } = useUserContext();
  const { addJob, updateJob } = useJobs();
  const { showLoading, hideLoading, updateProgress } = useGlobalLoading();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback((file: File) => {
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
  }, []);

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
        description: "A planilha foi baixada automaticamente.",
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

  const handleDownload = useCallback(async (contextJobId: string, apiJobId: string) => {
    try {
      const token = getActiveToken();
      console.log(`Fazendo download do arquivo para jobId: ${apiJobId}`);
      const downloadResponse = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/deletar-skus-download/${apiJobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!downloadResponse.ok) {
        throw new Error('Erro ao fazer download do arquivo');
      }
      
      const blob = await downloadResponse.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });
      
      const downloadData = {
        file: base64,
        filename: `skus_deletados_${apiJobId}.xlsx`
      };
      
      updateJob(contextJobId, {
        status: 'completed',
        progress: 100,
        downloadData,
        endTime: new Date().toISOString()
      });
      
      downloadFile(downloadData);
      hideLoading();
    } catch (error) {
      console.error('Erro no download:', error);
      updateJob(contextJobId, {
        status: 'failed',
        error: 'Erro ao fazer download do arquivo processado',
        endTime: new Date().toISOString()
      });
      hideLoading();
    }
  }, [updateJob, hideLoading]);

  const monitorDeleteProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento de deletar SKUs para jobId:', apiJobId);
    
    const sseClient = new SSEClient(
      `https://dev.huntdigital.com.br/projeto-amazon/deletar-skus-relatorio/${apiJobId}`,
      {
        onMessage: (event) => {
          try {
            console.log('Delete SKUs SSE message received:', event.data);
            
            if (!event.data || event.data.trim() === '') {
              console.log('Received empty data, skipping...');
              return;
            }
            
            const data = JSON.parse(event.data);
            console.log('Parsed delete data:', data);
            
            const jobData = data.job || data;
            const progress = jobData.progress || 0;
            
            console.log('Delete job data:', jobData);
            console.log('Delete Progress:', progress);
            
            setProgress(progress);
            updateProgress(progress);
            
            showLoading(
              'Deletando SKUs',
              `Processando dados...`,
              progress
            );
            
            updateJob(contextJobId, {
              status: jobData.status === 'completed' ? 'completed' : 'processing',
              progress: progress,
              results: {
                job: jobData,
                items: data.items || [],
                processedItems: data.items?.length || jobData.processed_items,
                totalItems: data.items?.length || jobData.total_items
              }
            });
            
            if (jobData.status === 'completed') {
              console.log('Delete Job completed, fechando SSE e iniciando download...');
              sseClient.close();
              handleDownload(contextJobId, apiJobId);
            } else if (jobData.status === 'failed') {
              console.error('Delete Job failed:', jobData.error);
              updateJob(contextJobId, { 
                status: 'failed',
                error: jobData.error || 'Processo falhou',
                endTime: new Date().toISOString() 
              });
              hideLoading();
              sseClient.close();
            }
          } catch (error) {
            console.error('Error processing delete SSE data:', error);
          }
        },
        onError: (error) => {
          console.error('Delete SSE error:', error);
          
          if (sseClient.getReadyState() === EventSource.CLOSED) {
            updateJob(contextJobId, { 
              status: 'failed', 
              error: 'Conexão SSE foi encerrada inesperadamente',
              endTime: new Date().toISOString()
            });
            hideLoading();
          }
        },
        onOpen: () => {
          console.log('Delete SSE connection opened successfully');
        }
      }
    );
    
    sseClient.connect();
  }, [updateJob, hideLoading, updateProgress, showLoading, handleDownload]);

  const uploadFile = useCallback(async (file: File, type: string) => {
    if (!validateFile(file)) return null;
    
    if (!selectedUser) {
      toast({
        title: "Usuário não selecionado",
        description: "Por favor, selecione um usuário antes de fazer o upload.",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    showLoading(
      'Deletando SKUs',
      'Aguarde enquanto processamos seu arquivo...',
      0
    );
    
    // Criar job no contexto
    const jobId = addJob({
      type: 'ofertas', // Mantendo como 'ofertas' para compatibilidade com o contexto
      status: 'pending',
      progress: 0,
      fileName: file.name,
      userName: selectedUser.user,
      sellerId: selectedUser.sellerId,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      updateJob(jobId, { status: 'processing', progress: 10 });
      updateProgress(10);

      const token = getActiveToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/deletar-sku-em-massa', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar deletar SKUs');
      }

      const data = await response.json();
      console.log('Delete response data:', data);
      
      // Verificar se temos um jobId da API
      if (data.jobId) {
        monitorDeleteProgress(jobId, data.jobId);
      } else {
        // Processar resultado direto se não houver jobId
        updateJob(jobId, { 
          status: 'completed', 
          progress: 100,
          endTime: new Date().toISOString(),
          results: data
        });
        hideLoading();
      }
      
      return jobId;
    } catch (error) {
      console.error('Erro no upload:', error);
      updateJob(jobId, { 
        status: 'failed', 
        progress: 0,
        endTime: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      hideLoading();
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedUser, addJob, updateJob, validateFile, showLoading, hideLoading, updateProgress, monitorDeleteProgress]);

  return {
    uploadFile,
    isUploading,
    progress,
  };
};
