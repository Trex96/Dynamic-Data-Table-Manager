import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableRow, ColumnConfig, TableState } from './types';
import { sampleData } from '@/lib/sampleData';

const initialState: TableState = {
  data: sampleData,
  columns: [
    { id: 'name', label: 'Name', visible: true, required: true, type: 'string' },
    { id: 'email', label: 'Email', visible: true, required: true, type: 'email' },
    { id: 'age', label: 'Age', visible: true, type: 'number' },
    { id: 'role', label: 'Role', visible: true, type: 'string' },
  ],
  searchTerm: '',
  sorting: {
    sortBy: null,
    sortDirection: null,
  },
  pagination: {
    currentPage: 1,
    rowsPerPage: 10,
  },
  ui: {
    loading: false,
    editingRowIds: [],
    selectedRowIds: [],
  },
  preferences: {
    theme: 'light',
    columnOrder: ['name', 'email', 'age', 'role'],
  },
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = [...action.payload];
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data = [...state.data, action.payload];
    },
    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data = [
          ...state.data.slice(0, index),
          action.payload,
          ...state.data.slice(index + 1)
        ];
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
      state.ui.selectedRowIds = state.ui.selectedRowIds.filter(id => id !== action.payload);
      state.ui.editingRowIds = state.ui.editingRowIds.filter(id => id !== action.payload);
    },

    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column && !column.required) {
        column.visible = !column.visible;
      }
    },
    addCustomColumn: (state, action: PayloadAction<{ id: string; label: string; type: ColumnConfig['type'] }>) => {
      state.columns.push({
        id: action.payload.id,
        label: action.payload.label,
        visible: true,
        type: action.payload.type,
      });
      
      state.preferences.columnOrder.push(action.payload.id);
      
      state.data = state.data.map(row => ({
        ...row,
        [action.payload.id]: action.payload.type === 'boolean' ? false : 
                            action.payload.type === 'number' ? 0 : 
                            ''
      }));
    },
    reorderColumns: (state, action: PayloadAction<string[]>) => {
      state.preferences.columnOrder = action.payload;
    },
    resetColumns: (state) => {
      state.columns = [
        { id: 'name', label: 'Name', visible: true, required: true, type: 'string' },
        { id: 'email', label: 'Email', visible: true, required: true, type: 'email' },
        { id: 'age', label: 'Age', visible: true, type: 'number' },
        { id: 'role', label: 'Role', visible: true, type: 'string' },
      ];
      state.preferences.columnOrder = ['name', 'email', 'age', 'role'];
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },

    setSorting: (state, action: PayloadAction<{ sortBy: string | null; sortDirection: 'asc' | 'desc' | null }>) => {
      state.sorting = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.rowsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },

    setEditingRow: (state, action: PayloadAction<{ id: string; isEditing: boolean }>) => {
      if (action.payload.isEditing) {
        if (!state.ui.editingRowIds.includes(action.payload.id)) {
          state.ui.editingRowIds = [...state.ui.editingRowIds, action.payload.id];
        }
      } else {
        state.ui.editingRowIds = state.ui.editingRowIds.filter(id => id !== action.payload.id);
      }
    },
    selectRow: (state, action: PayloadAction<{ id: string; isSelected: boolean }>) => {
      if (action.payload.isSelected) {
        if (!state.ui.selectedRowIds.includes(action.payload.id)) {
          state.ui.selectedRowIds = [...state.ui.selectedRowIds, action.payload.id];
        }
      } else {
        state.ui.selectedRowIds = state.ui.selectedRowIds.filter(id => id !== action.payload.id);
      }
    },
    clearSelection: (state) => {
      state.ui.selectedRowIds = [];
    },
    selectAllRows: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.ui.selectedRowIds = state.data.map(row => row.id);
      } else {
        state.ui.selectedRowIds = [];
      }
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.preferences.theme = action.payload;
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  toggleColumnVisibility,
  addCustomColumn,
  reorderColumns,
  resetColumns,
  setSearchTerm,
  setSorting,
  setPage,
  setRowsPerPage,
  setEditingRow,
  selectRow,
  clearSelection,
  selectAllRows,
  setTheme,
} = tableSlice.actions;

export default tableSlice.reducer;