import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

const fetchNotifications = async (sellerId: string, filter: 'nao_lidas' | 'lidas' = 'nao_lidas'): Promise<Notification[]> => {
  console.log('Buscando notificações para sellerId:', sellerId, 'filtro:', filter);
  
  try {
    const response = await fetch(
      `https://dev.huntdigital.com.br/projeto-amazon/notificacoes?sellerId=${sellerId}&filtro_lida=${filter}`
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

const markNotificationAsRead = async (sellerId: string, orderId: string): Promise<void> => {
  console.log('Marcando notificação como lida:', { sellerId, orderId });
  
  try {
    const response = await fetch(
      `https://dev.huntdigital.com.br/projeto-amazon/notificacoes?sellerId=${sellerId}&marcar_lida=${orderId}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Notificação marcada como lida com sucesso');
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
};

const markAllNotificationsAsRead = async (sellerId: string, orderIds: string[]): Promise<void> => {
  console.log('Marcando todas as notificações como lidas:', { sellerId, orderIds });
  
  try {
    // Fazer requisições em paralelo para marcar todas como lidas
    const requests = orderIds.map(orderId => 
      fetch(`https://dev.huntdigital.com.br/projeto-amazon/notificacoes?sellerId=${sellerId}&marcar_lida=${orderId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response;
        })
    );
    
    await Promise.all(requests);
    console.log('Todas as notificações marcadas como lida com sucesso');
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    throw error;
  }
};

export const useNotifications = (sellerId: string | null, filter: 'nao_lidas' | 'lidas' | null = 'nao_lidas') => {
  return useQuery({
    queryKey: ['notifications', sellerId, filter],
    queryFn: () => fetchNotifications(sellerId!, filter!),
    enabled: !!sellerId && !!filter, // Só executa se tiver sellerId e filter
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
  });
};

export const useMarkNotificationAsRead = (sellerId: string | null) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => markNotificationAsRead(sellerId!, orderId),
    onSuccess: () => {
      // Invalida e refaz as queries das notificações para atualizar as listas
      queryClient.invalidateQueries({ queryKey: ['notifications', sellerId] });
    },
  });
};

export const useMarkAllNotificationsAsRead = (sellerId: string | null) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderIds: string[]) => markAllNotificationsAsRead(sellerId!, orderIds),
    onSuccess: () => {
      // Invalida e refaz as queries das notificações para atualizar as listas
      queryClient.invalidateQueries({ queryKey: ['notifications', sellerId] });
    },
  });
};
