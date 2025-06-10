
import { useQuery } from '@tanstack/react-query';

interface AmazonProduct {
  asin: string;
  sku: string;
  status: string;
  titulo: string;
  preço: string | null;
  quantidade: string;
  data_criação: string;
  nickname: string;
  usuario: string;
  ultimo_relatorio: string;
  dias_ativo: string;
  menor_preco: string | null;
  preco_recomendado: string | null;
  status_erro?: string;
  descricao_erro?: string | null;
}

interface PaginationInfo {
  pagina_atual: number;
  total_paginas: number;
  total_itens: number;
  itens_por_pagina: number;
}

interface ProductSummary {
  total_produtos: number;
  produtos_ativos: number;
  produtos_inativos: number;
  media_dias_ativos: number;
}

interface AmazonProductsResponse {
  produtos: AmazonProduct[];
  paginacao: PaginationInfo;
  resumo: ProductSummary;
}

const fetchAmazonProducts = async (user: string, sellerId: string, page: number = 1): Promise<AmazonProductsResponse> => {
  const response = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/produtos-amazon?user=${user}&sellerId=${sellerId}&page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Amazon products');
  }
  return response.json();
};

export const useAmazonProducts = (user?: string, sellerId?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['amazon-products', user, sellerId, page],
    queryFn: () => fetchAmazonProducts(user!, sellerId!, page),
    enabled: !!(user && sellerId),
  });
};
