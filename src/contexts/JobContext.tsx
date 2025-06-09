
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface JobResult {
  id: string;
  type: 'gtin' | 'ofertas' | 'estoque';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  userName: string;
  filename?: string;
  file?: string;
  error?: string;
  startTime: string;
  endTime?: string;
  sectionName: string;
}

interface JobContextType {
  activeJobs: JobResult[];
  addJob: (job: JobResult) => void;
  updateJob: (id: string, updates: Partial<JobResult>) => void;
  removeJob: (id: string) => void;
  downloadFile: (job: JobResult) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [activeJobs, setActiveJobs] = useState<JobResult[]>([]);
  const [monitoringJobs, setMonitoringJobs] = useState<Set<string>>(new Set());

  const getSectionName = (type: string) => {
    switch (type) {
      case 'gtin': return 'Verificação de GTIN';
      case 'ofertas': return 'Publicar Ofertas';
      case 'estoque': return 'Atualização de Estoque';
      default: return type;
    }
  };

  const addJob = useCallback((job: JobResult) => {
    setActiveJobs(prev => [...prev, { ...job, sectionName: getSectionName(job.type) }]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<JobResult>) => {
    setActiveJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  }, []);

  const removeJob = useCallback((id: string) => {
    setActiveJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  const downloadFile = useCallback((job: JobResult) => {
    if (!job.file || !job.filename) {
      toast({
        title: "Erro no download",
        description: "Arquivo não disponível para download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const byteCharacters = atob(job.file);
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
      link.download = job.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download realizado!",
        description: `Arquivo de ${job.sectionName} baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível fazer o download do arquivo.",
        variant: "destructive",
      });
    }
  }, []);

  const monitorJob = useCallback((jobId: string) => {
    if (monitoringJobs.has(jobId)) return;
    
    setMonitoringJobs(prev => new Set([...prev, jobId]));
    console.log('Starting background SSE monitoring for job:', jobId);
    
    const eventSource = new EventSource(`https://dev.huntdigital.com.br/projeto-amazon/job/${jobId}`);
    
    eventSource.onmessage = (event) => {
      console.log('Background SSE message received:', event.data);
      try {
        const jobData = JSON.parse(event.data);
        
        updateJob(jobId, {
          status: jobData.status,
          progress: jobData.progress,
          file: jobData.file,
          filename: jobData.filename,
          error: jobData.error,
          endTime: jobData.endTime,
        });
        
        if (jobData.status === 'completed') {
          console.log('Background job completed!');
          eventSource.close();
          setMonitoringJobs(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          
          const job = activeJobs.find(j => j.id === jobId);
          if (job) {
            toast({
              title: `${job.sectionName} concluída!`,
              description: "Clique no botão abaixo para fazer o download do arquivo.",
              action: (
                <button
                  onClick={() => downloadFile({ ...job, ...jobData })}
                  className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-xs font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Download
                </button>
              ),
              duration: 10000,
            });
          }
        } else if (jobData.status === 'failed') {
          console.log('Background job failed:', jobData.error);
          eventSource.close();
          setMonitoringJobs(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          
          const job = activeJobs.find(j => j.id === jobId);
          if (job) {
            toast({
              title: `Erro em ${job.sectionName}`,
              description: jobData.error || "Ocorreu um erro durante o processamento.",
              variant: "destructive",
              duration: 10000,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing background SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('Background SSE error:', error);
      eventSource.close();
      setMonitoringJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    };
  }, [activeJobs, updateJob, downloadFile]);

  // Monitor active jobs when they are added
  useEffect(() => {
    activeJobs.forEach(job => {
      if ((job.status === 'pending' || job.status === 'processing') && !monitoringJobs.has(job.id)) {
        monitorJob(job.id);
      }
    });
  }, [activeJobs, monitorJob, monitoringJobs]);

  return (
    <JobContext.Provider value={{ 
      activeJobs, 
      addJob, 
      updateJob, 
      removeJob, 
      downloadFile 
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
