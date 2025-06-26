import { useCallback, useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useUserContext } from '@/contexts/UserContext';
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext';
import { toast } from '@/hooks/use-toast';

interface UseUploadWithJobsProps {
  endpoint: string;
  jobType: 'verification' | 'ofertas' | 'price_stock';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useUploadWithJobs = ({ endpoint, jobType, onSuccess, onError }: UseUploadWithJobsProps) => {
  const { selectedUser } = useUserContext();
  const { addJob, updateJob } = useJobs();
  const { showLoading, hideLoading, updateProgress } = useGlobalLoading();
  const [isUploading, setIsUploading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const getJobTypeName = (type: string) => {
    switch (type) {
      case 'verification': return 'Verificação de GTIN';
      case 'ofertas': return 'Publicação de Ofertas';
      case 'price_stock': return 'Atualização de Estoque';
      default: return 'Processamento';
    }
  };

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
    showLoading(
      `Processando ${getJobTypeName(jobType)}`,
      'Aguarde enquanto processamos seu arquivo...',
      0
    );
    
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
      
      // Configurar formData baseado no tipo de job
      if (jobType === 'verification') {
        formData.append('userName', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
        formData.append('file', file);
      } else if (jobType === 'price_stock') {
        formData.append('usuario', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
        formData.append('file', file);
      } else if (jobType === 'ofertas') {
        formData.append('usuario', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
        formData.append('file', file);
      }

      updateJob(jobId, { status: 'processing', progress: 10 });
      updateProgress(10);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao processar ${jobType}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Verificar se temos um jobId da API
      if (data.jobId) {
        if (jobType === 'verification') {
          monitorGtinProgress(jobId, data.jobId);
        } else if (jobType === 'price_stock') {
          monitorEstoqueProgress(jobId, data.jobId);
        } else if (jobType === 'ofertas') {
          monitorOfertasProgress(jobId, data.jobId);
        }
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
      hideLoading();
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedUser, addJob, updateJob, jobType, endpoint, onSuccess, onError, validateFile, showLoading, hideLoading, updateProgress]);

  const monitorGtinProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento GTIN para jobId:', apiJobId);
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/verify-gtins-relatorio/${apiJobId}`);
    
    eventSource.onmessage = (event) => {
      try {
        console.log('SSE message received:', event.data);
        const data = JSON.parse(event.data);
        
        // A estrutura agora é: {job: {...}, items: [...]}
        const jobData = data.job;
        const items = data.items || [];
        
        // Usar o progresso diretamente da API se disponível, senão calcular
        const apiProgress = jobData.progress;
        const totalItems = jobData.total_items || items.length;
        const processedItems = items.length;
        const calculatedProgress = totalItems > 0 ? Math.round((processedItems / totalItems) * 100) : 0;
        const progress = apiProgress || calculatedProgress;
        
        // Atualizar progresso no modal
        updateProgress(progress);
        
        // Mostrar GTINs sendo verificados no modal
        if (items.length > 0) {
          const currentGtins = items.slice(-3).map((item: any) => item.gtin).join(', ');
          showLoading(
            'Verificando GTINs',
            `Verificando: ${currentGtins}${items.length > 3 ? '...' : ''}`,
            progress
          );
        }
        
        updateJob(contextJobId, {
          status: jobData.status === 'completed' ? 'completed' : 'processing',
          progress: progress,
          results: {
            job: jobData,
            items: items,
            processedItems,
            totalItems,
            currentItems: items
          }
        });
        
        if (jobData.status === 'completed') {
          console.log('Job completed, iniciando download...');
          handleGtinDownload(contextJobId, apiJobId);
          eventSource.close();
        } else if (jobData.status === 'failed') {
          updateJob(contextJobId, { 
            status: 'failed',
            error: jobData.error || 'Processo falhou',
            endTime: new Date().toISOString() 
          });
          hideLoading();
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Não fechar imediatamente, pode ser temporário
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          updateJob(contextJobId, { 
            status: 'failed', 
            error: 'Erro de conexão durante o monitoramento',
            endTime: new Date().toISOString()
          });
          hideLoading();
        }
      }, 5000);
    };
    
    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };
  }, [updateJob, hideLoading, updateProgress, showLoading]);

  const handleGtinDownload = useCallback(async (contextJobId: string, apiJobId: string) => {
    try {
      console.log('Fazendo download do arquivo GTIN para jobId:', apiJobId);
      const downloadResponse = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/verify-gtins-download/${apiJobId}`);
      
      if (!downloadResponse.ok) {
        throw new Error('Erro ao fazer download do arquivo de GTIN');
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
      
      const downloadData = {
        file: base64,
        filename: `gtins_verificados_${apiJobId}.xlsx`
      };
      
      updateJob(contextJobId, {
        status: 'completed',
        progress: 100,
        downloadData,
        endTime: new Date().toISOString()
      });
      
      // Download automático
      downloadFile(downloadData);
      hideLoading();
    } catch (error) {
      console.error('Erro no download de GTIN:', error);
      updateJob(contextJobId, {
        status: 'failed',
        error: 'Erro ao fazer download do arquivo processado',
        endTime: new Date().toISOString()
      });
      hideLoading();
    }
  }, [updateJob, hideLoading, downloadFile]);

  const monitorEstoqueProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento de estoque para jobId:', apiJobId);
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/atualizacao-relatorio/${apiJobId}`);
    
    eventSource.onmessage = (event) => {
      try {
        console.log('Estoque SSE message received:', event.data);
        
        // Verificar se a resposta está vazia ou não é JSON válido
        if (!event.data || event.data.trim() === '') {
          console.log('Received empty data, skipping...');
          return;
        }
        
        // Tentar fazer parse do JSON com tratamento de erro mais específico
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Raw data received:', event.data);
          // Se não conseguir fazer parse, ignorar esta mensagem e continuar
          return;
        }
        
        // Verificar se os dados têm a estrutura esperada
        if (!data || !data.job) {
          console.log('Data structure not as expected:', data);
          return;
        }
        
        const jobData = data.job;
        const items = data.items || [];
        
        // Usar o progresso da API se disponível
        const progress = jobData.progress || 0;
        
        // Atualizar progresso no modal
        updateProgress(progress);
        
        // Mostrar SKUs sendo processados no modal
        if (items.length > 0) {
          const currentSkus = items.slice(-3).map((item: any) => item.sku || item.item_id).filter(Boolean).join(', ');
          const statusMessages = items.slice(-3).map((item: any) => {
            if (item.status === 'not_found') return `${item.sku || item.item_id}: Não encontrado`;
            if (item.status === 'updated') return `${item.sku || item.item_id}: Atualizado`;
            if (item.status === 'error') return `${item.sku || item.item_id}: Erro`;
            return `${item.sku || item.item_id}: ${item.status}`;
          });
          
          showLoading(
            'Atualizando Estoque',
            `Processando: ${currentSkus}${items.length > 3 ? '...' : ''}`,
            progress
          );
        }
        
        updateJob(contextJobId, {
          status: jobData.status === 'completed' ? 'completed' : 'processing',
          progress: progress,
          results: {
            job: jobData,
            items: items,
            processedItems: items.length,
            totalItems: jobData.total_items
          }
        });
        
        if (jobData.status === 'completed') {
          console.log('Job de estoque completed, iniciando download...');
          handleEstoqueDownload(contextJobId, apiJobId);
          eventSource.close();
        } else if (jobData.status === 'failed') {
          updateJob(contextJobId, { 
            status: 'failed',
            error: jobData.error || 'Processo falhou',
            endTime: new Date().toISOString() 
          });
          hideLoading();
          eventSource.close();
        }
      } catch (error) {
        console.error('Error processing estoque SSE data:', error);
        console.error('Event data:', event.data);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('Estoque SSE error:', error);
      console.error('EventSource readyState:', eventSource.readyState);
      
      // Se a conexão foi fechada permanentemente, marcar como falha
      if (eventSource.readyState === EventSource.CLOSED) {
        updateJob(contextJobId, { 
          status: 'failed', 
          error: 'Conexão SSE foi encerrada inesperadamente',
          endTime: new Date().toISOString()
        });
        hideLoading();
      }
    };
    
    eventSource.onopen = () => {
      console.log('Estoque SSE connection opened');
    };
  }, [updateJob, hideLoading, updateProgress, showLoading]);

  const handleEstoqueDownload = useCallback(async (contextJobId: string, apiJobId: string) => {
    try {
      console.log('Fazendo download do arquivo de estoque para jobId:', apiJobId);
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
      
      const downloadData = {
        file: base64,
        filename: `estoque_atualizado_${apiJobId}.xlsx`
      };
      
      updateJob(contextJobId, {
        status: 'completed',
        progress: 100,
        downloadData,
        endTime: new Date().toISOString()
      });
      
      // Download automático
      downloadFile(downloadData);
      hideLoading();
    } catch (error) {
      console.error('Erro no download de estoque:', error);
      updateJob(contextJobId, {
        status: 'failed',
        error: 'Erro ao fazer download do arquivo processado',
        endTime: new Date().toISOString()
      });
      hideLoading();
    }
  }, [updateJob, hideLoading, downloadFile]);

  const monitorOfertasProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento de ofertas para jobId:', apiJobId);
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/job/${apiJobId}`);
    
