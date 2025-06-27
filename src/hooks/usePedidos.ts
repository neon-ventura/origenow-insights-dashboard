
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '@/contexts/UserContext';

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

const fetchPedidos = async (nickname: string): Promise<PedidosResponse> => {
  if (!nickname) {
    throw new Error('Nickname é obrigatório para buscar pedidos');
  }

  const response = await fetch(
    `https://dev.huntdigital.com.br/projeto-amazon/pedidos?nickname=${encodeURIComponent(nickname)}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar pedidos');
  }

  return response.json();
};

export const usePedidos = () => {
  const { selectedUser } = useUserContext();
  
  return useQuery({
    queryKey: ['pedidos', selectedUser?.nickname],
    queryFn: () => fetchPedidos(selectedUser?.nickname || ''),
    enabled: !!selectedUser?.nickname,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
