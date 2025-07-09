
import { useCallback, useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import { getActiveToken } from '@/utils/auth';

export const useDeleteUpload = () => {
  const { selectedUser } = useUserContext();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file: File, type: string) => {
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('usuario', selectedUser.user);
      formData.append('sellerId', selectedUser.sellerId);

      const token = getActiveToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/deletar-ofertas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar ofertas');
      }

      const result = await response.json();
      
      toast({
        title: "Sucesso!",
        description: "Ofertas deletadas com sucesso.",
      });

      return result;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [selectedUser]);

  return {
    uploadFile,
    isUploading,
    progress,
  };
};
