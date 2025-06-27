
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';
import { ColumnConfig } from '@/hooks/useColumnVisibility';

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
}

export const ColumnSelector = ({ 
  columns, 
  visibleColumns, 
  onToggleColumn 
}: ColumnSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings2 className="w-4 h-4" />
          <span>Colunas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-50"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-gray-900">
          Mostrar Colunas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            className="cursor-pointer hover:bg-gray-50"
            checked={visibleColumns[column.key] ?? column.defaultVisible}
            onCheckedChange={() => onToggleColumn(column.key)}
          >
            <span className="text-sm text-gray-700">{column.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

