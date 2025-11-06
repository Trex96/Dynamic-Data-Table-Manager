'use client';

import { useState, useEffect, useRef } from 'react';
import { ColumnConfig } from '@/store/types';
import { useToast } from '@/hooks/use-toast';


import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Box 
} from '@mui/material';

interface EditableCellProps {
  rowId: string;
  columnId: string;
  value: string | number | boolean;
  columnType: ColumnConfig['type'];
  onSave: (value: string | number | boolean) => void;
  onCancel: () => void;
}

export function EditableCell({ 
  rowId, 
  columnId, 
  value, 
  columnType,
  onSave,
  onCancel 
}: EditableCellProps) {

  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    let validatedValue: string | number | boolean = editValue;
    
    switch (columnType) {
      case 'number':
        const numValue = Number(editValue);
        if (isNaN(numValue)) {
          toast({
            title: "Invalid Input",
            description: "Please enter a valid number",
          });
          onCancel();
          return;
        }
        validatedValue = numValue;
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof editValue === 'string' && !emailRegex.test(editValue)) {
          toast({
            title: "Invalid Input",
            description: "Please enter a valid email address",
          });
          onCancel();
          return;
        }
        break;
        
      case 'boolean':
        validatedValue = Boolean(editValue);
        break;
    }
    
    onSave(validatedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
  };

  const renderInput = () => {
    switch (columnType) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(editValue)}
                onChange={(e) => setEditValue(e.target.checked)}
                onKeyDown={handleKeyDown}
                size="small"
              />
            }
            label=""
          />
        );
        
      case 'number':
        return (
          <TextField
            inputRef={inputRef}
            type="number"
            value={typeof editValue === 'number' ? editValue : 0}
            onChange={(e) => setEditValue(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            size="small"
            fullWidth
          />
        );
        
      case 'email':
        return (
          <TextField
            inputRef={inputRef}
            type="email"
            value={typeof editValue === 'string' ? editValue : ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            size="small"
            fullWidth
          />
        );
        
      default:
        return (
          <TextField
            inputRef={inputRef}
            value={typeof editValue === 'string' ? editValue : ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            size="small"
            fullWidth
          />
        );
    }
  };

  return (
    <Box 
      sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }} 
      onClick={(e) => e.stopPropagation()}
    >
      {renderInput()}
    </Box>
  );
}