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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';
import { useProductFilters } from '@/hooks/useProductFilters';
import { ProductFilters } from '@/components/ProductFilters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

export const ProductsTable = () => {
  const { selectedUser } = useUserContext();
  const { data: products = [], isLoading, error } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId
  );

  const { filters, filteredProducts, updateFilter, clearFilters } = useProductFilters(products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Calcular produtos para a página atual
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const exportToExcel = () => {
    if (filteredProducts.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há produtos para exportar com os filtros aplicados.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Preparar dados para exportação
      const exportData = filteredProducts.map(product => ({
        SKU: product.sku,
        ASIN: product.asin,
        'Título': product.titulo,
        'Status': product.status === 'Active' ? 'Ativo' : 'Inativo',
        'Preço (R$)': parseFloat(product.preço).toFixed(2).replace('.', ','),
        'Estoque': product.quantidade,
        'Dias Ativos': product.dias_ativo,
        'Data de Criação': new Date(product.data_criação).toLocaleDateString('pt-BR'),
        'Usuário': product.nickname,
        'Último Relatório': product.ultimo_relatorio,
        'Menor Preço': product.menor_preco ? parseFloat(product.menor_preco).toFixed(2).replace('.', ',') : 'N/A',
        'Preço Recomendado': product.preco_recomendado ? parseFloat(product.preco_recomendado).toFixed(2).replace('.', ',') : 'N/A',
      }));

      // Criar workbook e worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Definir largura das colunas
      const columnWidths = [
        { wch: 15 }, // SKU
        { wch: 15 }, // ASIN
        { wch: 50 }, // Título
        { wch: 10 }, // Status
        { wch: 12 }, // Preço
        { wch: 10 }, // Estoque
        { wch: 12 }, // Dias Ativos
        { wch: 15 }, // Data de Criação
        { wch: 15 }, // Usuário
        { wch: 15 }, // Último Relatório
        { wch: 15 }, // Menor Preço
        { wch: 18 }, // Preço Recomendado
      ];
      ws['!cols'] = columnWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Produtos Amazon');

      // Gerar nome do arquivo com timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `produtos_amazon_${selectedUser?.nickname || 'usuario'}_${timestamp}.xlsx`;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }
    
    return pages;
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
            <p className="text-sm text-gray-500">
              Gerencie todos os seus produtos listados na Amazon
              {filteredProducts.length !== products.length && (
                <span className="ml-2 text-blue-600">
                  ({filteredProducts.length} de {products.length} produtos)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
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
            <ProductFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      </div>

      {/* Tabela com Scroll */}
      <ScrollArea className="h-[600px]">
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
              {currentProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {filteredProducts.length === 0 && products.length > 0 
                      ? "Nenhum produto encontrado com os filtros aplicados"
                      : "Nenhum produto encontrado para este usuário"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                currentProducts.map((product, index) => (
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
      </ScrollArea>

      {/* Footer da Tabela com Paginação */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
              {selectedUser && ` de ${selectedUser.nickname}`}
            </span>
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {generatePageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};
