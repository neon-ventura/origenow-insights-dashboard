
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';

interface PedidosFiltersProps {
  filters: {
    search: string;
    status: string;
    cidade: string;
    estado: string;
    intervalo: string;
    data_inicial: string;
    data_final: string;
    limit: number;
    page: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  opcoesFiltros?: {
    estados: string[];
    cidades: string[];
  };
}

export const PedidosFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  opcoesFiltros,
}: PedidosFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== null && value !== '' && value !== undefined && value !== '' && value !== 250 && value !== 1
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white rounded-full w-2 h-2"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filtros</SheetTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-auto p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <SheetDescription>
            Filtre os pedidos de acordo com seus critérios.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Filtro de Busca */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Busca Geral</Label>
            <Input
              type="text"
              placeholder="Buscar em todos os campos..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>

          {/* Filtro de Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="Shipped">Enviado</SelectItem>
                <SelectItem value="Pending">Pendente</SelectItem>
                <SelectItem value="Cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Intervalo */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Intervalo de Data</Label>
            <Select
              value={filters.intervalo}
              onValueChange={(value) => onFilterChange('intervalo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os períodos</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="semana-passada">Semana Passada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtros de Data Personalizada */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Data Personalizada</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dataInicial" className="text-xs">Data Inicial</Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={filters.data_inicial}
                  onChange={(e) => onFilterChange('data_inicial', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dataFinal" className="text-xs">Data Final</Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={filters.data_final}
                  onChange={(e) => onFilterChange('data_final', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filtro de Estado */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Estado</Label>
            {opcoesFiltros?.estados && opcoesFiltros.estados.length > 0 ? (
              <Select
                value={filters.estado}
                onValueChange={(value) => onFilterChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os estados</SelectItem>
                  {opcoesFiltros.estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                placeholder="Filtrar por estado..."
                value={filters.estado}
                onChange={(e) => onFilterChange('estado', e.target.value)}
              />
            )}
          </div>

          {/* Filtro de Cidade */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cidade</Label>
            {opcoesFiltros?.cidades && opcoesFiltros.cidades.length > 0 ? (
              <Select
                value={filters.cidade}
                onValueChange={(value) => onFilterChange('cidade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as cidades</SelectItem>
                  {opcoesFiltros.cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                placeholder="Filtrar por cidade..."
                value={filters.cidade}
                onChange={(e) => onFilterChange('cidade', e.target.value)}
              />
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onApplyFilters}
              className="flex-1"
              size="sm"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
