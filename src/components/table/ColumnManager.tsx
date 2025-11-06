'use client';

import { useState } from 'react';
import { useTableData } from '@/hooks/useTableData';
import { ColumnConfig } from '@/store/types';
import { v4 as uuidv4 } from 'uuid';
import { ColumnReorder } from './ColumnReorder';


import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Divider,
  Alert,
  FormControlLabel
} from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';

interface ColumnManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ColumnManager({ open, onOpenChange }: ColumnManagerProps) {
  const { columns, toggleColumnVisibility, addCustomColumn, resetColumns } = useTableData();
  
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<ColumnConfig['type']>('string');
  const [error, setError] = useState('');

  const visibleColumnsCount = columns.filter(col => col.visible).length;
  const totalColumnsCount = columns.length;

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      setError('Column name is required');
      return;
    }
    
    if (columns.some(col => col.id === newColumnName.toLowerCase().replace(/\s+/g, '_'))) {
      setError('A column with this name already exists');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(newColumnName)) {
      setError('Column name can only contain letters, numbers, and underscores');
      return;
    }
    
    if (newColumnName.length > 50) {
      setError('Column name must be 50 characters or less');
      return;
    }
    
    setError('');
    
    const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
    addCustomColumn({
      id: columnId,
      label: newColumnName,
      type: newColumnType,
    });
    
    setNewColumnName('');
    setNewColumnType('string');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default columns? This will remove all custom columns.')) {
      resetColumns();
    }
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setNewColumnType(event.target.value as ColumnConfig['type']);
  };

  return (
    <DialogContent dividers>
      <DialogTitle>Manage Columns</DialogTitle>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          {visibleColumnsCount} of {totalColumnsCount} columns visible
        </Typography>
      </Box>
      
      <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
        {columns.map((column) => (
          <Box key={column.id} sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.id)}
                  disabled={column.required}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">
                    {column.label}
                    {column.required && ' (required)'}
                  </Typography>
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reorder Columns
      </Typography>
      <ColumnReorder />
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Custom Field
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Enter column name"
          size="small"
        />
        
        <FormControl size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={newColumnType}
            label="Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="string">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </Select>
        </FormControl>
        
        <Button 
          variant="contained" 
          onClick={handleAddColumn}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Field
        </Button>
      </Box>
      
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={handleReset} variant="outlined">
          Reset to Default
        </Button>
        <Button onClick={() => onOpenChange(false)} variant="contained">
          Done
        </Button>
      </DialogActions>
    </DialogContent>
  );
}