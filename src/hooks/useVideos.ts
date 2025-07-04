
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/endpoints';

export interface Video {
  id: string;
  titulo: string;
  descricao: string;
  videoId: string;
  duracao: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async (): Promise<Video[]> => {
      console.log('Carregando vídeos da API...');
      const response = await apiClient.get<{ videos: Video[] }>(ENDPOINTS.VIDEOS.LIST);
      return response.videos || [];
    },
  });
};
