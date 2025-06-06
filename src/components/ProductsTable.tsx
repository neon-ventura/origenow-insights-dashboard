
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';

export const ProductsTable = () => {
  const { selectedUser } = useUserContext();
  const { data: products = [], isLoading, error } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' || status === 'Ativo'
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">Selecione um usuário para visualizar os produtos</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-red-500">Erro ao carregar produtos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header da Tabela */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Produtos Amazon</h2>
            <p className="text-sm text-gray-500">Gerencie todos os seus produtos listados na Amazon</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>Filtros</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">SKU</TableHead>
              <TableHead className="font-semibold text-gray-900">ASIN</TableHead>
              <TableHead className="font-semibold text-gray-900">Título</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Preço</TableHead>
              <TableHead className="font-semibold text-gray-900">Estoque</TableHead>
              <TableHead className="font-semibold text-gray-900">Dias Ativos</TableHead>
              <TableHead className="font-semibold text-gray-900">Data de Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Nenhum produto encontrado para este usuário
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={`${product.asin}-${index}`} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm font-medium text-blue-600">
                    {product.sku}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {product.asin}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {product.titulo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      getStatusColor(product.status)
                    )}>
                      {product.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.preço)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {product.quantidade}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {product.dias_ativo}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(product.data_criação)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer da Tabela */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Mostrando {products.length} produto{products.length !== 1 ? 's' : ''}
            {selectedUser && ` de ${selectedUser.nickname}`}
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs">1</span>
            <Button variant="outline" size="sm" disabled={products.length === 0}>
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
