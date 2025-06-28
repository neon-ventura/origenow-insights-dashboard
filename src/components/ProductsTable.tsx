import React, { useState, useEffect } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Search, ChevronUp, Settings, Trash2, Edit, DollarSign, Power, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';
import { useProductFilters } from '@/hooks/useProductFilters';
import { ProductFilters } from '@/components/ProductFilters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

export const ProductsTable = () => {
  const { selectedUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const { filters, updateFilter, clearFilters } = useProductFilters();

  const { data, isLoading, error } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId,
    currentPage,
    {
      searchTerm: activeSearchTerm,
      ...appliedFilters
    }
  );

  const products = data?.produtos || [];
  const pagination = data?.paginacao;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm, appliedFilters]);

  useEffect(() => {
    setSelectedProducts(new Set());
    setSelectAll(false);
  }, [products]);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allProductIds = new Set(products.map(product => product.asin));
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
      setSelectAll(false);
    }
    setSelectedProducts(newSelected);
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

    if (!data?.resumo?.total_produtos || data.resumo.total_produtos === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há produtos para exportar.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Iniciando exportação",
        description: "Buscando todos os produtos para exportação...",
      });

      const totalProducts = data.resumo.total_produtos;
      const url = `https://dev.huntdigital.com.br/projeto-amazon/produtos-amazon?user=${selectedUser.user}&sellerId=${selectedUser.sellerId}&limit=${totalProducts}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch all products');
      }
      
      const allProductsData = await response.json();
      const allProducts = allProductsData.produtos || [];

      if (allProducts.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não foram encontrados produtos para exportar.",
          variant: "destructive",
        });
        return;
      }

      const exportData = allProducts.map(product => ({
        SKU: product.sku,
        ASIN: product.asin,
        'Título': product.titulo,
        'Status': product.status === 'Active' || product.status === 'Ativo' ? 'Ativo' : 'Inativo',
        'Preço Recomendado (R$)': product.preco_recomendado ? parseFloat(product.preco_recomendado).toFixed(2).replace('.', ',') : '---',
        'Preço (R$)': product.preço ? parseFloat(product.preço).toFixed(2).replace('.', ',') : '---',
        'Estoque': product.quantidade,
        'Dias Ativos': product.dias_ativo,
        'Data de Criação': new Date(product.data_criação).toLocaleDateString('pt-BR'),
        'Usuário': product.nickname,
        'Último Relatório': product.ultimo_relatorio,
        'Menor Preço': product.menor_preco ? parseFloat(product.menor_preco).toFixed(2).replace('.', ',') : '---',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      const columnWidths = [
        { wch: 15 }, { wch: 15 }, { wch: 50 }, { wch: 10 }, { wch: 18 }, { wch: 12 },
        { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      ];
      ws['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Produtos Amazon');

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `produtos_amazon_${selectedUser.nickname || 'usuario'}_${timestamp}.xlsx`;

      XLSX.writeFile(wb, fileName);

      toast({
        title: "Exportação concluída",
        description: `${allProducts.length} produtos exportados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao buscar e gerar o arquivo Excel.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' || status === 'Ativo'
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatPrice = (price: string | null) => {
    if (!price) return '---';
    const numPrice = parseFloat(price);
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const truncateTitle = (title: string, maxLength: number = 22) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.total_paginas;
    
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
    <div className="space-y-6 relative">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Anúncios</h1>
              <p className="text-gray-600 mt-1">Gerencie seus anúncios e monitore o desempenho de vendas.</p>
            </div>
            <ProductFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={handleClearFilters}
              onApplyFilters={handleApplyFilters}
            />
          </div>

          {/* Search Bar and Columns Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Buscar por nome, GTIN ou SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-4 pr-12 h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2 ml-4"
            >
              <Columns className="w-4 h-4" />
              <span>Colunas</span>
            </Button>
          </div>
        </div>

        {/* Table with ScrollArea - Fixed height for 12 products */}
        <ScrollArea className="h-[480px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12 font-semibold text-gray-700">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    disabled={products.length === 0}
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-700">SKU</TableHead>
                <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                <TableHead className="font-semibold text-gray-700">GTIN</TableHead>
                <TableHead className="font-semibold text-gray-700">Preço de Custo</TableHead>
                <TableHead className="font-semibold text-gray-700">Preço de Venda</TableHead>
                <TableHead className="font-semibold text-gray-700">Estoque</TableHead>
                <TableHead className="font-semibold text-gray-700">Código Marketplace</TableHead>
                <TableHead className="font-semibold text-gray-700">Vendas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                    {activeSearchTerm ? 
                      `Nenhum produto encontrado para "${activeSearchTerm}"` :
                      "Nenhum produto encontrado com os filtros aplicados"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={`${product.asin}-${index}`} className="hover:bg-gray-50">
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedProducts.has(product.asin)}
                        onCheckedChange={(checked) => handleSelectProduct(product.asin, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium text-gray-900">
                      {product.sku}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900" title={product.titulo}>
                        {truncateTitle(product.titulo, 30)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {product.asin}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.preco_recomendado)}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.preço)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {product.quantidade}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {product.asin}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-900">
                      {product.dias_ativo}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Footer with Pagination */}
        {pagination && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>
                  Página {pagination.pagina_atual} de {pagination.total_paginas}
                  {selectedUser && ` • ${selectedUser.nickname}`}
                  {activeSearchTerm && ` • Buscando por "${activeSearchTerm}"`}
                </span>
              </div>
              
              {pagination.total_paginas > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="text-gray-600"
                  >
                    Anterior
                  </Button>
                  
                  <span className="text-sm text-gray-600 px-3">
                    Página {currentPage} de {pagination.total_paginas}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(pagination.total_paginas, currentPage + 1))}
                    disabled={currentPage === pagination.total_paginas}
                    className="text-gray-600"
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 border border-gray-200 rounded-lg shadow-lg px-6 py-4 z-50" style={{ backgroundColor: '#0f172a' }}>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-white">
              {selectedProducts.size} produto{selectedProducts.size > 1 ? 's' : ''} selecionado{selectedProducts.size > 1 ? 's' : ''}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white">
                  <Settings className="w-4 h-4" />
                  <span>Opções</span>
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Modificar Margem</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Alterar Preço / Estoque</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white text-gray-900 hover:bg-gray-100">
              <Power className="w-4 h-4" />
              <span>Inativar</span>
            </Button>

            <Button variant="destructive" size="sm" className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
