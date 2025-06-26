import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFornecedoresProducts } from '@/hooks/useFornecedoresProducts';
import { useUserContext } from '@/contexts/UserContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { FornecedoresFilters } from '@/components/FornecedoresFilters';
import { useFornecedoresFilters } from '@/hooks/useFornecedoresFilters';

interface FornecedoresTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const FornecedoresTable = ({ currentPage, onPageChange }: FornecedoresTableProps) => {
  const { selectedUser } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    filters,
    updateFilter,
    clearFilters,
    buildFilterParams,
  } = useFornecedoresFilters();

  const [appliedFilters, setAppliedFilters] = useState({});

  const { data, isLoading, error } = useFornecedoresProducts(
    selectedUser?.sellerId,
    selectedUser?.user,
    currentPage,
    appliedFilters
  );

  const products = data?.produtos || [];
  const paginacao = data?.paginacao;

  // Filter products based on search term with proper type handling
  const filteredProducts = products.filter(product => {
    try {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.sku.toString().includes(searchTerm) ||
        (product.asin || '').toLowerCase().includes(searchLower) ||
        (product.descricao || '').toLowerCase().includes(searchLower) ||
        (product.marca || '').toLowerCase().includes(searchLower) ||
        (product.gtin || '').toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error filtering product:', product, error);
      return false;
    }
  });

  const handleSearch = () => {
    // Search is handled by the filter above
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exportToExcel = async () => {
    if (!selectedUser) {
      toast({
        title: "Erro na exportação",
        description: "Selecione um usuário para exportar os produtos.",
        variant: "destructive",
      });
      return;
    }

    if (!data?.produtos || data.produtos.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há produtos de fornecedores para exportar.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Iniciando exportação",
        description: "Gerando arquivo Excel...",
      });

      // Preparar dados para exportação
      const exportData = filteredProducts.map(product => ({
        SKU: product.sku,
        ASIN: product.asin,
        'Descrição': product.descricao,
        'Marca': product.marca,
        'Custo (R$)': product.custo ? parseFloat(product.custo).toFixed(2).replace('.', ',') : '---',
        'Valor Recomendado (R$)': product.valor_recomendado ? parseFloat(product.valor_recomendado).toFixed(2).replace('.', ',') : '---',
        'Estoque': product.estoque,
        'GTIN': product.gtin,
      }));

      // Criar workbook e worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Definir largura das colunas
      const columnWidths = [
        { wch: 15 }, // SKU
        { wch: 15 }, // ASIN
        { wch: 50 }, // Descrição
        { wch: 15 }, // Marca
        { wch: 15 }, // Custo
        { wch: 18 }, // Valor Recomendado
        { wch: 10 }, // Estoque
        { wch: 20 }, // GTIN
      ];
      ws['!cols'] = columnWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Produtos Fornecedores');

      // Gerar nome do arquivo com timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `produtos_fornecedores_${selectedUser.nickname || 'usuario'}_${timestamp}.xlsx`;

      // Fazer download
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Exportação concluída",
        description: `${filteredProducts.length} produtos exportados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao gerar o arquivo Excel.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string | null) => {
    if (!price) return '---';
    const numPrice = parseFloat(price);
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const truncateDescription = (description: string, maxLength: number = 40) => {
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
  };

  const getStatusBadge = (asin: string) => {
    return asin && asin !== '' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        Cadastrado
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
        Não Cadastrado
      </span>
    );
  };

  const handlePreviousPage = () => {
    if (paginacao && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (paginacao && currentPage < paginacao.total_paginas) {
      onPageChange(currentPage + 1);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(buildFilterParams());
    onPageChange(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    clearFilters();
    setAppliedFilters({});
    onPageChange(1);
  };

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">Selecione um usuário para visualizar os produtos dos fornecedores</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">Carregando produtos dos fornecedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-red-500">Erro ao carregar produtos dos fornecedores</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header da Tabela */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Produtos de Fornecedores</h2>
              <p className="text-sm text-gray-500">
                Gerencie todos os produtos dos seus fornecedores
                <span className="ml-2 text-blue-600">
                  ({filteredProducts.length} produtos na página atual)
                </span>
                {paginacao && (
                  <span className="ml-2 text-gray-500">
                    • {paginacao.total_itens} produtos no total
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FornecedoresFilters
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={handleClearFilters}
                onApplyFilters={handleApplyFilters}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={exportToExcel}
                disabled={filteredProducts.length === 0}
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </Button>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="flex items-center space-x-2 max-w-md">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar por SKU, ASIN, descrição, marca ou GTIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="flex items-center space-x-2"
              disabled={isLoading}
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </Button>
          </div>
        </div>

        {/* Tabela com Scroll */}
        <ScrollArea className="h-[600px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900">SKU</TableHead>
                  <TableHead className="font-semibold text-gray-900">ASIN</TableHead>
                  <TableHead className="font-semibold text-gray-900">Descrição</TableHead>
                  <TableHead className="font-semibold text-gray-900">Marca</TableHead>
                  <TableHead className="font-semibold text-gray-900">Custo</TableHead>
                  <TableHead className="font-semibold text-gray-900">Valor Recomendado</TableHead>
                  <TableHead className="font-semibold text-gray-900">Estoque</TableHead>
                  <TableHead className="font-semibold text-gray-900">GTIN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {searchTerm ? 
                        `Nenhum produto encontrado para "${searchTerm}"` :
                        "Nenhum produto de fornecedor encontrado"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <TableRow key={`${product.sku}-${index}`} className="hover:bg-gray-50">
                      <TableCell>
                        {getStatusBadge(product.asin)}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium text-blue-600">
                        {product.sku}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {product.asin || '---'}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900" title={product.descricao}>
                          {truncateDescription(product.descricao)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {product.marca}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.custo)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.valor_recomendado)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {product.estoque}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {product.gtin}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        {/* Footer da Tabela com Paginação */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span>
                {filteredProducts.length} produtos na página atual
                {selectedUser && ` de ${selectedUser.nickname}`}
                {searchTerm && ` (buscando por "${searchTerm}")`}
              </span>
              {paginacao && (
                <div className="mt-1">
                  <span>
                    Página {paginacao.pagina_atual} de {paginacao.total_paginas} • 
                    Total: {paginacao.total_itens} produtos • 
                    {paginacao.itens_por_pagina} por página
                  </span>
                </div>
              )}
            </div>
            
            {paginacao && paginacao.total_paginas > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">Página</span>
                  <span className="font-medium text-sm">{currentPage}</span>
                  <span className="text-sm text-gray-500">de {paginacao.total_paginas}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= paginacao.total_paginas}
                  className="flex items-center space-x-1"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
