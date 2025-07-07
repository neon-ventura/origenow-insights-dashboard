
import { useQuery } from '@tanstack/react-query';
import { getActiveToken } from '@/utils/auth';

interface PedidoItem {
  asin: string;
  sku: string;
  titulo: string;
  preco_unitario: string;
  quantidade: string;
  link: string;
}

interface Pedido {
  id: string;
  status: string;
  link: string;
  items: PedidoItem[];
  frete: string;
  envio: string;
  valor_total: string;
  cidade: string;
  estado: string;
  nickname: string;
  data_compra: string;
}

interface PedidosResponse {
  status: string;
  message: string;
  pedidos: Pedido[];
  resumo: {
    total_pedidos: number;
    pedidos_enviados: string;
    pedidos_cancelados: string;
    pedidos_pendentes: string;
    valor_total: string;
  };
  opcoes_filtros: {
    nicknames: string[];
    estados: string[];
    cidades: string[];
  };
  paginacao: {
    pagina_atual: number;
    total_paginas: number;
    total_itens: number;
    itens_por_pagina: number;
  };
}

const fetchPedidos = async (filters?: Record<string, any>): Promise<PedidosResponse> => {
  const token = getActiveToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const url = new URL('https://dev.huntdigital.com.br/projeto-amazon/pedidos');
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar pedidos');
  }

  return response.json();
};

export const usePedidos = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['pedidos', filters],
    queryFn: () => fetchPedidos(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
