
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
  paginacao: {
    pagina_atual: number;
    total_paginas: number;
    total_itens: number;
    itens_por_pagina: number;
  };
}

const fetchPedidos = async (): Promise<PedidosResponse> => {
  const token = getActiveToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/pedidos', {
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

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: fetchPedidos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
