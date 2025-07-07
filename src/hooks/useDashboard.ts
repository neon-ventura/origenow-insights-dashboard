
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/endpoints';

interface DashboardData {
  produtos_ativos: number;
  total_pedidos_mes_atual: number;
  total_pedidos_mes_anterior: number;
  diferenca_percentual_total: string;
  valor_total_pedidos: string;
  media_pedidos_mes_atual: string;
  media_pedidos_mes_anterior: string;
  diferenca_percentual_media: string;
  pedidos_por_mes: Array<{
    mes: string;
    valor_total: string;
    quantidade_total: string;
    valor_anterior: string | null;
    quantidade_anterior: string | null;
    diferenca_valor_percentual: string | null;
    diferenca_quantidade_percentual: string | null;
  }>;
  pedidos_por_semana: Array<{
    mes: string;
    semana_do_mes: number;
    valor_total: string;
    quantidade_total: string;
    valor_anterior: string | null;
    quantidade_anterior: string | null;
    diferenca_valor_percentual: string | null;
    diferenca_quantidade_percentual: string | null;
  }>;
  pedidos_por_dia: Array<{
    data: string;
    valor_total: string;
    quantidade_total: string;
    valor_anterior: string | null;
    quantidade_anterior: string | null;
    diferenca_valor_percentual: string | null;
    diferenca_quantidade_percentual: string | null;
  }>;
  vendas_por_produto: Array<{
    mes: string;
    product_name: string;
    asin: string;
    sku: string;
    quantidade_vendida: string;
  }>;
}

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      console.log('Buscando dados da dashboard...');
      return apiClient.get<DashboardData>(ENDPOINTS.ADMIN.DASHBOARD || '/projeto-amazon/dashboard');
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
