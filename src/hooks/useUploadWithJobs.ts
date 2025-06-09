
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/contexts/UserContext';
import { useJobContext } from '@/contexts/JobContext';

interface UploadResponse {
  status: string;
  message: string;
  jobId?: string;
  resultados?: any[];
}

export const useUploadWithJobs = () => {
  const { selectedUser } = useUserContext();
  const { addJob } = useJobContext();

  const uploadOffers = useCallback(async (file: File) => {
    if (!selectedUser) {
      toast({
        title: "Usuário não selecionado",
        description: "Por favor, selecione um usuário antes de fazer o upload.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('usuario', selectedUser.user);
      formData.append('sellerId', selectedUser.sellerId);
      formData.append('file', file);

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/publicar-ofertas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar ofertas');
      }

      const data: UploadResponse = await response.json();
      console.log('Upload offers response:', data);
      
      toast({
        title: "Upload realizado com sucesso!",
        description: `${file.name} foi processado. Verifique os resultados abaixo.`,
      });

      // Se há um jobId, adicionar ao contexto para monitoramento
      if (data.jobId) {
        addJob({
          id: data.jobId,
          type: 'ofertas',
          status: 'pending',
          progress: 0,
          userName: selectedUser.user,
          startTime: new Date().toISOString(),
          sectionName: 'Publicar Ofertas'
        });
        
        toast({
          title: "Processo iniciado!",
          description: "Você pode navegar entre as seções e será notificado quando o processo for concluído.",
        });
      }

      return data;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      throw error;
    }
  }, [selectedUser, addJob]);

  return { uploadOffers };
};
