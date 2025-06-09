
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  type: 'gtin' | 'ofertas' | 'estoque';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileName: string;
  userName: string;
  sellerId: string;
  startTime: string;
  endTime?: string;
  error?: string;
  downloadData?: {
    file: string;
    filename: string;
  };
  results?: any;
}

interface JobContextType {
  jobs: Job[];
  activeJobs: Job[];
  completedJobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'startTime'>) => string;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  markJobAsRead: (id: string) => void;
  unreadCompletedJobs: Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [readJobIds, setReadJobIds] = useState<Set<string>>(new Set());

  const addJob = useCallback((jobData: Omit<Job, 'id' | 'startTime'>) => {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newJob: Job = {
      ...jobData,
      id,
      startTime: new Date().toISOString(),
    };
    
    setJobs(prev => [...prev, newJob]);
    return id;
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  }, []);

  const removeJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    setReadJobIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const markJobAsRead = useCallback((id: string) => {
    setReadJobIds(prev => new Set(prev).add(id));
  }, []);

  const activeJobs = jobs.filter(job => job.status === 'pending' || job.status === 'processing');
  const completedJobs = jobs.filter(job => job.status === 'completed' || job.status === 'failed');
  const unreadCompletedJobs = completedJobs.filter(job => !readJobIds.has(job.id));

  // Mostrar toast quando job for completado
  useEffect(() => {
    const newlyCompleted = jobs.filter(job => 
      (job.status === 'completed' || job.status === 'failed') && 
      !readJobIds.has(job.id)
    );

    newlyCompleted.forEach(job => {
      if (job.status === 'completed') {
        toast({
          title: "Processo concluído!",
          description: `${getJobTypeName(job.type)} foi finalizado com sucesso.`,
        });
      } else if (job.status === 'failed') {
        toast({
          title: "Processo falhou",
          description: `${getJobTypeName(job.type)} falhou: ${job.error}`,
          variant: "destructive",
        });
      }
    });
  }, [jobs, readJobIds]);

  const value: JobContextType = {
    jobs,
    activeJobs,
    completedJobs,
    addJob,
    updateJob,
    removeJob,
    markJobAsRead,
    unreadCompletedJobs,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

const getJobTypeName = (type: Job['type']): string => {
  switch (type) {
    case 'gtin': return 'Verificação de GTIN';
    case 'ofertas': return 'Publicar Ofertas';
    case 'estoque': return 'Atualização de Estoque';
    default: return 'Processo';
  }
};
