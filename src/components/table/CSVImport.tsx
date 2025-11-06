'use client';

import { useState, useRef } from 'react';
import { useTableData } from '@/hooks/useTableData';
import { TableRow as TableRowType } from '@/store/types';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import { toast } from '@/hooks/use-toast';

// Material UI imports
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

interface CSVImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CSVImport({ open, onOpenChange }: CSVImportProps) {
  const { data, setData } = useTableData();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, string | number | boolean>[]>([]);
  const [error, setError] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data as Record<string, string | number | boolean>[]);
      },
      error: (error) => {
        setError('Error parsing CSV file: ' + error.message);
      }
    });
  };

  const handleImport = () => {
    if (!parsedData.length) {
      toast({
        title: "Error",
        description: "No data to import",
      });
      return;
    }
    
    const firstRow = parsedData[0];
    if (!firstRow.name || !firstRow.email) {
      toast({
        title: "Error",
        description: "CSV must contain 'name' and 'email' columns",
      });
      return;
    }
    
    const validationErrors: string[] = [];
    parsedData.forEach((row, index) => {
      if (row.age && isNaN(Number(row.age))) {
        validationErrors.push(`Row ${index + 1}: Age must be a number`);
      }
      
      if (typeof row.email === 'string' && row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        validationErrors.push(`Row ${index + 1}: Invalid email format`);
      }
    });
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Errors",
        description: validationErrors.join(", "),
      });
      return;
    }
    
    const newRows: TableRowType[] = parsedData.map(row => ({
      id: uuidv4(),
      name: typeof row.name === 'string' ? row.name : String(row.name),
      email: typeof row.email === 'string' ? row.email : String(row.email),
      age: row.age ? Number(row.age) : 0,
      role: typeof row.role === 'string' ? row.role : String(row.role || ''),
      ...Object.keys(row).reduce((acc, key) => {
        if (!['name', 'email', 'age', 'role'].includes(key)) {
          acc[key] = row[key];
        }
        return acc;
      }, {} as Record<string, string | number | boolean>)
    }));
    
    if (importMode === 'replace') {
      setData(newRows);
    } else {
      setData([...data, ...newRows]);
    }
    
    toast({
      title: "Success",
      description: `Imported ${newRows.length} rows successfully`,
    });
    
    setFile(null);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <DialogContent dividers>
      <DialogTitle>Import CSV</DialogTitle>
      
      {!file ? (
        <Box sx={{ py: 2 }}>
          <Box 
            sx={{ 
              border: '2px dashed', 
              borderColor: 'divider', 
              borderRadius: 1, 
              p: 4, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main'
              }
            }}
            onClick={triggerFileInput}
          >
            <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
            <Typography variant="h6" gutterBottom>
              Drag and drop CSV file
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              or click to browse
            </Typography>
            <Button variant="outlined">
              Select File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      ) : !parsedData.length ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            Parsing CSV file...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ py: 2, maxHeight: 400, overflowY: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preview
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(parsedData[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedData.slice(0, 3).map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {String(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {parsedData.length > 3 && (
                  <TableRow>
                    <TableCell colSpan={Object.keys(parsedData[0]).length} align="center">
                      ... and {parsedData.length - 3} more rows
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Import Options
            </FormLabel>
            <RadioGroup
              value={importMode}
              onChange={(e) => setImportMode(e.target.value as 'replace' | 'append')}
            >
              <FormControlLabel value="replace" control={<Radio />} label="Replace existing data" />
              <FormControlLabel value="append" control={<Radio />} label="Append to existing data" />
            </RadioGroup>
          </FormControl>
        </Box>
      )}
      
      <DialogActions>
        {file && parsedData.length > 0 && (
          <>
            <Button 
              variant="outlined" 
              onClick={() => {
                setFile(null);
                setParsedData([]);
                setError('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleImport}>
              Confirm Import
            </Button>
          </>
        )}
        <Button 
          variant="outlined" 
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </DialogContent>
  );
}