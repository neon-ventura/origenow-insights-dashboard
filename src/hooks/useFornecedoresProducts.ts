
import { useQuery } from '@tanstack/react-query';

interface FornecedorProduct {
  sku: number;
  asin: string;
  codigo_fornecedor: string;
  descricao: string;
  marca: string;
  custo: string;
  valor_recomendado: string;
  estoque: string;
  gtin: string;
  fornecedor: string;
}

interface Paginacao {
  pagina_atual: number;
  total_paginas: number;
  total_itens: number;
  itens_por_pagina: number;
}

interface Resumo {
  total_produtos_ja_cadastrados: number;
  total_produtos_nao_cadastrados: number;
  total_produtos: number;
  total_produtos_filtrados: number;
}

interface FornecedoresResponse {
  produtos: FornecedorProduct[];
  paginacao: Paginacao;
  resumo: Resumo;
  filtros_disponiveis?: any;
}

const fetchFornecedoresProducts = async (
  sellerId: string,
  usuario: string,
  page: number = 1
): Promise<FornecedoresResponse> => {
  const url = `https://dev.huntdigital.com.br/projeto-amazon/fornecedores?sellerId=${sellerId}&usuario=${usuario}&page=${page}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch supplier products');
  }
  return response.json();
};

export const useFornecedoresProducts = (sellerId?: string, usuario?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['fornecedores-products', sellerId, usuario, page],
    queryFn: () => fetchFornecedoresProducts(sellerId!, usuario!, page),
    enabled: !!(sellerId && usuario),
  });
};
