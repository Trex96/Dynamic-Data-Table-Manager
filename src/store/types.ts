export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: string | number | boolean;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  required?: boolean;
  type: 'string' | 'number' | 'email' | 'date' | 'boolean';
}

export interface TableState {
  data: TableRow[];
  columns: ColumnConfig[];
  searchTerm: string;
  sorting: {
    sortBy: string | null;
    sortDirection: 'asc' | 'desc' | null;
  };
  pagination: {
    currentPage: number;
    rowsPerPage: number;
  };
  ui: {
    loading: boolean;
    editingRowIds: string[];
    selectedRowIds: string[];
  };
  preferences: {
    theme: 'light' | 'dark';
    columnOrder: string[];
  };
}