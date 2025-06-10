
import { useCallback, useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface UseUploadWithJobsProps {
  endpoint: string;
  jobType: 'gtin' | 'ofertas' | 'estoque';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useUploadWithJobs = ({ endpoint, jobType, onSuccess, onError }: UseUploadWithJobsProps) => {
  const { selectedUser } = useUserContext();
  const { addJob, updateJob } = useJobs();
  const [isUploading, setIsUploading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

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

  const uploadFile = useCallback(async (file: File) => {
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
    
    // Criar job no contexto
    const jobId = addJob({
      type: jobType,
      status: 'pending',
      progress: 0,
      fileName: file.name,
      userName: selectedUser.user,
      sellerId: selectedUser.sellerId,
    });
    
    setActiveJobId(jobId);

    try {
      const formData = new FormData();
      
      // Usar parâmetros corretos para cada tipo de job
      if (jobType === 'estoque') {
        formData.append('usuario', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
      } else if (jobType === 'ofertas') {
        formData.append('usuario', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
      } else {
        formData.append('userName', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
      }
      
      formData.append('file', file);

      updateJob(jobId, { status: 'processing', progress: 10 });

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao processar ${jobType}`);
      }

      const data = await response.json();
      
      // Se temos um jobId da API, usar SSE para monitorar
      if (data.jobId) {
        if (jobType === 'estoque') {
          monitorEstoqueProgress(jobId, data.jobId);
        } else if (jobType === 'gtin') {
          monitorGtinProgress(jobId, data.jobId);
        } else {
          monitorJobProgress(jobId, data.jobId);
        }
      } else {
        // Processar resultado direto
        updateJob(jobId, { 
          status: 'completed', 
          progress: 100,
          endTime: new Date().toISOString(),
          results: data
        });
      }
      
      onSuccess?.(data);
      return jobId;
    } catch (error) {
      console.error('Erro no upload:', error);
      updateJob(jobId, { 
        status: 'failed', 
        progress: 0,
        endTime: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      onError?.(error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedUser, addJob, updateJob, jobType, endpoint, onSuccess, onError, validateFile]);

  const monitorGtinProgress = useCallback((contextJobId: string, apiJobId: string) => {
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/job/${apiJobId}`);
    
    eventSource.onmessage = (event) => {
      try {
        const jobData = JSON.parse(event.data);
        
        updateJob(contextJobId, {
          status: jobData.status,
          progress: jobData.progress,
          results: jobData.results,
          error: jobData.error,
        });
        
        if (jobData.status === 'completed' || jobData.status === 'failed') {
          // Para GTIN, o arquivo vem direto no response
          if (jobData.file && jobData.filename) {
            updateJob(contextJobId, {
              downloadData: {
                file: jobData.file,
                filename: jobData.filename
              }
            });
          }
          
          updateJob(contextJobId, { endTime: new Date().toISOString() });
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      updateJob(contextJobId, { 
        status: 'failed', 
        error: 'Erro de conexão durante o monitoramento',
        endTime: new Date().toISOString()
      });
    };
  }, [updateJob]);

  const monitorEstoqueProgress = useCallback((contextJobId: string, apiJobId: string) => {
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/atualizacao-relatorio/${apiJobId}`);
    
    eventSource.onmessage = (event) => {
      try {
        const jobData = JSON.parse(event.data);
        
        updateJob(contextJobId, {
          status: jobData.status,
          progress: jobData.progress,
          results: jobData.results,
          error: jobData.error,
        });
        
        if (jobData.status === 'completed') {
          handleEstoqueDownload(contextJobId, apiJobId);
          eventSource.close();
        } else if (jobData.status === 'failed') {
          updateJob(contextJobId, { endTime: new Date().toISOString() });
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      updateJob(contextJobId, { 
        status: 'failed', 
        error: 'Erro de conexão durante o monitoramento',
        endTime: new Date().toISOString()
      });
    };
  }, [updateJob]);

  const handleEstoqueDownload = useCallback(async (contextJobId: string, apiJobId: string) => {
    try {
      const downloadResponse = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/atualizacao-download/${apiJobId}`);
      
      if (!downloadResponse.ok) {
        throw new Error('Erro ao fazer download do arquivo de estoque');
      }
      
      const blob = await downloadResponse.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove o prefixo data:application/...;base64,
        };
        reader.readAsDataURL(blob);
      });
      
      updateJob(contextJobId, {
        status: 'completed',
        progress: 100,
        downloadData: {
          file: base64,
          filename: `estoque_atualizado_${apiJobId}.xlsx`
        },
        endTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro no download de estoque:', error);
      updateJob(contextJobId, {
        status: 'failed',
        error: 'Erro ao fazer download do arquivo processado',
        endTime: new Date().toISOString()
      });
    }
  }, [updateJob]);

  const monitorJobProgress = useCallback((contextJobId: string, apiJobId: string) => {
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/job/${apiJobId}`);
    
    eventSource.onmessage = (event) => {
      try {
        const jobData = JSON.parse(event.data);
        
        // Para ofertas, quando completo, fazer download do arquivo
        if (jobData.status === 'completed' && jobType === 'ofertas') {
          handleOfertasDownload(contextJobId, apiJobId);
        } else {
          updateJob(contextJobId, {
            status: jobData.status,
            progress: jobData.progress,
            results: jobData.results,
            error: jobData.error,
            downloadData: jobData.file && jobData.filename ? {
              file: jobData.file,
              filename: jobData.filename
            } : undefined
          });
        }
        
        if (jobData.status === 'completed' || jobData.status === 'failed') {
          updateJob(contextJobId, { endTime: new Date().toISOString() });
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      updateJob(contextJobId, { 
        status: 'failed', 
        error: 'Erro de conexão durante o monitoramento',
        endTime: new Date().toISOString()
      });
    };
  }, [updateJob, jobType]);

  const handleOfertasDownload = useCallback(async (contextJobId: string, apiJobId: string) => {
    try {
      const downloadResponse = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/ofertas-download/${apiJobId}`);
      
      if (!downloadResponse.ok) {
        throw new Error('Erro ao fazer download do arquivo de ofertas');
      }
      
      const blob = await downloadResponse.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove o prefixo data:application/...;base64,
        };
        reader.readAsDataURL(blob);
      });
      
      updateJob(contextJobId, {
        status: 'completed',
        progress: 100,
        downloadData: {
          file: base64,
          filename: `ofertas_processadas_${apiJobId}.xlsx`
        }
      });
    } catch (error) {
      console.error('Erro no download de ofertas:', error);
      updateJob(contextJobId, {
        status: 'failed',
        error: 'Erro ao fazer download do arquivo processado'
      });
    }
  }, [updateJob]);

  return {
    uploadFile,
    isUploading,
    activeJobId,
  };
};
