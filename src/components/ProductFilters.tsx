
import React from 'react';
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
  precoMin: number | null;
  precoMax: number | null;
  statusProduto: string;
  tipo_produto: string;
  statusErro: string;
  estoqueMin: number | null;
  estoqueMax: number | null;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== 'all'
  );

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
          {/* Faixa de preço */}
          <div className="space-y-3">
            <Label>Faixa de Preço (R$)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.precoMin || ''}
                  onChange={(e) => onFilterChange('precoMin', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.precoMax || ''}
                  onChange={(e) => onFilterChange('precoMax', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>
          </div>

          {/* Status do Produto */}
          <div className="space-y-2">
            <Label>Status do Produto</Label>
            <Select
              value={filters.statusProduto}
              onValueChange={(value) => onFilterChange('statusProduto', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Produto */}
          <div className="space-y-2">
            <Label>Tipo de Produto</Label>
            <Select
              value={filters.tipo_produto}
              onValueChange={(value) => onFilterChange('tipo_produto', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="proprio">Próprio</SelectItem>
                <SelectItem value="fornecedor">Fornecedor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status do Erro */}
          <div className="space-y-2">
            <Label>Status do Erro</Label>
            <Select
              value={filters.statusErro}
              onValueChange={(value) => onFilterChange('statusErro', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Pesquisa Ativa">Pesquisa Ativa</SelectItem>
                <SelectItem value="Pesquisa Suprimida">Pesquisa Suprimida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Faixa de estoque */}
          <div className="space-y-3">
            <Label>Faixa de Estoque</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.estoqueMin || ''}
                  onChange={(e) => onFilterChange('estoqueMin', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.estoqueMax || ''}
                  onChange={(e) => onFilterChange('estoqueMax', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
          </div>

          {/* Botão para aplicar filtros */}
          <Button
            onClick={onApplyFilters}
            className="w-full"
            variant="default"
          >
            Aplicar Filtros
          </Button>

          {/* Botão para limpar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
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
