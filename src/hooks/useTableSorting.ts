import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

export const useTableSorting = (data: any[], initialSort?: SortConfig) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    initialSort || { key: null, direction: null }
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key!);
      const bValue = getNestedValue(b, sortConfig.key!);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Clean monetary values (remove R$, currency symbols)
      const cleanA = cleanValue(aValue);
      const cleanB = cleanValue(bValue);

      let comparison = 0;

      // Try to compare as numbers first
      const numA = parseFloat(cleanA);
      const numB = parseFloat(cleanB);

      if (!isNaN(numA) && !isNaN(numB)) {
        comparison = numA - numB;
      } else {
        // Compare as strings
        comparison = cleanA.toString().localeCompare(cleanB.toString(), 'pt-BR', {
          numeric: true,
          sensitivity: 'base'
        });
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // Cycle through: asc -> desc -> null
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  return {
    sortedData,
    sortConfig,
    handleSort
  };
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper function to clean values for comparison
const cleanValue = (value: any): string => {
  if (value == null) return '';
  
  const str = value.toString();
  
  // Remove currency symbols and formatting
  return str
    .replace(/R\$\s?/g, '')
    .replace(/[,\.]/g, (match, offset, string) => {
      // Keep the last dot as decimal separator, replace others
      const lastDotIndex = string.lastIndexOf('.');
      const lastCommaIndex = string.lastIndexOf(',');
      
      if (offset === Math.max(lastDotIndex, lastCommaIndex) && 
          string.length - offset <= 3) {
        return '.';
      }
      return '';
    })
    .trim();
};
