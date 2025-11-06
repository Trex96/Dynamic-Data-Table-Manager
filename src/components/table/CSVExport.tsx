'use client';

import { useState } from 'react';
import { useTableData } from '@/hooks/useTableData';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { toast } from '@/hooks/use-toast';


import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';

interface CSVExportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CSVExport({ open, onOpenChange }: CSVExportProps) {
  const { data, columns, searchTerm, sorting } = useTableData();
  
  const [exportOptions, setExportOptions] = useState({
    visibleColumnsOnly: true,
    currentPageOnly: false,
    allData: true,
  });

  const handleExport = () => {
    let exportData = [...data];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      exportData = exportData.filter(row => 
        Object.values(row).some(
          value => String(value).toLowerCase().includes(term)
        )
      );
    }
    
    if (sorting.sortBy && sorting.sortDirection) {
      exportData = [...exportData].sort((a, b) => {
        if (sorting.sortBy === null) return 0;
        
        const aValue = a[sorting.sortBy];
        const bValue = b[sorting.sortBy];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sorting.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            return sorting.sortDirection === 'asc' 
              ? aDate.getTime() - bDate.getTime() 
              : bDate.getTime() - aDate.getTime();
          }
        }
        
        const aStr = String(aValue);
        const bStr = String(bValue);
        
        return sorting.sortDirection === 'asc' 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      });
    }
    
    let exportColumns = columns;
    if (exportOptions.visibleColumnsOnly) {
      exportColumns = columns.filter(col => col.visible);
    }
    
    const columnIds = exportColumns.map(col => col.id);
    
    const filteredData = exportData.map(row => {
      const filteredRow: Record<string, string | number | boolean> = {};
      columnIds.forEach(colId => {
        filteredRow[colId] = row[colId] as string | number | boolean;
      });
      return filteredRow;
    });
    
    const csv = Papa.unparse(filteredData);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `table-data-${timestamp}.csv`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    
    toast({
      title: "Success",
      description: `Exported ${filteredData.length} rows`,
    });
    
    onOpenChange(false);
  };

  return (
    <DialogContent dividers>
      <DialogTitle>Export CSV</DialogTitle>
      
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={exportOptions.visibleColumnsOnly}
                onChange={(e) => 
                  setExportOptions(prev => ({ ...prev, visibleColumnsOnly: e.target.checked }))
                }
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                Export visible columns only
              </Typography>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={exportOptions.currentPageOnly}
                onChange={(e) => 
                  setExportOptions(prev => ({ ...prev, currentPageOnly: e.target.checked }))
                }
                disabled
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="textSecondary">
                Export current page only (Coming soon)
              </Typography>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={exportOptions.allData}
                onChange={(e) => 
                  setExportOptions(prev => ({ ...prev, allData: e.target.checked }))
                }
                disabled
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="textSecondary">
                Export all data (Coming soon)
              </Typography>
            }
          />
        </Box>
      </Box>
      
      <DialogActions>
        <Button 
          variant="outlined" 
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleExport}>
          Download
        </Button>
      </DialogActions>
    </DialogContent>
  );
}