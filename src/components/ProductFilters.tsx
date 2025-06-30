
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

interface ProductFiltersProps {
  filters: {
    precoMin: number | null;
    precoMax: number | null;
    estoqueMin: number | null;
    estoqueMax: number | null;
    status: string;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const ProductFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: ProductFiltersProps) => {
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
            Filtre os produtos de acordo com seus critérios.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Filtro de Preço */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preço de Venda (R$)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="precoMin" className="text-xs">Mínimo</Label>
                <Input
                  id="precoMin"
                  type="number"
                  placeholder="0.00"
                  value={filters.precoMin || ''}
                  onChange={(e) => onFilterChange('precoMin', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="precoMax" className="text-xs">Máximo</Label>
                <Input
                  id="precoMax"
                  type="number"
                  placeholder="0.00"
                  value={filters.precoMax || ''}
                  onChange={(e) => onFilterChange('precoMax', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>
          </div>

          {/* Filtro de Estoque */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Estoque</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="estoqueMin" className="text-xs">Mínimo</Label>
                <Input
                  id="estoqueMin"
                  type="number"
                  placeholder="0"
                  value={filters.estoqueMin || ''}
                  onChange={(e) => onFilterChange('estoqueMin', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="estoqueMax" className="text-xs">Máximo</Label>
                <Input
                  id="estoqueMax"
                  type="number"
                  placeholder="0"
                  value={filters.estoqueMax || ''}
                  onChange={(e) => onFilterChange('estoqueMax', e.target.value ? parseInt(e.target.value) : null)}
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
                <SelectItem value="all">Todos os produtos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
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
