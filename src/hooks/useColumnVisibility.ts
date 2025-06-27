
import { useState } from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  defaultVisible: boolean;
}

export const useColumnVisibility = (columns: ColumnConfig[]) => {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => {
      acc[col.key] = col.defaultVisible;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const isColumnVisible = (columnKey: string) => {
    return visibleColumns[columnKey] ?? true;
  };

  const getVisibleColumnsCount = () => {
    return Object.values(visibleColumns).filter(Boolean).length;
  };

  return {
    visibleColumns,
    toggleColumn,
    isColumnVisible,
    getVisibleColumnsCount,
  };
};

