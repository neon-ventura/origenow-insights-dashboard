
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
    valorMin: number | null;
    valorMax: number | null;
    status: string;
    cidade: string;
    estado: string;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const PedidosFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: PedidosFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== null && value !== '' && value !== undefined && value !== 'all'
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
          {/* Filtro de Valor */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Valor Total (R$)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="valorMin" className="text-xs">Mínimo</Label>
                <Input
                  id="valorMin"
                  type="number"
                  placeholder="0.00"
                  value={filters.valorMin || ''}
                  onChange={(e) => onFilterChange('valorMin', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="valorMax" className="text-xs">Máximo</Label>
                <Input
                  id="valorMax"
                  type="number"
                  placeholder="0.00"
                  value={filters.valorMax || ''}
                  onChange={(e) => onFilterChange('valorMax', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>
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
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Cidade */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cidade</Label>
            <Input
              type="text"
              placeholder="Filtrar por cidade..."
              value={filters.cidade}
              onChange={(e) => onFilterChange('cidade', e.target.value)}
            />
          </div>

          {/* Filtro de Estado */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Estado</Label>
            <Input
              type="text"
              placeholder="Filtrar por estado..."
              value={filters.estado}
              onChange={(e) => onFilterChange('estado', e.target.value)}
            />
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
