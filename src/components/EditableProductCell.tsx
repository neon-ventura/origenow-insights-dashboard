
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface EditableProductCellProps {
  value: string | null;
  type: 'price' | 'stock';
  onSave: (newValue: string) => void;
  className?: string;
}

export const EditableProductCell: React.FC<EditableProductCellProps> = ({
  value,
  type,
  onSave,
  className = ''
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
      onSave(editValue);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm min-w-[80px]"
          type={type === 'price' ? 'number' : 'text'}
          step={type === 'price' ? '0.01' : undefined}
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
    <div
      className={`cursor-pointer hover:bg-gray-50 p-1 rounded ${className}`}
      onClick={() => setIsEditing(true)}
      title="Clique para editar"
    >
      <span className={`text-sm ${type === 'price' ? 'font-semibold text-gray-900' : 'text-gray-600'} whitespace-nowrap`}>
        {formatDisplayValue()}
      </span>
    </div>
  );
};
