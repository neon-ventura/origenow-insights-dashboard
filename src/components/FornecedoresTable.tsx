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
import { ColumnSelector } from '@/components/ColumnSelector';
import { useColumnVisibility, ColumnConfig } from '@/hooks/useColumnVisibility';
import { useTableSorting } from '@/hooks/useTableSorting';
import { SortableTableHead } from '@/components/SortableTableHead';
import { LoadingSplash } from '@/components/LoadingSplash';

interface FornecedoresTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  selectedProducts: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
}

const COLUMN_CONFIGS: ColumnConfig[] = [
  { key: 'asin', label: 'ASIN', defaultVisible: true },
  { key: 'sku', label: 'SKU', defaultVisible: true },
  { key: 'codigo_fornecedor', label: 'Código Fornecedor', defaultVisible: false },
  { key: 'status', label: 'Status', defaultVisible: true },
  { key: 'descricao', label: 'Descrição', defaultVisible: true },
  { key: 'marca', label: 'Marca', defaultVisible: true },
  { key: 'custo', label: 'Custo', defaultVisible: true },
  { key: 'valor_recomendado', label: 'Valor Recomendado', defaultVisible: true },
  { key: 'estoque', label: 'Estoque', defaultVisible: true },
  { key: 'gtin', label: 'GTIN', defaultVisible: false },
];

