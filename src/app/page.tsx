'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { ColumnManager } from '@/components/table/ColumnManager';
import { CSVImport } from '@/components/table/CSVImport';
import { CSVExport } from '@/components/table/CSVExport';
import { useTableData } from '@/hooks/useTableData';
import { useTheme } from 'next-themes';


import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Container, 
  Paper, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon,
  Storage as DatabaseIcon,
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon
} from '@mui/icons-material';

export default function Home() {
  const { setTheme: setReduxTheme, preferences } = useTableData();
  const { theme, setTheme } = useTheme();
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {

    if (preferences.theme && preferences.theme !== theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, setTheme, theme]);


  useEffect(() => {
    if (theme && theme !== preferences.theme) {
      setReduxTheme(theme as 'light' | 'dark');
    }
  }, [theme, preferences.theme, setReduxTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setReduxTheme(newTheme);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DatabaseIcon />
            <Typography variant="h6" component="div">
              Dynamic Data Table Manager
            </Typography>
          </Box>
          <IconButton 
            color="inherit" 
            onClick={toggleTheme} 
            aria-label="toggle theme"
          >
            {!mounted ? (
              <LightModeIcon />
            ) : theme === 'light' ? (
              <DarkModeIcon />
            ) : (
              <LightModeIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Data Management Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your data with advanced sorting, filtering, and CRUD operations
          </Typography>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h5" component="h2">
                Data Table
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your structured data
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                startIcon={<UploadIcon />}
                onClick={() => setIsImportOpen(true)}
              >
                Import
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={() => setIsExportOpen(true)}
              >
                Export
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setIsColumnManagerOpen(true)}
              >
                Columns
              </Button>
            </Box>
          </Box>
          <DataTable
            onManageColumns={() => setIsColumnManagerOpen(true)}
            onImportCSV={() => setIsImportOpen(true)}
            onExportCSV={() => setIsExportOpen(true)}
          />
        </Paper>
      </Container>

      <Dialog 
        open={isColumnManagerOpen} 
        onClose={() => setIsColumnManagerOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          <ColumnManager 
            open={isColumnManagerOpen} 
            onOpenChange={setIsColumnManagerOpen} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsColumnManagerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={isImportOpen} 
        onClose={() => setIsImportOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import CSV</DialogTitle>
        <DialogContent>
          <CSVImport 
            open={isImportOpen} 
            onOpenChange={setIsImportOpen} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsImportOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={isExportOpen} 
        onClose={() => setIsExportOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Export CSV</DialogTitle>
        <DialogContent>
          <CSVExport 
            open={isExportOpen} 
            onOpenChange={setIsExportOpen} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsExportOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}