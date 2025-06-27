
import { useState, useCallback } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

export const useDeleteUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addJob, updateJob } = useJobs();
  const { selectedUser } = useUserContext();

  const uploadFile = useCallback(async (file: File, endpoint: string, sellerId: string) => {
    if (!selectedUser) {
      toast({
        title: "Usuário não selecionado",
        description: "Por favor, selecione um usuário antes de fazer o upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Create job in context
    const jobId = addJob({
      type: 'ofertas', // Using ofertas type for now since delete isn't defined
      status: 'pending',
      progress: 0,
      fileName: file.name,
      userName: selectedUser.user,
      sellerId: selectedUser.sellerId,
    });

    try {
      const formData = new FormData();
      formData.append('usuario', selectedUser.user);
      formData.append('sellerId', sellerId);
      formData.append('file', file);

      setProgress(50);
      updateJob(jobId, { status: 'processing', progress: 50 });

      const response = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar arquivo');
      }

      const data = await response.json();
      
      setProgress(100);
      updateJob(jobId, { 
        status: 'completed', 
        progress: 100,
        endTime: new Date().toISOString(),
        results: data
      });

      toast({
        title: "Upload realizado com sucesso!",
        description: "O arquivo foi enviado para processamento.",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      updateJob(jobId, { 
        status: 'failed', 
        progress: 0,
        endTime: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [selectedUser, addJob, updateJob]);

  return {
    uploadFile,
    isUploading,
    progress,
  };
};