export const FornecedoresTable = ({ 
  currentPage, 
  onPageChange, 
  selectedProducts, 
  onSelectionChange 
}: FornecedoresTableProps) => {
  const { selectedUser } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  
  const {
    visibleColumns,
    toggleColumn,
    isColumnVisible,
  } = useColumnVisibility(COLUMN_CONFIGS);

  const {
    filters,
    updateFilter,
    clearFilters,
    buildFilterParams,
  } = useFornecedoresFilters();

  const [appliedFilters, setAppliedFilters] = useState({});

  const { data, isLoading, error } = useFornecedoresProducts(
    currentPage,
    appliedFilters,
    appliedSearchTerm
  );

  const products = data?.produtos || [];
  const paginacao = data?.paginacao;

  // Add sorting functionality
  const { sortedData: sortedProducts, sortConfig, handleSort } = useTableSorting(products);

  // Copy to clipboard function
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
    console.log('Searching for:', searchTerm);
    setAppliedSearchTerm(searchTerm);
    onPageChange(1); // Reset to first page when searching
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

      // Preparar dados para exportação incluindo apenas colunas visíveis
      const exportData = products.map(product => {
        const row: any = {};
        
        if (isColumnVisible('asin')) row['ASIN'] = product.asin;
        if (isColumnVisible('sku')) row['SKU'] = product.sku;
        if (isColumnVisible('codigo_fornecedor')) row['Código Fornecedor'] = product.codigo_fornecedor;
        if (isColumnVisible('descricao')) row['Descrição'] = product.descricao;
        if (isColumnVisible('marca')) row['Marca'] = product.marca;
        if (isColumnVisible('custo')) row['Custo (R$)'] = product.custo ? parseFloat(product.custo).toFixed(2).replace('.', ',') : '---';
        if (isColumnVisible('valor_recomendado')) row['Valor Recomendado (R$)'] = product.valor_recomendado ? parseFloat(product.valor_recomendado).toFixed(2).replace('.', ',') : '---';
        if (isColumnVisible('estoque')) row['Estoque'] = product.estoque;
        if (isColumnVisible('gtin')) row['GTIN'] = product.gtin;
        
        return row;
      });

      // Criar workbook e worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Definir largura das colunas baseado nas colunas visíveis
      const columnWidths = [];
      if (isColumnVisible('asin')) columnWidths.push({ wch: 15 });
      if (isColumnVisible('sku')) columnWidths.push({ wch: 15 });
      if (isColumnVisible('codigo_fornecedor')) columnWidths.push({ wch: 20 });
      if (isColumnVisible('descricao')) columnWidths.push({ wch: 50 });
      if (isColumnVisible('marca')) columnWidths.push({ wch: 15 });
      if (isColumnVisible('custo')) columnWidths.push({ wch: 15 });
      if (isColumnVisible('valor_recomendado')) columnWidths.push({ wch: 18 });
      if (isColumnVisible('estoque')) columnWidths.push({ wch: 10 });
      if (isColumnVisible('gtin')) columnWidths.push({ wch: 20 });
      
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
        description: `${products.length} produtos exportados com sucesso.`,
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
    setSearchTerm('');
    setAppliedSearchTerm('');
    onPageChange(1);
  };

  // Add selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allProductIds = new Set(sortedProducts.map(product => product.sku.toString()));
      onSelectionChange(allProductIds);
    } else {
      onSelectionChange(new Set());
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
    onSelectionChange(newSelected);
  };

  // Update selectAll state when selectedProducts changes
  useEffect(() => {
    if (sortedProducts.length > 0) {
      const allSelected = sortedProducts.every(product => selectedProducts.has(product.sku.toString()));
      setSelectAll(allSelected);
    }
  }, [selectedProducts, sortedProducts]);

  // Reset selection only when changing pages or applying filters
  useEffect(() => {
    onSelectionChange(new Set());
    setSelectAll(false);
  }, [currentPage, appliedFilters, appliedSearchTerm]);

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">Selecione um usuário para visualizar os produtos dos fornecedores</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSplash message="Carregando produtos dos fornecedores..." />;
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
                  ({products.length} produtos na página atual)
                </span>
                {paginacao && (
                  <span className="ml-2 text-gray-500">
                    • {paginacao.total_itens} produtos no total
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ColumnSelector 
                columns={COLUMN_CONFIGS}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
              />
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
                placeholder="Buscar por nome, código fornecedor ou GTIN..."
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
            <Table style={{ tableLayout: 'auto', width: '100%' }}>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12 font-semibold text-gray-900" style={{ width: 'auto', minWidth: '48px' }}>
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      disabled={sortedProducts.length === 0}
                    />
                  </TableHead>
                  {isColumnVisible('asin') && (
                    <SortableTableHead
                      sortKey="asin"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      ASIN
                    </SortableTableHead>
                  )}
                  {isColumnVisible('sku') && (
                    <SortableTableHead
                      sortKey="sku"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      SKU
                    </SortableTableHead>
                  )}
                  {isColumnVisible('codigo_fornecedor') && (
                    <SortableTableHead
                      sortKey="codigo_fornecedor"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Código Fornecedor
                    </SortableTableHead>
                  )}
                  {isColumnVisible('status') && (
                    <SortableTableHead
                      sortKey="asin"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Status
                    </SortableTableHead>
                  )}
                  {isColumnVisible('descricao') && (
                    <SortableTableHead
                      sortKey="descricao"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Descrição
                    </SortableTableHead>
                  )}
                  {isColumnVisible('marca') && (
                    <SortableTableHead
                      sortKey="marca"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Marca
                    </SortableTableHead>
                  )}
                  {isColumnVisible('custo') && (
                    <SortableTableHead
                      sortKey="custo"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Custo
                    </SortableTableHead>
                  )}
                  {isColumnVisible('valor_recomendado') && (
                    <SortableTableHead
                      sortKey="valor_recomendado"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Valor Recomendado
                    </SortableTableHead>
                  )}
                  {isColumnVisible('estoque') && (
                    <SortableTableHead
                      sortKey="estoque"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      Estoque
                    </SortableTableHead>
                  )}
                  {isColumnVisible('gtin') && (
                    <SortableTableHead
                      sortKey="gtin"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      style={{ width: 'auto', minWidth: 'fit-content' }}
                    >
                      GTIN
                    </SortableTableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      {appliedSearchTerm ? 
                        `Nenhum produto encontrado para "${appliedSearchTerm}"` :
                        "Nenhum produto de fornecedor encontrado"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product, index) => (
                    <TableRow key={`${product.sku}-${index}`} className="hover:bg-gray-50">
                      <TableCell className="w-12" style={{ width: 'auto', minWidth: '48px' }}>
                        <Checkbox
                          checked={selectedProducts.has(product.sku.toString())}
                          onCheckedChange={(checked) => handleSelectProduct(product.sku.toString(), checked as boolean)}
                        />
                      </TableCell>
                      {isColumnVisible('asin') && (
                        <TableCell className="font-mono text-sm text-gray-600" style={{ width: 'auto' }}>
                          {product.asin ? (
                            <button
                              onClick={() => copyToClipboard(product.asin, 'ASIN')}
                              className="hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer flex items-center space-x-1 whitespace-nowrap"
                              title="Clique para copiar o ASIN"
                            >
                              <span>{product.asin}</span>
                              <Copy className="w-3 h-3 opacity-50" />
                            </button>
                          ) : (
                            <span>---</span>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible('sku') && (
                        <TableCell className="font-mono text-sm font-medium text-blue-600" style={{ width: 'auto' }}>
                          <button
                            onClick={() => copyToClipboard(product.sku.toString(), 'SKU')}
                            className="hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer flex items-center space-x-1 whitespace-nowrap"
                            title="Clique para copiar o SKU"
                          >
                            <span>{product.sku}</span>
                            <Copy className="w-3 h-3 opacity-50" />
                          </button>
                        </TableCell>
                      )}
                      {isColumnVisible('codigo_fornecedor') && (
                        <TableCell className="font-mono text-sm text-gray-600" style={{ width: 'auto' }}>
                          {product.codigo_fornecedor ? (
                            <button
                              onClick={() => copyToClipboard(product.codigo_fornecedor, 'Código Fornecedor')}
                              className="hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer flex items-center space-x-1 whitespace-nowrap"
                              title="Clique para copiar o Código Fornecedor"
                            >
                              <span>{product.codigo_fornecedor}</span>
                              <Copy className="w-3 h-3 opacity-50" />
                            </button>
                          ) : (
                            <span>---</span>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible('status') && (
                        <TableCell style={{ width: 'auto' }}>
                          {getStatusBadge(product.asin)}
                        </TableCell>
                      )}
                      {isColumnVisible('descricao') && (
                        <TableCell style={{ width: 'auto' }}>
                          <div className="text-sm font-medium text-gray-900" title={product.descricao}>
                            {product.descricao}
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('marca') && (
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap" style={{ width: 'auto' }}>
                          {product.marca}
                        </TableCell>
                      )}
                      {isColumnVisible('custo') && (
                        <TableCell className="text-sm font-semibold text-gray-900 whitespace-nowrap" style={{ width: 'auto' }}>
                          {formatPrice(product.custo)}
                        </TableCell>
                      )}
                      {isColumnVisible('valor_recomendado') && (
                        <TableCell className="text-sm font-semibold text-gray-900 whitespace-nowrap" style={{ width: 'auto' }}>
                          {formatPrice(product.valor_recomendado)}
                        </TableCell>
                      )}
                      {isColumnVisible('estoque') && (
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap" style={{ width: 'auto' }}>
                          {product.estoque}
                        </TableCell>
                      )}
                      {isColumnVisible('gtin') && (
                        <TableCell className="font-mono text-sm text-gray-600 whitespace-nowrap" style={{ width: 'auto' }}>
                          {product.gtin}
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
                {appliedSearchTerm && ` (buscando por "${appliedSearchTerm}")`}
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
