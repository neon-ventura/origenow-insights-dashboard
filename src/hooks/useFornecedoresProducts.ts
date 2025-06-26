
import { useQuery } from '@tanstack/react-query';

interface FornecedorProduct {
  sku: string;
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

interface FornecedoresResponse {
  produtos: FornecedorProduct[];
}

const fetchFornecedoresProducts = async (
  sellerId: string,
  usuario: string
): Promise<FornecedoresResponse> => {
  const url = `https://dev.huntdigital.com.br/projeto-amazon/fornecedores?sellerId=${sellerId}&usuario=${usuario}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch supplier products');
  }
  return response.json();
};

export const useFornecedoresProducts = (sellerId?: string, usuario?: string) => {
  return useQuery({
    queryKey: ['fornecedores-products', sellerId, usuario],
    queryFn: () => fetchFornecedoresProducts(sellerId!, usuario!),
    enabled: !!(sellerId && usuario),
  });
};
