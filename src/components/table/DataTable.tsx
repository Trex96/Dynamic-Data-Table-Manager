'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTableData } from '@/hooks/useTableData';
import { TableRow as TableRowType } from '@/store/types';
import { EditableCell } from './EditableCell';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  Checkbox,
  IconButton,
  Button,
  Chip,
  Box,
  Typography,
  Skeleton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Settings as SettingsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  UnfoldMore as UnfoldMoreIcon
} from '@mui/icons-material';
import { SortDirection } from '@mui/material/TableCell';

interface DataTableProps {
  onManageColumns: () => void;
  onImportCSV: () => void;
  onExportCSV: () => void;
}

export function DataTable({ onManageColumns, onImportCSV, onExportCSV }: DataTableProps) {
  const {
    data,
    columns,
    searchTerm,
    sorting,
    pagination,
    ui,
    preferences,
    setSearchTerm,
    setSorting,
    setPage,
    setRowsPerPage,
    selectRow,
    selectAllRows,
    clearSelection,
    setEditingRow,
    deleteRow,
    updateRow,
    addRow
  } = useTableData();

  useEffect(() => {
  }, [ui]);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [localSearchTerm, setSearchTerm]);

  const filteredData = useMemo(() => {
    if (!localSearchTerm) return data;
    
    const term = localSearchTerm.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(
        value => String(value).toLowerCase().includes(term)
      )
    );
  }, [data, localSearchTerm]);

  const sortedData = useMemo(() => {
    if (!sorting.sortBy || !sorting.sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sorting]);

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.rowsPerPage;
    return sortedData.slice(startIndex, startIndex + pagination.rowsPerPage);
  }, [sortedData, pagination]);

  const visibleColumns = useMemo(() => {
    return columns
      .filter(col => col.visible)
      .sort((a, b) => {
        const aIndex = preferences.columnOrder.indexOf(a.id);
        const bIndex = preferences.columnOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
  }, [columns, preferences.columnOrder]);

  const handleSort = useCallback((columnId: string) => {
    if (sorting.sortBy !== columnId) {
      setSorting({ sortBy: columnId, sortDirection: 'asc' });
    } else if (sorting.sortDirection === 'asc') {
      setSorting({ sortBy: columnId, sortDirection: 'desc' });
    } else {
      setSorting({ sortBy: null, sortDirection: null });
    }
  }, [sorting, setSorting]);

  const getSortDirection = useCallback((columnId: string): SortDirection | undefined => {
    if (sorting.sortBy !== columnId) {
      return undefined;
    }
    
    return sorting.sortDirection as SortDirection;
  }, [sorting]);

  const handleRowSelect = useCallback((id: string, isSelected: boolean) => {
    selectRow({ id, isSelected });
  }, [selectRow]);

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    selectAllRows(event.target.checked);
  }, [selectAllRows]);

  const handleDeleteRow = useCallback((id: string) => {
    deleteRow(id);
    setAnchorEl(null);
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  }, [deleteRow]);

  const handleEditRow = useCallback((id: string) => {
    setAnchorEl(null);
    setEditingRow({ id, isEditing: true });
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  }, [setEditingRow, ui.editingRowIds]);

  const handleSaveCellEdit = useCallback((rowId: string, columnId: string, value: string | number | boolean) => {
    const row = data.find(r => r.id === rowId);
    if (row) {
      const updatedRow = { ...row, [columnId]: value };
      updateRow(updatedRow);
    }
    setEditingRow({ id: rowId, isEditing: false });
  }, [data, updateRow, setEditingRow]);

  const handleCancelCellEdit = useCallback((rowId: string) => {
    setEditingRow({ id: rowId, isEditing: false });
  }, [setEditingRow]);

  const handleDuplicateRow = useCallback((row: TableRowType) => {
    const newRow = {
      ...row,
      id: `${row.id}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    };
    
    addRow(newRow);
    
    setAnchorEl(null);
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  }, [addRow]);

  const allSelected = useMemo(() => 
    paginatedData.length > 0 && paginatedData.every(row => ui.selectedRowIds.includes(row.id)),
    [paginatedData, ui.selectedRowIds]
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    menuButtonRef.current = event.currentTarget;
    setAnchorEl(event.currentTarget);
    setCurrentRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(1);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search all columns..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, my: 0.5 }} />,
            }}
            sx={{ minWidth: 200 }}
          />
          {localSearchTerm && (
            <Chip 
              label={`${filteredData.length} result${filteredData.length !== 1 ? 's' : ''}`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<CloudUploadIcon />}
            onClick={onImportCSV}
          >
            Import CSV
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<CloudDownloadIcon />}
            onClick={onExportCSV}
          >
            Export CSV
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<SettingsIcon />}
            onClick={onManageColumns}
          >
            Manage Columns
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  onChange={handleSelectAll}
                  indeterminate={ui.selectedRowIds.length > 0 && !allSelected}
                />
              </TableCell>
              
              {visibleColumns.map((column) => (
                <TableCell 
                  key={`header-${column.id}`}
                  sortDirection={getSortDirection(column.id)}
                >
                  <TableSortLabel
                    active={sorting.sortBy === column.id}
                    direction={getSortDirection(column.id) || 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                    {sorting.sortBy === column.id ? (
                      sorting.sortDirection === 'asc' ? (
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 1 }} />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
                      )
                    ) : (
                      <UnfoldMoreIcon fontSize="small" sx={{ ml: 1 }} />
                    )}
                  </TableSortLabel>
                </TableCell>
              ))}
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {ui.loading ? (
              Array.from({ length: pagination.rowsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={`skeleton-${column.id}-${index}`}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton variant="rectangular" width={40} height={20} />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow key="empty-state">
                <TableCell colSpan={visibleColumns.length + 2} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No results found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow 
                  key={`row-${row.id}-${ui.editingRowIds.includes(row.id) ? 'editing' : 'not-editing'}`} 
                  selected={ui.selectedRowIds.includes(row.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={ui.selectedRowIds.includes(row.id)}
                      onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                    />
                  </TableCell>
                  
                  {visibleColumns.map((column) => {
                    const isEditing = ui.editingRowIds.includes(row.id);
                    return (
                      <TableCell key={`cell-${row.id}-${column.id}`}>
                        {isEditing ? (
                          <EditableCell
                            rowId={row.id}
                            columnId={column.id}
                            value={row[column.id]}
                            columnType={column.type}
                            onSave={(value) => handleSaveCellEdit(row.id, column.id, value)}
                            onCancel={() => handleCancelCellEdit(row.id)}
                          />
                        ) : (
                          String(row[column.id])
                        )}
                      </TableCell>
                    );
                  })}
                  
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls="row-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, row.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.currentPage - 1}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelDisplayedRows={({ from, to, count }) => 
          `Showing ${from} to ${to} of ${count} entries`
        }
      />

      <Menu
        id="row-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => currentRowId && handleEditRow(currentRowId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          const row = data.find(r => r.id === currentRowId);
          if (row) handleDuplicateRow(row);
        }}>
          <FileCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => currentRowId && handleDeleteRow(currentRowId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}