import { useCallback } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext';
import { toast } from '@/hooks/use-toast';
import { SSEClient } from '@/utils/sseClient';
import { getActiveToken } from '@/utils/auth';

export const useJobMonitoring = () => {
  const { updateJob } = useJobs();
  const { hideLoading, updateProgress, showLoading } = useGlobalLoading();

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

  const handleDownload = useCallback(async (contextJobId: string, apiJobId: string, downloadEndpoint: string, filename: string) => {
    try {
      const token = getActiveToken();
      console.log(`Fazendo download do arquivo para jobId: ${apiJobId}`);
      const downloadResponse = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/${downloadEndpoint}/${apiJobId}`, {
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
        filename: `${filename}_${apiJobId}.xlsx`
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

  const monitorGtinProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento GTIN para jobId:', apiJobId);
    
    const sseClient = new SSEClient(
      `https://dev.huntdigital.com.br/projeto-amazon/verify-gtins-relatorio/${apiJobId}`,
      {
        onMessage: (event) => {
          try {
            console.log('GTIN SSE message received:', event.data);
            
            if (!event.data || event.data.trim() === '') {
              console.log('Received empty GTIN data, skipping...');
              return;
            }
            
            const data = JSON.parse(event.data);
            console.log('Parsed GTIN data:', data);
            
            // Para GTIN, os dados estão dentro do objeto 'job'
            const jobData = data.job;
            if (!jobData) {
              console.log('No job data found in GTIN response');
              return;
            }
            
            console.log('GTIN job data:', jobData);
            
            // Usar progress do jobData
            const progress = jobData.progress || 0;
            console.log('GTIN Progress:', progress);
            
            updateProgress(progress);
            
            showLoading(
              'Verificando GTINs',
              `Processando dados...`,
              progress
            );
            
            updateJob(contextJobId, {
              status: jobData.status === 'completed' ? 'completed' : 'processing',
              progress: progress,
              results: {
                job: jobData,
                items: data.items || [],
                processedItems: data.items?.length || 0,
                totalItems: data.items?.length || 0
              }
            });
            
            if (jobData.status === 'completed') {
              console.log('GTIN Job completed, fechando SSE e iniciando download...');
              sseClient.close();
              handleDownload(contextJobId, apiJobId, 'verify-gtins-download', 'gtins_verificados');
            } else if (jobData.status === 'failed') {
              console.error('GTIN Job failed:', jobData.error);
              updateJob(contextJobId, { 
                status: 'failed',
                error: jobData.error || 'Processo falhou',
                endTime: new Date().toISOString() 
              });
              hideLoading();
              sseClient.close();
            }
          } catch (error) {
            console.error('Error parsing GTIN SSE data:', error);
          }
        },
        onError: (error) => {
          console.error('GTIN SSE error:', error);
          
          if (sseClient.getReadyState() === EventSource.CLOSED) {
            console.error('GTIN SSE connection closed unexpectedly');
            updateJob(contextJobId, { 
              status: 'failed', 
              error: 'Conexão SSE foi encerrada inesperadamente',
              endTime: new Date().toISOString()
            });
            hideLoading();
          }
        },
        onOpen: () => {
          console.log('GTIN SSE connection opened successfully');
        }
      }
    );
    
    sseClient.connect();
  }, [updateJob, hideLoading, updateProgress, showLoading, handleDownload]);

  const monitorEstoqueProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento de estoque para jobId:', apiJobId);
    
    const sseClient = new SSEClient(
      `https://dev.huntdigital.com.br/projeto-amazon/atualizacao-relatorio/${apiJobId}`,
      {
        onMessage: (event) => {
          try {
            console.log('Estoque SSE message received:', event.data);
            
            if (!event.data || event.data.trim() === '') {
              console.log('Received empty data, skipping...');
              return;
            }
            
            const jobData = JSON.parse(event.data);
            const progress = jobData.progress || 0;
            
            updateProgress(progress);
            
            showLoading(
              'Atualizando Estoque',
              `Processando dados...`,
              progress
            );
            
            updateJob(contextJobId, {
              status: jobData.status === 'completed' ? 'completed' : 'processing',
              progress: progress,
              results: {
                job: jobData,
                processedItems: jobData.processed_items,
                totalItems: jobData.total_items
              }
            });
            
            if (jobData.status === 'completed') {
              console.log('Job de estoque completed, iniciando download...');
              handleDownload(contextJobId, apiJobId, 'atualizacao-download', 'estoque_atualizado');
              sseClient.close();
            } else if (jobData.status === 'failed') {
              updateJob(contextJobId, { 
                status: 'failed',
                error: jobData.error || 'Processo falhou',
                endTime: new Date().toISOString() 
              });
              hideLoading();
              sseClient.close();
            }
          } catch (error) {
            console.error('Error processing estoque SSE data:', error);
          }
        },
        onError: (error) => {
          console.error('Estoque SSE error:', error);
          
          if (sseClient.getReadyState() === EventSource.CLOSED) {
            updateJob(contextJobId, { 
              status: 'failed', 
              error: 'Conexão SSE foi encerrada inesperadamente',
              endTime: new Date().toISOString()
            });
            hideLoading();
          }
        }
      }
    );
    
    sseClient.connect();
  }, [updateJob, hideLoading, updateProgress, showLoading, handleDownload]);

  const monitorOfertasProgress = useCallback((contextJobId: string, apiJobId: string) => {
    console.log('Iniciando monitoramento de ofertas para jobId:', apiJobId);
    
    const sseClient = new SSEClient(
      `https://dev.huntdigital.com.br/projeto-amazon/job/${apiJobId}`,
      {
        onMessage: (event) => {
          try {
            console.log('Ofertas SSE message received:', event.data);
            
            if (!event.data || event.data.trim() === '') {
              console.log('Received empty data, skipping...');
              return;
            }
            
            const jobData = JSON.parse(event.data);
            const progress = jobData.progress || 0;
            
            updateProgress(progress);
            
            showLoading(
              'Publicando Ofertas',
              `Processando dados...`,
              progress
            );
            
            updateJob(contextJobId, {
              status: jobData.status === 'completed' ? 'completed' : 'processing',
              progress: progress,
              results: {
                job: jobData,
                processedItems: jobData.processed_items,
                totalItems: jobData.total_items
              }
            });
            
            if (jobData.status === 'completed') {
              console.log('Job de ofertas completed, iniciando download...');
              handleDownload(contextJobId, apiJobId, 'ofertas-download', 'ofertas_processadas');
              sseClient.close();
            } else if (jobData.status === 'failed') {
              updateJob(contextJobId, { 
                status: 'failed',
                error: jobData.error || 'Processo falhou',
                endTime: new Date().toISOString() 
              });
              hideLoading();
              sseClient.close();
            }
          } catch (error) {
            console.error('Error processing ofertas SSE data:', error);
          }
        },
        onError: (error) => {
          console.error('Ofertas SSE error:', error);
          
          if (sseClient.getReadyState() === EventSource.CLOSED) {
            updateJob(contextJobId, { 
              status: 'failed', 
              error: 'Conexão SSE foi encerrada inesperadamente',
              endTime: new Date().toISOString()
            });
            hideLoading();
          }
        }
      }
    );
    
    sseClient.connect();
  }, [updateJob, hideLoading, updateProgress, showLoading, handleDownload]);

  return {
    monitorGtinProgress,
    monitorEstoqueProgress,
    monitorOfertasProgress,
  };
};
