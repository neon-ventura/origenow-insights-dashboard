
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
import { useFornecedoresList } from '@/hooks/useFornecedoresList';
import { useUserContext } from '@/contexts/UserContext';

interface FornecedoresFiltersProps {
  filters: {
    precoMin: number | null;
    precoMax: number | null;
    custoMin: number | null;
    custoMax: number | null;
    estoqueMin: number | null;
    estoqueMax: number | null;
    fornecedor: string;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const FornecedoresFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: FornecedoresFiltersProps) => {
  const { selectedUser } = useUserContext();
  
  const { data: fornecedoresList } = useFornecedoresList(
    selectedUser?.sellerId,
    selectedUser?.user
  );

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
            Filtre os produtos de fornecedores de acordo com seus critérios.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Filtro de Preço */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preço Recomendado (R$)</Label>
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

          {/* Filtro de Custo */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Custo (R$)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="custoMin" className="text-xs">Mínimo</Label>
                <Input
                  id="custoMin"
                  type="number"
                  placeholder="0.00"
                  value={filters.custoMin || ''}
                  onChange={(e) => onFilterChange('custoMin', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="custoMax" className="text-xs">Máximo</Label>
                <Input
                  id="custoMax"
                  type="number"
                  placeholder="0.00"
                  value={filters.custoMax || ''}
                  onChange={(e) => onFilterChange('custoMax', e.target.value ? parseFloat(e.target.value) : null)}
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

          {/* Filtro de Fornecedor */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Fornecedor</Label>
            <Select
              value={filters.fornecedor}
              onValueChange={(value) => onFilterChange('fornecedor', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os fornecedores</SelectItem>
                {fornecedoresList?.fornecedores?.map((fornecedor) => (
                  <SelectItem key={fornecedor} value={fornecedor}>
                    {fornecedor}
                  </SelectItem>
                ))}
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
