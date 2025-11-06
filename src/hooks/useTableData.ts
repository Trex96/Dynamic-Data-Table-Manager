import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
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
  setTheme
} from '@/store/tableSlice';
import { TableRow, ColumnConfig } from '@/store/types';

export const useTableData = () => {
  const dispatch: AppDispatch = useDispatch();
  
  const tableState = useSelector((state: RootState) => {
    return state.table;
  });

  const actions = {
    setData: (data: TableRow[]) => dispatch(setData(data)),
    addRow: (row: TableRow) => dispatch(addRow(row)),
    updateRow: (row: TableRow) => dispatch(updateRow(row)),
    deleteRow: (id: string) => dispatch(deleteRow(id)),
    toggleColumnVisibility: (columnId: string) => dispatch(toggleColumnVisibility(columnId)),
    addCustomColumn: (column: { id: string; label: string; type: ColumnConfig['type'] }) => 
      dispatch(addCustomColumn(column)),
    reorderColumns: (columnOrder: string[]) => dispatch(reorderColumns(columnOrder)),
    resetColumns: () => dispatch(resetColumns()),
    setSearchTerm: (term: string) => dispatch(setSearchTerm(term)),
    setSorting: (sorting: { sortBy: string | null; sortDirection: 'asc' | 'desc' | null }) => 
      dispatch(setSorting(sorting)),
    setPage: (page: number) => dispatch(setPage(page)),
    setRowsPerPage: (rowsPerPage: number) => dispatch(setRowsPerPage(rowsPerPage)),
    setEditingRow: (payload: { id: string; isEditing: boolean }) => {
      dispatch(setEditingRow(payload));
    },
    selectRow: (payload: { id: string; isSelected: boolean }) => dispatch(selectRow(payload)),
    clearSelection: () => dispatch(clearSelection()),
    selectAllRows: (selectAll: boolean) => dispatch(selectAllRows(selectAll)),
    setTheme: (theme: 'light' | 'dark') => dispatch(setTheme(theme)),
  };

  return {
    ...tableState,
    ...actions,
  };
};