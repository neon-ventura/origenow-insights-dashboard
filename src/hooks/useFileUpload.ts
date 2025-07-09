
import { useCallback, useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useUserContext } from '@/contexts/UserContext';
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext';
import { toast } from '@/hooks/use-toast';
import { getActiveToken } from '@/utils/auth';

interface UseFileUploadProps {
  endpoint: string;
  jobType: 'verification' | 'ofertas' | 'price_stock';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onJobCreated?: (jobId: string, apiJobId: string) => void;
}

export const useFileUpload = ({ endpoint, jobType, onSuccess, onError, onJobCreated }: UseFileUploadProps) => {
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
        formData.append('sellerId', selectedUser.sellerId);
        formData.append('usuario', selectedUser.user);
        formData.append('file', file);
      } else if (jobType === 'ofertas') {
        formData.append('usuario', selectedUser.user);
        formData.append('sellerId', selectedUser.sellerId);
        formData.append('file', file);
      }

      updateJob(jobId, { status: 'processing', progress: 10 });
      updateProgress(10);

      const token = getActiveToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
        onJobCreated?.(jobId, data.jobId);
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
  }, [selectedUser, addJob, updateJob, jobType, endpoint, onSuccess, onError, onJobCreated, validateFile, showLoading, hideLoading, updateProgress]);

  return {
    uploadFile,
    isUploading,
    activeJobId,
  };
};
