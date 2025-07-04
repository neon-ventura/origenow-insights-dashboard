
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { SortConfig } from '@/hooks/useTableSorting';

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SortableTableHead = ({ 
  children, 
  sortKey, 
  sortConfig, 
  onSort, 
  className,
  style 
}: SortableTableHeadProps) => {
  const getSortIcon = () => {
    if (sortConfig.key !== sortKey) {
      return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4" />;
    } else if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4" />;
    }
    
    return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
  };

  return (
    <TableHead 
      className={`font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      style={style}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between space-x-2">
        <span>{children}</span>
        {getSortIcon()}
      </div>
    </TableHead>
  );
};
