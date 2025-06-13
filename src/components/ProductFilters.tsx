
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { ChevronDown, X } from 'lucide-react';

interface FilterOptions {
  status: string;
  minPrice: number | null;
  maxPrice: number | null;
  minStock: number | null;
  maxStock: number | null;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  onClearFilters: () => void;
  onApplyPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyPriceFilter,
}) => {
  const [tempMinPrice, setTempMinPrice] = useState<number | null>(filters.minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<number | null>(filters.maxPrice);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== 'all'
  );

  const handleApplyPriceFilter = () => {
    onApplyPriceFilter(tempMinPrice, tempMaxPrice);
  };

  const handleClearFilters = () => {
    setTempMinPrice(null);
    setTempMaxPrice(null);
    onClearFilters();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <span>Filtros</span>
          <ChevronDown className="w-4 h-4" />
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros de Produtos</SheetTitle>
          <SheetDescription>
            Use os filtros abaixo para refinar a lista de produtos
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Active">Ativo</SelectItem>
                <SelectItem value="Inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Faixa de preço */}
          <div className="space-y-3">
            <Label>Faixa de Preço (R$)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Mín"
                  value={tempMinPrice || ''}
                  onChange={(e) => setTempMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={tempMaxPrice || ''}
                  onChange={(e) => setTempMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>
            <Button 
              onClick={handleApplyPriceFilter}
              className="w-full"
              variant="default"
            >
              Aplicar Filtro de Preço
            </Button>
          </div>

          {/* Faixa de estoque */}
          <div className="space-y-3">
            <Label>Faixa de Estoque</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.minStock || ''}
                  onChange={(e) => onFilterChange('minStock', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxStock || ''}
                  onChange={(e) => onFilterChange('maxStock', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