    eventSource.onmessage = (event) => {
      try {
        console.log('Ofertas SSE message received:', event.data);
        
        // Verificar se a resposta está vazia ou não é JSON válido
        if (!event.data || event.data.trim() === '') {
          console.log('Received empty data, skipping...');
          return;
        }
        
        // Tentar fazer parse do JSON com tratamento de erro mais específico
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Raw data received:', event.data);
          // Se não conseguir fazer parse, ignorar esta mensagem e continuar
          return;
        }
        
        // Verificar se os dados têm a estrutura esperada
        if (!data || !data.job) {
          console.log('Data structure not as expected:', data);
          return;
        }
        
        const jobData = data.job;
        const items = data.items || [];
        
        // Usar o progresso da API se disponível
        const progress = jobData.progress || 0;
        
        // Atualizar progresso no modal
        updateProgress(progress);
        
        // Mostrar SKUs sendo processados no modal
        if (items.length > 0) {
          const currentSkus = items.slice(-3).map((item: any) => item.item_id || item.sku).filter(Boolean).join(', ');
          const statusMessages = items.slice(-3).map((item: any) => {
            const sku = item.item_id || item.sku;
            if (item.status === 'SUCESSO') return `${sku}: Sucesso`;
            if (item.status === 'ERRO') return `${sku}: Erro`;
            return `${sku}: ${item.status}`;
          });
          
          showLoading(
            'Publicando Ofertas',
            `Processando: ${currentSkus}${items.length > 3 ? '...' : ''}`,
            progress
          );
        }
        
        updateJob(contextJobId, {
          status: jobData.status === 'completed' ? 'completed' : 'processing',
          progress: progress,
          results: {
            job: jobData,
            items: items,
            processedItems: items.length,
            totalItems: jobData.total_items
          }
        });
        
        if (jobData.status === 'completed') {
          console.log('Job de ofertas completed, iniciando download...');
          handleOfertasDownload(contextJobId, apiJobId);
          eventSource.close();
        } else if (jobData.status === 'failed') {
          updateJob(contextJobId, { 
            status: 'failed',
            error: jobData.error || 'Processo falhou',
            endTime: new Date().toISOString() 
          });
          hideLoading();
          eventSource.close();
        }
      } catch (error) {
        console.error('Error processing ofertas SSE data:', error);
        console.error('Event data:', event.data);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('Ofertas SSE error:', error);
      console.error('EventSource readyState:', eventSource.readyState);
      
      // Se a conexão foi fechada permanentemente, marcar como falha
      if (eventSource.readyState === EventSource.CLOSED) {
        updateJob(contextJobId, { 
          status: 'failed', 
          error: 'Conexão SSE foi encerrada inesperadamente',
          endTime: new Date().toISOString()
        });
        hideLoading();
      }
    };
    
    eventSource.onopen = () => {
      console.log('Ofertas SSE connection opened');
    };
  }, [updateJob, hideLoading, updateProgress, showLoading]);

  const handleOfertasDownload = useCallback(async (contextJobId: string, apiJobId: string) => {
    try {
      console.log('Fazendo download do arquivo de ofertas para jobId:', apiJobId);
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
      
      const downloadData = {
        file: base64,
        filename: `ofertas_processadas_${apiJobId}.xlsx`
      };
      
      updateJob(contextJobId, {
        status: 'completed',
        progress: 100,
        downloadData,
        endTime: new Date().toISOString()
      });
      
      // Download automático
      downloadFile(downloadData);
      hideLoading();
    } catch (error) {
      console.error('Erro no download de ofertas:', error);
      updateJob(contextJobId, {
        status: 'failed',
        error: 'Erro ao fazer download do arquivo processado',
        endTime: new Date().toISOString()
      });
      hideLoading();
    }
  }, [updateJob, hideLoading, downloadFile]);

  return {
    uploadFile,
    isUploading,
    activeJobId,
  };
};
