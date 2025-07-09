
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil } from 'lucide-react';

interface EditableProductCellProps {
  value: string | null;
  type: 'price' | 'stock';
  onSave: (newValue: string) => void;
  className?: string;
  originalValue?: string | null;
}

export const EditableProductCell: React.FC<EditableProductCellProps> = ({
  value,
  type,
  onSave,
  className = '',
  originalValue
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (type === 'price' && value) {
      const numericValue = parseFloat(value);
      setEditValue(numericValue.toFixed(2));
    } else {
      setEditValue(value || '');
    }
  }, [value, type]);

  const handleSave = () => {
    if (editValue.trim()) {
      // Validate based on type
      if (type === 'stock') {
        const intValue = parseInt(editValue);
        if (isNaN(intValue) || intValue < 0) {
          return; // Don't save invalid values
        }
        onSave(intValue.toString());
      } else if (type === 'price') {
        const floatValue = parseFloat(editValue.replace(',', '.'));
        if (isNaN(floatValue) || floatValue < 0) {
          return; // Don't save invalid values
        }
        onSave(floatValue.toString());
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const formatDisplayValue = () => {
    if (!value) return '---';
    if (type === 'price') {
      const numPrice = parseFloat(value);
      return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
    }
    return value;
  };

  const formatOriginalValue = () => {
    if (!originalValue) return '';
    if (type === 'price') {
      const numPrice = parseFloat(originalValue);
      return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
    }
    return originalValue;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    if (type === 'stock') {
      // Only allow integers
      inputValue = inputValue.replace(/[^0-9]/g, '');
    } else if (type === 'price') {
      // Allow numbers with comma or dot as decimal separator
      inputValue = inputValue.replace(/[^0-9,\.]/g, '');
      // Replace dot with comma for Brazilian format
      inputValue = inputValue.replace('.', ',');
      // Only allow one comma
      const commaCount = (inputValue.match(/,/g) || []).length;
      if (commaCount > 1) {
        inputValue = inputValue.substring(0, inputValue.lastIndexOf(','));
      }
    }
    
    setEditValue(inputValue);
  };

  const hasChanged = originalValue && value !== originalValue;

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Input
          value={editValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm min-w-[80px]"
          placeholder={type === 'price' ? '0,00' : '0'}
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div
        className="group cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center gap-1"
        onClick={() => setIsEditing(true)}
        title="Clique para editar"
      >
        <div className="flex flex-col">
          <span className={`text-sm ${type === 'price' ? 'font-semibold text-gray-900' : 'text-gray-600'} whitespace-nowrap`}>
            {formatDisplayValue()}
          </span>
          {hasChanged && (
            <span className="text-xs text-red-500 line-through">
              {formatOriginalValue()}
            </span>
          )}
        </div>
        <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
