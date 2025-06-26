
import { useQuery } from '@tanstack/react-query';

interface FornecedoresListResponse {
  status: string;
  total: number;
  fornecedores: string[];
}

const fetchFornecedoresList = async (
  sellerId: string,
  usuario: string
): Promise<FornecedoresListResponse> => {
  const url = `https://dev.huntdigital.com.br/projeto-amazon/fornecedores-lista?sellerId=${sellerId}&usuario=${usuario}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers list');
  }
  return response.json();
};

export const useFornecedoresList = (sellerId?: string, usuario?: string) => {
  return useQuery({
    queryKey: ['fornecedores-list', sellerId, usuario],
    queryFn: () => fetchFornecedoresList(sellerId!, usuario!),
    enabled: !!(sellerId && usuario),
  });
};
