import React, { useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { LabelData } from '../types';

interface FileUploaderProps {
  onDataLoaded: (data: LabelData[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Validar e formatar os dados
        const formattedData = jsonData.map((row: any) => ({
          codigo: String(row.CODIGO || row.codigo || ''),
          produto: String(row.PRODUTO || row.produto || ''),
          valor: String(row.VALOR || row.valor || '')
        }));

        if (formattedData.length > 0) {
          onDataLoaded(formattedData);
        } else {
          console.error('Nenhum dado encontrado no arquivo');
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
      }
    };

    reader.readAsBinaryString(file);
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        p: 3,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        borderRadius: 1,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Solte o arquivo aqui' : 'Arraste e solte um arquivo CSV ou XLSX aqui'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        ou
      </Typography>
      <Button variant="contained" color="primary">
        Selecione um arquivo
      </Button>
      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        Formatos aceitos: CSV, XLSX, XLS
      </Typography>
    </Box>
  );
};

export default FileUploader; 