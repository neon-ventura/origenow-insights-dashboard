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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Search, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';
import { useProductFilters } from '@/hooks/useProductFilters';
import { ProductFilters } from '@/components/ProductFilters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnSelector } from '@/components/ColumnSelector';

// Define as colunas disponíveis
const COLUMN_CONFIG = [
  { key: 'sku', label: 'SKU', defaultVisible: true },
  { key: 'nome', label: 'Nome', defaultVisible: true },
  { key: 'asin', label: 'ASIN', defaultVisible: true },
  { key: 'preco', label: 'Preço de Venda', defaultVisible: true },
  { key: 'estoque', label: 'Estoque', defaultVisible: true },
];

export const ProductsTable = () => {
  const { selectedUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const { filters, updateFilter, clearFilters } = useProductFilters();
  const { visibleColumns, toggleColumn, isColumnVisible } = useColumnVisibility(COLUMN_CONFIG);

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive",
      });
    }
  };

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
        'Nome': product.titulo,
        ASIN: product.asin,
        'Preço de Venda (R$)': product.preço ? parseFloat(product.preço).toFixed(2).replace('.', ',') : '---',
        'Estoque': product.quantidade,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      const columnWidths = [
        { wch: 15 }, { wch: 50 }, { wch: 15 }, { wch: 18 }, { wch: 10 },
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

  const formatPrice = (price: string | null) => {
    if (!price) return '---';
    const numPrice = parseFloat(price);
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const handlePreviousPage = () => {
    if (pagination && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.total_paginas) {
      setCurrentPage(currentPage + 1);
    }
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
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header da Tabela */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Meus Anúncios</h2>
              <p className="text-sm text-gray-500">
                Gerencie seus anúncios e monitore o desempenho de vendas
                <span className="ml-2 text-blue-600">
                  ({products.length} produtos na página atual)
                </span>
                {pagination && (
                  <span className="ml-2 text-gray-500">
                    • {pagination.total_itens} produtos no total
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ColumnSelector 
                columns={COLUMN_CONFIG}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
              />
              <ProductFilters
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
                disabled={products.length === 0}
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
                placeholder="Buscar por nome, ASIN ou SKU..."
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
                  <TableHead className="w-12 font-semibold text-gray-900">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      disabled={products.length === 0}
                    />
                  </TableHead>
                  {isColumnVisible('sku') && (
                    <TableHead className="font-semibold text-gray-900">SKU</TableHead>
                  )}
                  {isColumnVisible('nome') && (
                    <TableHead className="font-semibold text-gray-900">Nome</TableHead>
                  )}
                  {isColumnVisible('asin') && (
                    <TableHead className="font-semibold text-gray-900">ASIN</TableHead>
                  )}
                  {isColumnVisible('preco') && (
                    <TableHead className="font-semibold text-gray-900">Preço de Venda</TableHead>
                  )}
                  {isColumnVisible('estoque') && (
                    <TableHead className="font-semibold text-gray-900">Estoque</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="text-center py-8 text-gray-500">
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
                      {isColumnVisible('sku') && (
                        <TableCell className="font-mono text-sm font-medium text-blue-600">
                          <button
                            onClick={() => copyToClipboard(product.sku, 'SKU')}
                            className="hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer flex items-center space-x-1"
                            title="Clique para copiar o SKU"
                          >
                            <span>{product.sku}</span>
                            <Copy className="w-3 h-3 opacity-50" />
                          </button>
                        </TableCell>
                      )}
                      {isColumnVisible('nome') && (
                        <TableCell className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900" title={product.titulo}>
                            {truncateTitle(product.titulo)}
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('asin') && (
                        <TableCell className="font-mono text-sm text-gray-600">
                          <button
                            onClick={() => copyToClipboard(product.asin, 'ASIN')}
                            className="hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer flex items-center space-x-1"
                            title="Clique para copiar o ASIN"
                          >
                            <span>{product.asin}</span>
                            <Copy className="w-3 h-3 opacity-50" />
                          </button>
                        </TableCell>
                      )}
                      {isColumnVisible('preco') && (
                        <TableCell className="text-sm font-semibold text-gray-900">
                          {formatPrice(product.preço)}
                        </TableCell>
                      )}
                      {isColumnVisible('estoque') && (
                        <TableCell className="text-sm text-gray-600">
                          {product.quantidade}
                        </TableCell>
                      )}
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
                {products.length} produtos na página atual
                {selectedUser && ` de ${selectedUser.nickname}`}
                {activeSearchTerm && ` (buscando por "${activeSearchTerm}")`}
              </span>
              {pagination && (
                <div className="mt-1">
                  <span>
                    Página {pagination.pagina_atual} de {pagination.total_paginas} • 
                    Total: {pagination.total_itens} produtos • 
                    {pagination.itens_por_pagina} por página
                  </span>
                </div>
              )}
            </div>
            
            {pagination && pagination.total_paginas > 1 && (
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
                  <span className="text-sm text-gray-500">de {pagination.total_paginas}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= pagination.total_paginas}
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
