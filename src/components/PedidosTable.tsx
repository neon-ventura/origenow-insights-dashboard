
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
import { Badge } from '@/components/ui/badge';
import { Download, Search, ChevronLeft, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnSelector } from '@/components/ColumnSelector';
import { PedidosFilters } from '@/components/PedidosFilters';
import { usePedidosFilters } from '@/hooks/usePedidosFilters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define as colunas disponíveis na ordem especificada
const COLUMN_CONFIG = [
  { key: 'id', label: 'ID do Pedido', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
  { key: 'items', label: 'Itens', defaultVisible: true },
  { key: 'valor', label: 'Valor Total', defaultVisible: true },
  { key: 'localizacao', label: 'Localização', defaultVisible: true },
  { key: 'data', label: 'Data', defaultVisible: true },
];

interface PedidoItem {
  asin: string;
  sku: string;
  titulo: string;
  preco_unitario: string;
  quantidade: string;
  link: string;
}

interface Pedido {
  id: string;
  status: string;
  link: string;
  items: PedidoItem[];
  frete: string;
  envio: string;
  valor_total: string;
  cidade: string;
  estado: string;
  nickname: string;
  data_compra: string;
}

interface PedidosTableProps {
  pedidos: Pedido[];
  pagination?: {
    pagina_atual: number;
    total_paginas: number;
    total_itens: number;
    itens_por_pagina: number;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'shipped':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'shipped':
      return 'Enviado';
    case 'cancelled':
      return 'Cancelado';
    case 'pending':
      return 'Pendente';
    default:
      return status;
  }
};

export const PedidosTable = ({ pedidos, pagination }: PedidosTableProps) => {
  const { selectedUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedPedidos, setSelectedPedidos] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const { visibleColumns, toggleColumn, isColumnVisible } = useColumnVisibility(COLUMN_CONFIG);
  const { filters, updateFilter, clearFilters } = usePedidosFilters();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm]);

  useEffect(() => {
    setSelectedPedidos(new Set());
    setSelectAll(false);
  }, [pedidos]);

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

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allPedidoIds = new Set(pedidos.map(pedido => pedido.id));
      setSelectedPedidos(allPedidoIds);
    } else {
      setSelectedPedidos(new Set());
    }
  };

  const handleSelectPedido = (pedidoId: string, checked: boolean) => {
    const newSelected = new Set(selectedPedidos);
    if (checked) {
      newSelected.add(pedidoId);
    } else {
      newSelected.delete(pedidoId);
      setSelectAll(false);
    }
    setSelectedPedidos(newSelected);
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

  const exportToExcel = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Token não encontrado",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    if (pedidos.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há pedidos para exportar.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Iniciando exportação",
        description: "Gerando arquivo Excel com os pedidos...",
      });

      const exportData = pedidos.map(pedido => ({
        'ID do Pedido': pedido.id,
        'Data': formatDate(pedido.data_compra),
        'Status': getStatusText(pedido.status),
        'Valor Total (R$)': formatCurrency(pedido.valor_total),
        'Cidade': pedido.cidade,
        'Estado': pedido.estado,
        'Itens': pedido.items.map(item => `${item.titulo} (Qtd: ${item.quantidade})`).join(', '),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      const columnWidths = [
        { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, 
        { wch: 20 }, { wch: 15 }, { wch: 50 },
      ];
      ws['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `pedidos_${selectedUser?.nickname || 'usuario'}_${timestamp}.xlsx`;

      XLSX.writeFile(wb, fileName);

      toast({
        title: "Exportação concluída",
        description: `${pedidos.length} pedidos exportados com sucesso.`,
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

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return dateString;
    }
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

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header da Tabela */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Meus Pedidos</h2>
              <p className="text-sm text-gray-500">
                Visualize e gerencie todos os seus pedidos da Amazon
                <span className="ml-2 text-blue-600">
                  ({pedidos.length} pedidos na página atual)
                </span>
                {pagination && (
                  <span className="ml-2 text-gray-500">
                    • {pagination.total_itens} pedidos no total
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
              <PedidosFilters
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
                disabled={pedidos.length === 0}
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
                placeholder="Buscar por ID do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="flex items-center space-x-2"
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
                      disabled={pedidos.length === 0}
                    />
                  </TableHead>
                  {isColumnVisible('id') && (
                    <TableHead className="font-semibold text-gray-900">ID do Pedido</TableHead>
                  )}
                  {isColumnVisible('status') && (
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  )}
                  {isColumnVisible('items') && (
                    <TableHead className="font-semibold text-gray-900">Itens</TableHead>
                  )}
                  {isColumnVisible('valor') && (
                    <TableHead className="font-semibold text-gray-900">Valor Total</TableHead>
                  )}
                  {isColumnVisible('localizacao') && (
                    <TableHead className="font-semibold text-gray-900">Localização</TableHead>
                  )}
                  {isColumnVisible('data') && (
                    <TableHead className="font-semibold text-gray-900">Data</TableHead>
                  )}
                  <TableHead className="font-semibold text-gray-900">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="text-center py-8 text-gray-500">
                      {activeSearchTerm ? 
                        `Nenhum pedido encontrado para "${activeSearchTerm}"` :
                        "Nenhum pedido encontrado"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidos.map((pedido, index) => (
                    <TableRow key={`${pedido.id}-${index}`} className="hover:bg-gray-50">
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedPedidos.has(pedido.id)}
                          onCheckedChange={(checked) => handleSelectPedido(pedido.id, checked as boolean)}
                        />
                      </TableCell>
                      {isColumnVisible('id') && (
                        <TableCell className="font-mono text-sm font-medium text-blue-600">
                          <button
                            onClick={() => copyToClipboard(pedido.id, 'ID do Pedido')}
                            className="hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer flex items-center space-x-1"
                            title="Clique para copiar o ID"
                          >
                            <span>{pedido.id}</span>
                            <Copy className="w-3 h-3 opacity-50" />
                          </button>
                        </TableCell>
                      )}
                      {isColumnVisible('status') && (
                        <TableCell>
                          <Badge className={getStatusColor(pedido.status)}>
                            {getStatusText(pedido.status)}
                          </Badge>
                        </TableCell>
                      )}
                      {isColumnVisible('items') && (
                        <TableCell className="max-w-xs">
                          <div className="space-y-1">
                            {pedido.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-sm">
                                <div className="font-medium truncate" title={item.titulo}>
                                  {truncateTitle(item.titulo)}
                                </div>
                                <div className="text-gray-500">
                                  Qtd: {item.quantidade} | {formatCurrency(item.preco_unitario)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('valor') && (
                        <TableCell className="text-sm font-semibold text-gray-900">
                          {formatCurrency(pedido.valor_total)}
                        </TableCell>
                      )}
                      {isColumnVisible('localizacao') && (
                        <TableCell className="text-sm">
                          <div>
                            <div>{pedido.cidade}</div>
                            <div className="text-gray-500">{pedido.estado}</div>
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('data') && (
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(pedido.data_compra)}
                        </TableCell>
                      )}
                      <TableCell>
                        <a
                          href={pedido.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md whitespace-nowrap transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        >
                          Ver Pedido
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
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
                {pedidos.length} pedidos na página atual
                {selectedUser && ` de ${selectedUser.nickname}`}
                {activeSearchTerm && ` (buscando por "${activeSearchTerm}")`}
              </span>
              {pagination && (
                <div className="mt-1">
                  <span>
                    Página {pagination.pagina_atual} de {pagination.total_paginas} • 
                    Total: {pagination.total_itens} pedidos • 
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
