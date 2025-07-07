
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveToken } from '@/utils/auth';

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

const fetchNotifications = async (filter: 'nao_lidas' | 'lidas' = 'nao_lidas'): Promise<Notification[]> => {
  const token = getActiveToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  console.log('Buscando notificações com filtro:', filter);
  
  try {
    const response = await fetch(
      `https://dev.huntdigital.com.br/projeto-amazon/notificacoes?filtro_lida=${filter}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
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

const markNotificationAsRead = async (orderId: string): Promise<void> => {
  const token = getActiveToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  console.log('Marcando notificação como lida:', { orderId });
  
  try {
    const response = await fetch(
      `https://dev.huntdigital.com.br/projeto-amazon/notificacoes?marcar_lida=${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
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

const markAllNotificationsAsRead = async (orderIds: string[]): Promise<void> => {
  const token = getActiveToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  console.log('Marcando todas as notificações como lidas:', { orderIds });
  
  try {
    // Fazer requisições em paralelo para marcar todas como lidas
    const requests = orderIds.map(orderId => 
      fetch(`https://dev.huntdigital.com.br/projeto-amazon/notificacoes?marcar_lida=${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
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

export const useNotifications = (filter: 'nao_lidas' | 'lidas' = 'nao_lidas') => {
  return useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => fetchNotifications(filter),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => markNotificationAsRead(orderId),
    onSuccess: () => {
      // Invalida e refaz as queries das notificações para atualizar as listas
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderIds: string[]) => markAllNotificationsAsRead(orderIds),
    onSuccess: () => {
      // Invalida e refaz as queries das notificações para atualizar as listas
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
