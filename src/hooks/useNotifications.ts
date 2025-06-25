
import { useQuery } from '@tanstack/react-query';

interface Notification {
  orderId: string;
  title: string;
  asin: string;
  price?: {
    Amount: string;
    CurrencyCode: string;
  };
  status: string;
  mensagem: string;
  createDate: string;
  purchaseDate: string | null;
  lida: boolean;
  lidaDate: string | null;
}

interface NotificationsResponse {
  status: string;
  filtros_possiveis: any;
  filtros_utilizados: any;
  notificacoes: Notification[];
}

const fetchNotifications = async (sellerId: string): Promise<Notification[]> => {
  console.log('Buscando notificações para sellerId:', sellerId);
  
  try {
    const response = await fetch(
      `https://dev.huntdigital.com.br/projeto-amazon/notificacoes?sellerId=${sellerId}&filtro_lida=nao_lidas`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: NotificationsResponse = await response.json();
    console.log('Notificações recebidas:', data);
    
    return data.notificacoes || [];
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
};

export const useNotifications = (sellerId: string | null) => {
  return useQuery({
    queryKey: ['notifications', sellerId],
    queryFn: () => fetchNotifications(sellerId!),
    enabled: !!sellerId, // Só executa se tiver sellerId
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
  });
};
